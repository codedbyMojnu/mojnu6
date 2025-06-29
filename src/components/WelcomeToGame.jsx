import { useCallback } from "react";
import playSound from "../utils/playSound.jsx";

export default function WelcomeToGame({
  setBgMusicOn,
  setWelcome,
  levelIndex,
}) {
  const handleStartGame = useCallback(() => {
    playSound("/sounds/button-sound.mp3");
    setBgMusicOn(true);
    setWelcome(false);
  }, [setBgMusicOn, setWelcome]);

  return (
    <div className="flex flex-col h-full items-center justify-center text-center px-2 sm:px-4 animate-fade-in animate-floating-welcome">
      {/* Welcome Header */}
      <div className="mb-3 sm:mb-4">
        <h1 className="text-responsive-xl sm:text-responsive-2xl font-bold text-gray-800 mb-2">
          🧩 Welcome to Puzzle Quest!
        </h1>
        <p className="text-responsive-xs sm:text-responsive-sm text-gray-600">
          Ready to challenge your mind?
        </p>
      </div>

      {/* Game Info */}
      <div className="bg-blue-50/50 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 w-full max-w-xs sm:max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl sm:text-2xl">🎯</span>
          <span className="text-responsive-xs sm:text-responsive-sm font-semibold text-blue-700">
            Level {levelIndex + 1}
          </span>
        </div>
        <p className="text-responsive-xs text-gray-600">
          Solve puzzles, earn points, and become a master!
        </p>
      </div>

      {/* Features */}
      <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 w-full max-w-xs sm:max-w-sm">
        <div className="flex items-center gap-2 text-responsive-xs text-gray-700">
          <span className="text-green-500">✓</span>
          <span>Brain-teasing puzzles</span>
        </div>
        <div className="flex items-center gap-2 text-responsive-xs text-gray-700">
          <span className="text-green-500">✓</span>
          <span>Hint system available</span>
        </div>
        <div className="flex items-center gap-2 text-responsive-xs text-gray-700">
          <span className="text-green-500">✓</span>
          <span>Progress tracking</span>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStartGame}
        className="btn btn-primary btn-animated text-responsive-base sm:text-responsive-lg font-bold px-6 sm:px-8 py-2 sm:py-3 w-full max-w-xs sm:max-w-sm"
      >
        🚀 Start Game
      </button>

      {/* Footer */}
      <div className="mt-3 sm:mt-4 text-responsive-xs text-gray-500">
        <p>Good luck, puzzle master! 🧠</p>
      </div>
    </div>
  );
}
