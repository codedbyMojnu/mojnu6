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
    hint: "",
    options: ["", "", "", ""], // default 4 options
  });
  const { user } = useAuth();
  const { levels, setLevels } = useLevels();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params?.id) {
      // Find the specific level to edit
      const currentLevel = levels?.find((level) => level?._id === params?.id);
      if (currentLevel) {
        setLevelData({
          question: currentLevel.question,
          answer: currentLevel.answer,
          explanation: currentLevel.explanation,
          hint: currentLevel.hint,
          // Ensure options array is always valid
          options:
            currentLevel?.options?.length > 0
              ? currentLevel?.options
              : ["", "", "", ""],
        });
      }
    } else {
      // Reset form when there is no ID
      setLevelData({
        question: "",
        answer: "",
        explanation: "",
        hint: "",
        options: ["", "", "", ""],
      });
    }
  }, [params?.id, levels]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setLevelData((prev) => ({ ...prev, [name]: value }));
  }

  function handleOptionChange(e, index) {
    const newOptions = [...levelData.options];
    newOptions[index] = e.target.value;
    setLevelData((prev) => ({ ...prev, options: newOptions }));
  }

  function resetFormAndNavigate(path) {
    setLevelData({
      question: "",
      answer: "",
      explanation: "",
      hint: "",
      options: ["", "", "", ""],
    });
    navigate(path);
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      const response = await api.delete(`/api/levels/${params?.id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.status === 200) {
        setLevels(levels?.filter((level) => level._id !== params?.id));
        resetFormAndNavigate(`/dashboard/deleted/${params?.id}`);
      }
    } catch (error) {
      console.error("Failed to delete level:", error);
    }
  }

  async function addLevel() {
    try {
      const response = await api.post("/api/levels", levelData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.status === 201) {
        // ✅ Use 201 for Created
        setLevels([...levels, response?.data]);
        resetFormAndNavigate(`/dashboard/added/${response?.data?._id}`);
      }
    } catch (error) {
      console.error("Failed to add level:", error);
    }
  }

  async function updateLevel() {
    try {
      const response = await api.put(`/api/levels/${params?.id}`, levelData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.status === 200) {
        setLevels(
          levels?.map((level) =>
            level._id === params?.id ? response.data : level
          )
        );
        resetFormAndNavigate(`/dashboard/edited/${params?.id}`);
      }
    } catch (error) {
      console.error("Failed to update level:", error);
    }
  }

  // Common input styles for a consistent look
  const inputClassName =
    "w-full px-3 py-2 bg-transparent border-b-2 border-dashed border-gray-500 text-base placeholder-gray-600 rounded-t-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition";

  return (
    <div
      className="min-h-screen p-2 sm:p-4 flex items-center justify-center font-[Patrick_Hand]"
      style={{
        backgroundImage: "url('/bg-images/wood.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Form Container with better responsive design */}
      <div className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200">
        <div className="p-4 sm:p-6 space-y-3 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-3 pb-2 border-b-2 border-dashed border-gray-300">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {params?.id ? "✏️ Edit Question" : "➕ Add New Question"}
            </h1>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm sm:text-base font-bold mb-1 text-gray-800">
              Question
            </label>
            <input
              type="text"
              name="question"
              value={levelData.question}
              onChange={handleInputChange}
              placeholder="Write the question here"
              className={inputClassName}
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm sm:text-base font-bold mb-2 text-gray-800">
              Options
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {levelData?.options?.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={opt}
                  placeholder={`Option ${idx + 1}`}
                  onChange={(e) => handleOptionChange(e, idx)}
                  className={inputClassName}
                />
              ))}
            </div>
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm sm:text-base font-bold mb-1 text-gray-800">
              Answer
            </label>
            <input
              type="text"
              name="answer"
              value={levelData.answer}
              onChange={handleInputChange}
              placeholder="Correct answer"
              className={inputClassName}
            />
          </div>

          {/* Hint */}
          <div>
            <label className="block text-sm sm:text-base font-bold mb-1 text-gray-800">
              Hint
            </label>
            <textarea
              rows={2}
              name="hint"
              placeholder="Provide a helpful hint"
              className={inputClassName}
              value={levelData.hint}
              onChange={handleInputChange}
            />
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm sm:text-base font-bold mb-1 text-gray-800">
              Explanation
            </label>
            <textarea
              rows={2}
              name="explanation"
              placeholder="Explain the answer"
              className={inputClassName}
              value={levelData.explanation}
              onChange={handleInputChange}
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex flex-wrap gap-3 justify-center">
            {!params?.id ? (
              <button
                className="flex-1 bg-[#85cc3c] hover:bg-[#76b535] text-white font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 rounded-xl border-b-4 border-r-2 border-[#6d4d3a] shadow-lg transform active:translate-y-px transition"
                onClick={addLevel}
              >
                ➕ Add Question
              </button>
            ) : (
              <>
                <button
                  className="flex-1 bg-[#3c85cc] hover:bg-[#3576b5] text-white font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 rounded-xl border-b-4 border-r-2 border-[#3a5d6d] shadow-lg transform active:translate-y-px transition"
                  onClick={updateLevel}
                >
                  💾 Update
                </button>
                <button
                  className="flex-1 bg-[#cc3c3c] hover:bg-[#b53535] text-white font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 rounded-xl border-b-4 border-r-2 border-[#6d3a3a] shadow-lg transform active:translate-y-px transition"
                  onClick={handleDelete}
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
