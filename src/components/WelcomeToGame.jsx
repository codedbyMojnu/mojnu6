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
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-100px)] px-2 sm:px-4">
      <div className="bg-[#232b3e] rounded-3xl p-8 w-full max-w-xl flex flex-col items-center text-center">
        {/* Welcome Header */}
        <div className="mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            🧩 Welcome to Puzzle Quest!
          </h1>
          <p className="text-base sm:text-lg text-gray-300">
            Ready to challenge your mind?
          </p>
        </div>

        {/* Game Info */}
        <div className="bg-blue-400/20 rounded-2xl p-4 mb-4 w-full">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🎯</span>
            <span className="text-lg font-semibold text-blue-300">
              Level {levelIndex + 1}
            </span>
          </div>
          <p className="text-sm text-blue-100">
            Solve puzzles, earn points, and become a master!
          </p>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-6 w-full">
          <div className="flex items-center gap-2 text-base text-green-300">
            <span>✓</span>
            <span>Brain-teasing puzzles</span>
          </div>
          <div className="flex items-center gap-2 text-base text-green-300">
            <span>✓</span>
            <span>Hint system available</span>
          </div>
          <div className="flex items-center gap-2 text-base text-green-300">
            <span>✓</span>
            <span>Progress tracking</span>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartGame}
          className="w-full rounded-2xl bg-blue-400 text-[#181f2a] font-bold text-lg px-8 py-4 hover:bg-yellow-400 hover:text-[#181f2a] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        >
          🚀 Start Game
        </button>

        {/* Footer */}
        <div className="mt-4 text-sm text-gray-400">
          <p>Good luck, puzzle master! 🧠</p>
        </div>
      </div>
    </div>
  );
}
