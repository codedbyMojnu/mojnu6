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
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
      {/* Main Content Container */}
      <div
        className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white mb-4 leading-tight tracking-tight drop-shadow-2xl animate-floating-welcome">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                mojnu6 InterviewPrep
              </span>
              <span className="text-white ml-2 sm:ml-4">for Frontend Devs</span>
          </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full animate-pulse"></div>
          </div>

          <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed opacity-90 animate-fade-in">
            Welcome to <span className="font-bold text-blue-200">mojnu6 InterviewPrep</span>! Practice daily frontend interview questions, sharpen your skills, and get ready to crack your next job interview. Guided by your mentor <span className="font-bold text-pink-200">mojnu6</span>, you'll level up with real-world challenges and smart hints.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 sm:mb-16 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/15 ${
                currentFeature === index
                  ? "ring-2 ring-blue-400/50 shadow-lg"
                  : ""
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-4xl sm:text-5xl mb-4 transition-all duration-300 group-hover:scale-110 ${
                    currentFeature === index ? "animate-bounce" : ""
                  }`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center mb-8 sm:mb-12">
          <button
            onClick={handleStartGame}
            className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-6 text-xl sm:text-2xl font-bold text-white bg-blue-600 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:ring-opacity-70 animate-pulse-pop"
          >
            <span className="relative z-10 flex items-center">
              <span className="mr-3">🚀</span>
              Start Practicing Now
              <span className="ml-3">💡</span>
            </span>
            {/* Button Background Animation */}
            <div className="absolute inset-0 rounded-full bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
          </button>
          <p className="mt-4 text-sm sm:text-base text-gray-400 font-light opacity-80 animate-fade-in">
            Click to begin your frontend interview prep journey with mojnu6! 🚀
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">
              100+
            </div>
            <div className="text-sm text-gray-300">Puzzles</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1">
              5
            </div>
            <div className="text-sm text-gray-300">Difficulty Levels</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-2xl sm:text-3xl font-bold text-pink-400 mb-1">
              ∞
            </div>
            <div className="text-sm text-gray-300">Fun Hours</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
            <span>✨</span>
            <span className="font-light">Ready to unlock your potential?</span>
            <span>✨</span>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-bounce">
        <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
      </div>
      <div
        className="absolute top-40 right-20 opacity-20 animate-bounce"
        style={{ animationDelay: "1s" }}
      >
        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
      </div>
      <div
        className="absolute bottom-40 left-20 opacity-20 animate-bounce"
        style={{ animationDelay: "2s" }}
      >
        <div className="w-5 h-5 bg-pink-400 rounded-full"></div>
      </div>
    </div>
  );
}
