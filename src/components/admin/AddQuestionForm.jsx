import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useLevels } from "../../context/LevelContext";
import MarkdownEditor from "./MarkdownEditor";

export default function AddQuestionForm() {
  const [levelData, setLevelData] = useState({
    question: "",
    answer: "",
    explanation: "",
    hint: "",
    options: [], // Start with empty array - options are optional
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
          // Use existing options or empty array if none exist
          options: currentLevel?.options || [],
        });
      }
    } else {
      // Reset form when there is no ID
      setLevelData({
        question: "",
        answer: "",
        explanation: "",
        hint: "",
        options: [], // Reset to empty array
      });
    }
  }, [params?.id, levels]);

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
      options: [],
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
      // Filter out empty options before sending
      const dataToSend = {
        ...levelData,
        options: levelData.options.filter(option => option.trim() !== "")
      };
      
      const response = await api.post("/api/levels", dataToSend, {
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
      // Filter out empty options before sending
      const dataToSend = {
        ...levelData,
        options: levelData.options.filter(option => option.trim() !== "")
      };
      
      const response = await api.put(`/api/levels/${params?.id}`, dataToSend, {
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
          <MarkdownEditor
            label="Question"
              value={levelData.question}
            onChange={(e) =>
              setLevelData((prev) => ({ ...prev, question: e.target.value }))
            }
            placeholder="Write the question here with Markdown support..."
            rows={2}
            />

          {/* Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm sm:text-base font-bold text-gray-800">
                Options (Optional)
            </label>
              <button
                type="button"
                onClick={() => {
                  if (levelData.options.length === 0) {
                    setLevelData(prev => ({ ...prev, options: [""] }));
                  } else {
                    setLevelData(prev => ({ ...prev, options: [] }));
                  }
                }}
                className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                {levelData.options.length === 0 ? "➕ Add Options" : "➖ Remove Options"}
              </button>
            </div>
            
            {levelData.options.length > 0 && (
              <div className="space-y-2">
                {levelData.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex-1">
                      <MarkdownEditor
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...levelData.options];
                          newOptions[idx] = e.target.value;
                          setLevelData(prev => ({ ...prev, options: newOptions }));
                        }}
                        placeholder={`Option ${idx + 1} with Markdown support...`}
                        rows={1}
            />
          </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = levelData.options.filter((_, index) => index !== idx);
                        setLevelData(prev => ({ ...prev, options: newOptions }));
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove option"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setLevelData(prev => ({ 
                      ...prev, 
                      options: [...prev.options, ""] 
                    }));
                  }}
                  className="text-xs px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                >
                  ➕ Add Another Option
                </button>
              </div>
            )}
          </div>

          {/* Answer */}
          <MarkdownEditor
            label="Answer"
            value={levelData.answer}
            onChange={(e) =>
              setLevelData((prev) => ({ ...prev, answer: e.target.value }))
            }
            placeholder="Correct answer with Markdown support..."
            rows={2}
          />

          {/* Hint */}
          <MarkdownEditor
            label="Hint"
            value={levelData.hint}
            onChange={(e) =>
              setLevelData((prev) => ({ ...prev, hint: e.target.value }))
            }
            placeholder="Provide a helpful hint with Markdown support..."
            rows={2}
          />

          {/* Explanation */}
          <MarkdownEditor
            label="Explanation"
            value={levelData.explanation}
            onChange={(e) =>
              setLevelData((prev) => ({ ...prev, explanation: e.target.value }))
            }
            placeholder="Explain the answer with Markdown support..."
            rows={3}
          />

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
