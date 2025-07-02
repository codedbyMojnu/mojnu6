import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLevels } from "../context/LevelContext";
import { useProfile } from "../context/ProfileContext.jsx";
import playSound from "../utils/playSound.jsx";
import AnimatedBackground from "./AnimatedBackground";
import AnswerForm from "./AnswerForm";
import ChatRoom from "./ChatRoom";
import Explanation from "./Explanation";
import Header from "./Header";
import WelcomeToGame from "./WelcomeToGame.jsx";
import LoginModal from "./auth/LoginModal";
import SignupModal from "./auth/SignupModal";

export default function Home() {
  const [welcome, setWelcome] = useState(true);
  const [explanation, setExplanation] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  const [buttonSoundOn, setButtonSoundOn] = useState(false);
  const [bgMusicOn, setBgMusicOn] = useState(false);
  const [mark, setMark] = useState("");
  const [maxLevel, setMaxLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [hasInitializedLevel, setHasInitializedLevel] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);

  // For Passed Levels
  const [slicesLevels, setSlicesLevels] = useState([]);
  const bgMusicRef = useRef();
  const { levels, setLevels } = useLevels();
  const { profile } = useProfile();
  const { user } = useAuth();

  // Fetch levels with error handling and loading states
  const fetchLevels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get("/api/levels");
      if (response.status === 200) {
        setLevels(response.data);
      } else {
        throw new Error("Failed to fetch levels");
      }
    } catch (err) {
      console.error("Error fetching levels:", err);
      setError(
        "Failed to load game levels. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [setLevels]);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  // Background music management with error handling
  useEffect(() => {
    if (bgMusicOn) {
      try {
        const bg = new Audio("/sounds/bg-music.mp3");
        bg.loop = true;
        bg.volume = 0.15;

        const playPromise = bg.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("Background music autoplay failed:", error);
            setBgMusicOn(false);
          });
        }

        bgMusicRef.current = bg;
      } catch (error) {
        console.error("Error setting up background music:", error);
        setBgMusicOn(false);
      }
    }

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, [bgMusicOn]);

  // Set user's max level on first load only
  useEffect(() => {
    if (!hasInitializedLevel && profile?.maxLevel > 0) {
      setLevelIndex(profile.maxLevel);
      setMaxLevel(profile.maxLevel);
      setHasInitializedLevel(true);
    }
  }, [profile?.maxLevel, hasInitializedLevel]);

  // Update max level with error handling
  const updateMaxLevel = useCallback(
    async (level) => {
      if (!user?.token || !profile?.username) return;

      try {
        const response = await api.patch(
          `/api/profile/${profile.username}`,
          { maxLevel: level },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response?.status === 200) {
          setLevelIndex(response?.data?.profile?.maxLevel);
          setMaxLevel(response?.data?.profile?.maxLevel);
        }
      } catch (error) {
        console.error("Failed to update max level:", error);
      }
    },
    [user?.token, profile?.username]
  );

  // Enhanced sound playing with error handling
  const playRightOrWrongSound = useCallback((src) => {
    try {
      const audio = new Audio(src);
      audio.volume = 0.4;
      audio.play().catch((error) => {
        console.warn("Sound playback failed:", error);
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, []);

  // Enhanced answer submission with better feedback
  const handleSubmitAnswer = useCallback(
    (userAnswer, level) => {
      if (level.answer == userAnswer) {
        playRightOrWrongSound("/sounds/right.mp3");
        setMark("✔️");

        // Update max level if user completed a new level
        if (levelIndex > maxLevel) {
          updateMaxLevel(levelIndex);
        }

        setTimeout(() => {
          setExplanation(true);
          setMark("");
        }, 2000);
      } else {
        playRightOrWrongSound("/sounds/wrong.mp3");
        setMark("❌");
        setTimeout(() => {
          setMark("");
        }, 2000);
      }
    },
    [levelIndex, maxLevel, playRightOrWrongSound, updateMaxLevel]
  );

  // Enhanced next level handling
  const handleExplationNextButtonClick = useCallback(() => {
    playSound("/sounds/button-sound.mp3");
    setExplanation(false);

    const nextLevel = levelIndex + 1;
    if (nextLevel >= levels?.length) {
      setShowCompletionModal(true);
    } else {
      setLevelIndex(nextLevel);
    }
  }, [levelIndex, levels?.length]);

  // Handle game restart
  const handleRestart = useCallback(() => {
    playRightOrWrongSound("/sounds/button-sound.mp3");
    setLevelIndex(0);
    setMaxLevel(0);
    setExplanation(false);
    setMark("");
    setShowCompletionModal(false);
    localStorage.setItem("level", JSON.stringify(0));
  }, [playRightOrWrongSound]);

  // Handle login modal
  const handleShowLogin = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  // Switch between login and signup modals
  const switchToSignup = useCallback(() => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  }, []);

  const switchToLogin = useCallback(() => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  }, []);

  // Close auth modals
  const closeAuthModals = useCallback(() => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#181f2a] flex items-center justify-center">
        <div className="bg-[#232b3e] rounded-3xl shadow-2xl p-8 text-center max-w-sm mx-4">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-extrabold text-yellow-400 mb-2 tracking-wide">
            Loading Game...
          </h2>
          <p className="text-base text-gray-300">
            Preparing your puzzle adventure
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen w-full bg-[#181f2a] flex items-center justify-center">
        <div className="bg-[#232b3e] rounded-3xl shadow-2xl p-8 text-center max-w-sm mx-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-extrabold text-red-400 mb-4 tracking-wide">
            Oops! Something went wrong
          </h2>
          <p className="text-base text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchLevels}
            className="w-full px-6 py-3 rounded-2xl bg-yellow-400 text-[#181f2a] font-bold text-lg shadow-lg hover:bg-green-400 hover:text-[#181f2a] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#181f2a] relative">
      {/* Animated playful background */}
      <AnimatedBackground />
      {/* Main Card Container */}
      <div className="w-full ">
        <div className="bg-[#232b3e] rounded-3xl shadow-2xl p-0 sm:p-2 md:p-6 flex flex-col">
          <Header
            buttonSoundOn={buttonSoundOn}
            setButtonSoundOn={setButtonSoundOn}
            bgMusicOn={bgMusicOn}
            setBgMusicOn={setBgMusicOn}
            slicesLevels={slicesLevels}
            setSlicesLevels={setSlicesLevels}
            levels={levels}
            levelIndex={levelIndex}
            setLevelIndex={setLevelIndex}
            totalHintPoints={15}
            setExplanation={setExplanation}
          />

          <div className="flex-1 flex flex-col items-center justify-center px-2 sm:px-6">
            {welcome && (
              <WelcomeToGame
                setBgMusicOn={setBgMusicOn}
                setWelcome={setWelcome}
                levelIndex={levelIndex}
              />
            )}

            {!welcome && (
              <>
                {levelIndex < levels?.length ? (
                  !explanation ? (
                    <AnswerForm
                      onAnswer={handleSubmitAnswer}
                      mark={mark}
                      levelIndex={levelIndex}
                      showLogin={handleShowLogin}
                    />
                  ) : (
                    <Explanation
                      onNext={handleExplationNextButtonClick}
                      levelIndex={levelIndex}
                    />
                  )
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in px-4">
                    <div className="text-7xl mb-6">🎉</div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-4 tracking-wide">
                      All Questions Completed!
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-200 mb-8 font-semibold">
                      Congratulations! You've solved all {levels?.length}{" "}
                      puzzles! 🧠🔥
                    </p>
                    <button
                      onClick={handleRestart}
                      className="w-full px-6 py-4 rounded-2xl bg-green-400 text-[#181f2a] font-extrabold text-xl shadow-xl hover:bg-yellow-400 hover:text-[#181f2a] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    >
                      🔁 Play Again
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content p-6 max-w-sm mx-2 sm:mx-4 relative rounded-3xl bg-[#232b3e] shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowCompletionModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-yellow-400 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#181f2a] transition-colors"
              aria-label="Close completion modal"
            >
              ×
            </button>
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-400 mb-4 tracking-wide">
                Level {levelIndex + 1} Completed!
              </h2>
              <p className="text-base sm:text-lg text-gray-200 mb-6">
                Great job! Ready for the next challenge?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-blue-400 text-[#181f2a] font-bold text-lg shadow hover:bg-yellow-400 hover:text-[#181f2a] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                >
                  Continue
                </button>
                <button
                  onClick={handleRestart}
                  className="flex-1 px-4 py-3 rounded-2xl bg-yellow-400 text-[#181f2a] font-bold text-lg shadow hover:bg-green-400 hover:text-[#181f2a] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Restart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={closeAuthModals}
          onSwitchToSignup={switchToSignup}
        />
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal
          isOpen={showSignupModal}
          onClose={closeAuthModals}
          onSwitchToLogin={switchToLogin}
        />
      )}

      {/* Chat Room */}
      {showChatRoom && (
        <ChatRoom
          isOpen={showChatRoom}
          onClose={() => setShowChatRoom(false)}
        />
      )}

      {/* Chat Button - Fixed at bottom */}
      <div className="fixed bottom-4 right-4 z-20">
        <button
          onClick={() => {
            if (!user?.token) {
              setShowLoginModal(true);
              return;
            }
            setShowChatRoom(true);
            playSound("/sounds/button-sound.mp3");
          }}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-110 flex items-center gap-2"
          title="Join the Chat Room"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          <span className="hidden sm:inline text-sm font-semibold">
            Join Chat
          </span>
        </button>
      </div>
    </div>
  );
}
