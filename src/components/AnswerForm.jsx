import { useState } from "react";
import { useLevels } from "../context/LevelContext";
import playSound from "../utils/playSound";
import Marker from "./Marker";

export default function AnswerForm({ onAnswer, mark, levelIndex }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const { levels } = useLevels();

  return (
    <div className="flex flex-col justify-between h-[400px] font-[Patrick_Hand] text-gray-800 relative">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-center text-indigo-800">
          Brain Test
        </h2>

        {/* Level and Hints button row */}
        <div className="flex items-center justify-center gap-4 bg-white/80 px-6 py-1 rounded-2xl">
          {/* Level display */}
          <div className="text-center">
            <p className="font-extrabold text-2xl text-[#444] tracking-wide uppercase select-none drop-shadow-sm">
              Level {levelIndex + 1}
            </p>
          </div>

          {/* Hints section */}
          <div className="relative flex items-center gap-2">
            {/* Hint Button */}
            <button
              onClick={() => {
                playSound("/sounds/button-sound.mp3");
                setShowHints(true);
              }}
              title="Show Hints"
              className="w-15 h-15 flex items-center justify-center"
              aria-label="Show hints"
            >
              <img
                src="/icons/hint.png"
                alt="Hint Icon"
                className="w-15 h-15"
              />
            </button>

            {/* Hint Count */}
            <span className="text-xl font-bold text-[#444] mt-[-20px] ml-[-28px] select-none">
              ×15
            </span>
          </div>
        </div>

        <p className="text-xl text-center leading-snug mb-6 px-4 font-[Google_Sans]">
          {levels[levelIndex]?.question}
        </p>

        <input
          type="text"
          value={userAnswer}
          placeholder="✍️ Write your answer here in English"
          className="w-full px-4 py-3 border-b-2 border-dashed border-gray-400 bg-yellow-100/60 text-lg font-medium placeholder-gray-500 focus:outline-none rounded-t-md"
          onChange={(e) => setUserAnswer(e.target.value)}
        />
      </div>

      <div className="mt-4">
        {!mark ? (
          <button
            onClick={() => onAnswer(userAnswer, levels[levelIndex])}
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
