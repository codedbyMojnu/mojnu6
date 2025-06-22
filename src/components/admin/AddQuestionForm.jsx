import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useLevels } from "../../context/LevelContext";
export default function AddQuestionForm() {
  const [levelData, setLevelData] = useState({
    question: "",
    answer: "",
    explanation: "",
  });
  const { user } = useAuth();
  const { levels, setLevels } = useLevels();
  const navigate = useNavigate();
  const prams = useParams();

  // check edit mode or add mode
  useEffect(() => {
    if (prams?.id) {
      const filterTheActualLevel = levels?.filter(
        (level) => level?._id == prams?.id
      );
      setLevelData({
        question: filterTheActualLevel[0]?.question ?? "",
        answer: filterTheActualLevel[0]?.answer ?? "",
        explanation: filterTheActualLevel[0]?.explanation ?? "",
      });
    }
  }, [prams?.id, levels]);

  // Handle Delete
  async function handleDelete() {
    const response = await api.delete(`/api/levels/${prams?.id}`, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    if (response.status === 200) {
      const presentLevels = levels?.filter((level) => level._id !== prams?.id);
      setLevels(presentLevels);
      setLevelData({
        question: "",
        answer: "",
        explanation: "",
      });
      navigate(`/dashboard/deleted/${prams?.id}`);
    }
  }

  async function addLevel() {
    console.log(levelData, "Level Data");
    const response = await api.post("/api/levels", levelData, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    if (response?.statusText === "Created") {
      setLevels([...levels, response?.data]);
      setLevelData({
        question: "",
        answer: "",
        explanation: "",
      });
      navigate(`/dashboard/added/${response?.data?._id}`);
    }
  }

  async function updateLevel() {
    const updatedLevel = { ...levelData, _id: prams?.id };
    const response = await api.put(`/api/levels/${prams?.id}`, updatedLevel, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    if (response.status === 200) {
      const newLevels = levels?.map((level) => {
        if (level._id === prams?.id) {
          return response?.data;
        }
        return level;
      });
      setLevels(newLevels);
      setLevelData({
        question: "",
        answer: "",
        explanation: "",
      });
      navigate(`/dashboard/edited/${prams?.id}`);
    }
  }

  return (
    <div
      className="w-full h-full p-10 pt-2 font-[Patrick_Hand]"
      style={{
        backgroundImage: "url('/bg-images/wood.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h2 className="text-4xl text-center font-bold text-indigo-800 mb-8">
        ✍️ {prams?.id ? "Edit" : "Add"} Question
      </h2>

      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <label className="block text-xl font-bold mb-2 text-gray-700">
            Question
          </label>
          <input
            type="text"
            value={levelData?.question}
            onChange={(e) =>
              setLevelData({ ...levelData, question: e.target.value })
            }
            placeholder="✍️ Write the question here"
            className="w-full px-4 py-3 border-b-2 border-dashed border-gray-400  text-lg placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block text-xl font-bold mb-2 text-gray-700">
            Answer
          </label>
          <input
            type="text"
            value={levelData?.answer}
            onChange={(e) =>
              setLevelData({ ...levelData, answer: e.target.value })
            }
            placeholder="✍️ Write the answer here in English Number"
            className="w-full px-4 py-3 border-b-2 border-dashed border-gray-400  text-lg placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block text-xl font-bold mb-2 text-gray-700">
            Explanation
          </label>
          <textarea
            rows="2"
            placeholder="✍️ Explain the answer here"
            className="w-full px-4 py-3 border-b-2 border-dashed border-gray-400 text-lg placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={levelData?.explanation}
            onChange={(e) =>
              setLevelData({ ...levelData, explanation: e.target.value })
            }
          ></textarea>
        </div>

        <div className="pt-4 flex flex-wrap gap-4 justify-center">
          {!prams?.id && (
            <button
              className="flex-grow bg-[#85cc3c] hover:bg-[#76b535] text-white font-semibold text-xl px-6 py-3 rounded-2xl border-b-8 border-r-4 border-[#6d4d3a] shadow-lg transform active:translate-y-1 transition"
              onClick={addLevel}
            >
              ➕ Add
            </button>
          )}
          {prams?.id && (
            <button
              className="flex-grow bg-[#3c85cc] hover:bg-[#3576b5] text-white font-semibold text-xl px-6 py-3 rounded-2xl border-b-8 border-r-4 border-[#3a5d6d] shadow-lg transform active:translate-y-1 transition"
              onClick={updateLevel}
            >
              💾 Update
            </button>
          )}
          {prams?.id && (
            <button
              className="flex-grow bg-[#cc3c3c] hover:bg-[#b53535] text-white font-semibold text-xl px-6 py-3 rounded-2xl border-b-8 border-r-4 border-[#6d3a3a] shadow-lg transform active:translate-y-1 transition"
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
