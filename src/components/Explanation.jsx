import { useCallback } from "react";
import { useLevels } from "../context/LevelContext";
import Confetti from "./Confetti";
import MarkdownRenderer from "./MarkdownRenderer";

export default function Explanation({ onNext, levelIndex }) {
  const { levels } = useLevels();

  const handleNextClick = useCallback(() => {
    onNext();
  }, [onNext]);

  return (
    <div className="flex flex-col h-full font-[Patrick_Hand] text-gray-800 relative">
      {/* Confetti celebration */}
      <Confetti trigger={true} />
      {/* Header */}
      <div className="text-center mb-2 sm:mb-3 px-2 sm:px-4">
        <h2 className="text-responsive-base sm:text-responsive-lg font-bold text-green-700 mb-1">
          🎉 Correct Answer!
        </h2>
        <p className="text-responsive-xs text-gray-600">
          Level {levelIndex + 1} completed successfully
        </p>
      </div>

      {/* Explanation Display */}
      <div className="rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 px-2 sm:px-4 flex-1 overflow-y-auto">
        <div className="rounded-lg p-2 sm:p-3 explanation-content">
          <MarkdownRenderer
            content={
              levels[levelIndex]?.explanation ||
              "Great job solving this puzzle! Keep up the excellent work!"
            }
            className="text-responsive-xs sm:text-responsive-sm"
            proseClassName="prose prose-sm max-w-none"
          />
        </div>
      </div>

      {/* Next Button */}
      <div className="px-2 sm:px-4 mt-auto">
        <button
          onClick={handleNextClick}
          className="btn btn-primary btn-animated w-full text-responsive-xs sm:text-responsive-base py-2 sm:py-3"
        >
          Next Level →
        </button>
      </div>
    </div>
  );
}
