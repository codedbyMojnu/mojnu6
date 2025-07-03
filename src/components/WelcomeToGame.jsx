import { useCallback, useEffect, useState } from "react";
import playSound from "../utils/playSound.jsx";

export default function WelcomeToGame({ setBgMusicOn, setWelcome }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: "💻",
      title: "Frontend Interview Questions",
      description:
        "Practice real-world HTML, CSS, and JavaScript questions asked by top companies.",
    },
    {
      icon: "📅",
      title: "Daily Practice Streaks",
      description: "Stay consistent and track your progress every day.",
    },
    {
      icon: "🧑‍💻",
      title: "Expert Guidance by mojnu6",
      description: "Get tips and hints from your mentor mojnu6 as you solve each challenge.",
    },
    {
      icon: "🚀",
      title: "Level Up & Get Interview Ready",
      description: "Advance through levels and build confidence for your next interview.",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleStartGame = useCallback(() => {
    playSound("/sounds/button-sound.mp3");
    setBgMusicOn(true);
    setWelcome(false);
    // Scroll to top when starting the game
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [setBgMusicOn, setWelcome]);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-white font-sans" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Main Content Container */}
      <div
        className={`w-full max-w-2xl mx-auto px-2 sm:px-6 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-700 mb-2 leading-tight tracking-tight">
              mojnu6 InterviewPrep
              <span className="text-gray-700 ml-2 sm:ml-4">for Frontend Devs</span>
            </h1>
            <div className="w-16 h-1 bg-blue-400 mx-auto rounded-full"></div>
          </div>

          <p className="text-base sm:text-lg text-gray-700 font-light max-w-xl mx-auto leading-relaxed">
            Welcome to <span className="font-bold text-blue-600">mojnu6 InterviewPrep</span>! Practice daily frontend interview questions, sharpen your skills, and get ready to crack your next job interview. Guided by your mentor <span className="font-bold text-pink-600">mojnu6</span>, you'll level up with real-world challenges and smart hints.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative p-4 rounded-md bg-gray-50 border border-gray-200 transition-all duration-500 ${
                currentFeature === index ? "ring-2 ring-blue-400/50" : ""
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-3xl sm:text-4xl mb-2 transition-all duration-300 ${
                    currentFeature === index ? "animate-bounce" : ""
                  }`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-blue-700 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center mb-6">
          <button
            onClick={handleStartGame}
            className="w-full py-3 text-lg font-bold text-white bg-blue-600 rounded-md transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-opacity-70"
          >
            <span className="flex items-center justify-center">
              <span className="mr-2">🚀</span>
              Start Practicing Now
              <span className="ml-2">💡</span>
            </span>
          </button>
          <p className="mt-3 text-sm text-gray-500 font-light">
            Click to begin your frontend interview prep journey with mojnu6! 🚀
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto mb-4">
          <div className="text-center p-3 rounded-md bg-gray-50 border border-gray-200">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
              100+
            </div>
            <div className="text-xs text-gray-600">Puzzles</div>
          </div>
          <div className="text-center p-3 rounded-md bg-gray-50 border border-gray-200">
            <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">
              5
            </div>
            <div className="text-xs text-gray-600">Difficulty Levels</div>
          </div>
          <div className="text-center p-3 rounded-md bg-gray-50 border border-gray-200">
            <div className="text-xl sm:text-2xl font-bold text-pink-600 mb-1">
              ∞
            </div>
            <div className="text-xs text-gray-600">Fun Hours</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
            <span>✨</span>
            <span className="font-light">Ready to unlock your potential?</span>
            <span>✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}
