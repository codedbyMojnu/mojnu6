import { useCallback } from "react";
import { useLevels } from "../context/LevelContext";

export default function Explanation({ onNext, levelIndex }) {
  const { levels } = useLevels();

  const handleNextClick = useCallback(() => {
    onNext();
  }, [onNext]);

  return (
    <div className="flex flex-col h-full font-[Patrick_Hand] text-gray-800 relative">
      {/* Header */}
      <div className="text-center mb-3 px-4">
        <h2 className="text-responsive-lg font-bold text-green-700 mb-1">
          🎉 Correct Answer!
        </h2>
        <p className="text-responsive-xs text-gray-600">
          Level {levelIndex + 1} completed successfully
        </p>
      </div>

      {/* Answer Display */}
      <div className="bg-green-50/50 rounded-lg p-3 border-l-4 border-green-400 mb-3 px-4 flex-1 max-h-[60px] overflow-y-auto">
        <p className="text-responsive-sm font-[Google_Sans] leading-snug text-gray-800">
          <span className="font-semibold text-green-700">Answer:</span>{" "}
          {levels[levelIndex]?.answer}
        </p>
      </div>

      {/* Explanation Display */}
      <div className="bg-blue-50/50 rounded-lg p-3 border-l-4 border-blue-400 mb-3 px-4 flex-1 overflow-y-auto">
        <p className="text-responsive-sm font-[Google_Sans] leading-snug text-gray-800">
          <span className="font-semibold text-blue-700">Explanation:</span>{" "}
          {levels[levelIndex]?.explanation ||
            "Great job solving this puzzle! Keep up the excellent work!"}
        </p>
      </div>

      {/* Next Button */}
      <div className="px-4 mt-auto">
        <button
          onClick={handleNextClick}
          className="btn btn-primary w-full text-responsive-base"
        >
          Next Level →
        </button>
      </div>
    </div>
  );
}
