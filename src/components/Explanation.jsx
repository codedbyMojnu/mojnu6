import { useCallback } from "react";
import { useLevels } from "../context/LevelContext";
import MarkdownRenderer from "./MarkdownRenderer";

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

      {/* Explanation Display */}
      <div className="rounded-lg p-3 mb-3 px-4 flex-1 overflow-y-auto">
        <div className="rounded-lg p-3 explanation-content">
          <MarkdownRenderer
            content={
              levels[levelIndex]?.explanation ||
              "Great job solving this puzzle! Keep up the excellent work!"
            }
            className="text-responsive-sm"
            proseClassName="prose prose-sm max-w-none"
          />
        </div>
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
