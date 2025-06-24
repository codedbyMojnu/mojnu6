import { useState } from "react";
import { useLevels } from "../context/LevelContext";
import Marker from "./Marker";

export default function AnswerForm({ onAnswer, mark, levelIndex }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const { levels } = useLevels();

  function handleTextAnswer() {
    if (userAnswer.trim()) {
      onAnswer(userAnswer, levels[levelIndex]);
    }
  }

  function handleOptionAnswer(option) {
    setSelectedOption(option);
    onAnswer(option, levels[levelIndex]);
  }

  return (
    <div className="flex flex-col justify-between h-[400px] font-[Patrick_Hand] text-gray-800 relative">
      <div className="text-md leading-snug mb-6 px-4 font-[Google_Sans]">
        {levels[levelIndex]?.question}
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-row justify-center gap-4 mb-4">
        {/* Skip Button */}
        <button
          type="button"
          title="Skip"
          onClick={() => {/* TODO: implement skip logic */}}
          className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition duration-300 shadow-md border border-blue-400 flex items-center justify-center text-blue-700 text-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {/* Skip SVG */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        {/* Use Hint Button */}
        <button
          type="button"
          title="Use Hint"
          onClick={() => setShowHints(true)}
          className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 transition duration-300 shadow-md border border-yellow-400 flex items-center justify-center text-yellow-700 text-xl focus:outline-none focus:ring-2 focus:ring-yellow-300"
        >
          {/* Hint SVG */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12" y2="17" />
          </svg>
        </button>
      </div>

      {!levels[levelIndex]?.options?.length > 0 && (
        <input
          type="text"
          value={userAnswer}
          autoFocus
          placeholder="✍️ Write your answer here in English"
          className="w-full px-4 py-3 border-b-2 border-dashed border-gray-400 bg-yellow-100/60 text-lg font-medium placeholder-gray-500 focus:outline-none"
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onAnswer(userAnswer, levels[levelIndex]);
            }
          }}
        />
      )}

      {/* Options */}
      {levels[levelIndex]?.options?.length > 0 && (
        <div className="grid grid-cols-1 gap-3 px-4">
          {levels[levelIndex]?.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionAnswer(option)}
              className="w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium text-lg shadow-lg"
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4">
        {!mark && !levels[levelIndex]?.options?.length > 0 ? (
          <button
            onClick={() => handleTextAnswer()}
            className="w-full bg-[#85cc3c] hover:bg-[#76b535] transition text-white py-3 text-2xl rounded-2xl border-b-8 border-r-4 border-[#a17358] shadow-md transform active:translate-y-1 animate-pulse-pop"
          >
            Submit Answer
          </button>
        ) : (
          <Marker mark={mark} />
        )}
      </div>

      {/* Modal */}
      {showHints && (
        <div
          className="absolute top-5 left-1/2 transform -translate-x-1/2
               z-50 bg-yellow-100 rounded-3xl p-5 shadow-xl
               w-[90%] max-w-[400px] max-h-[240px] overflow-y-auto
               border border-indigo-600 font-[Comic_Sans_MS] text-indigo-900"
        >
          {/* Close Button */}
          <button
            onClick={() => setShowHints(false)}
            className="absolute top-2 right-3 text-indigo-700 hover:text-indigo-900 text-xl font-bold"
            aria-label="Close"
          >
            &times;
          </button>

          <h3 className="text-xl font-bold text-center mb-3">🧩 Puzzle Hint</h3>

          <p className="text-base text-center leading-relaxed">
            {levels[levelIndex]?.hint ||
              "No hint available for this level. Try to think outside the box!"}
          </p>
        </div>
      )}
    </div>
  );
}
