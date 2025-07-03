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
  const [completedLevelIndex, setCompletedLevelIndex] = useState(null);

  const bgMusicRef = useRef();
  const { levels, setLevels } = useLevels();
  const { profile, setProfile } = useProfile();
  const { user } = useAuth();

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
      setError("Failed to load game levels. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [setLevels]);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  useEffect(() => {
    if (bgMusicOn) {
      try {
        const bg = new Audio("/sounds/bg-music.mp3");
        bg.loop = true;
        bg.volume = 0.06;
        bg.play().catch(console.warn);
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

  useEffect(() => {
    if (!hasInitializedLevel && profile?.maxLevel > 0) {
      setLevelIndex(profile.maxLevel);
      setMaxLevel(profile.maxLevel);
      setHasInitializedLevel(true);
    }
  }, [profile?.maxLevel, hasInitializedLevel]);

  const updateMaxLevel = useCallback(
    async (level) => {
      if (!user?.token || !profile?.username) return;
      try {
        const response = await api.patch(
          `/api/profile/${profile.username}`,
          { maxLevel: level },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        if (response?.status === 200) {
          setMaxLevel(response.data.profile.maxLevel);
        }
      } catch (error) {
        console.error("Failed to update max level:", error);
      }
    },
    [user?.token, profile?.username]
  );

  // Utility to normalize answers for intelligent comparison
  function normalizeAnswer(str) {
    if (!str) return '';
    return str
      .toLowerCase() // case-insensitive
      .replace(/\s+/g, '') // remove all whitespace
      .replace(/;/g, '') // ignore semicolons
      .replace(/\r?\n|\r/g, ''); // remove newlines (if any left)
  }

  const handleSubmitAnswer = useCallback(
    async (userAnswer, level) => {
      // Use intelligent normalization for answer checking
      if (normalizeAnswer(level.answer) === normalizeAnswer(userAnswer)) {
        playSound("/sounds/right.mp3", 0.25);
        setMark("✔️");
        // Update totalPoints if logged in
        if (profile?.username) {
          try {
            const response = await api.patch(`/api/profile/${profile.username}`, {
              totalPoints: (profile.totalPoints || 0) + 1,
            });
            if (response.status === 200 && response.data?.profile) {
              setProfile({ ...profile, totalPoints: response.data.profile.totalPoints });
            }
          } catch (err) {
            // Optionally handle error (e.g., show notification)
            console.error("Failed to update totalPoints:", err);
          }
        }
        // Only update maxLevel in backend, do not update levelIndex here
        if (levelIndex >= maxLevel) {
          updateMaxLevel(levelIndex + 1);
        }
        setTimeout(() => {
          setCompletedLevelIndex(levelIndex);
          setExplanation(true);
          setMark("");
          // Scroll to top when showing explanation
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 1500);
      } else {
        playSound("/sounds/wrong.mp3");
        setMark("❌");
        setTimeout(() => setMark(""), 1500);
      }
    },
    [levelIndex, maxLevel, updateMaxLevel, profile, setProfile]
  );

  const handleExplationNextButtonClick = useCallback(() => {
    playSound("/sounds/button-sound.mp3");
    setExplanation(false);
    setCompletedLevelIndex(null);
    const nextLevel = (completedLevelIndex ?? levelIndex) + 1;
    // If user just finished the last level, update maxLevel to levels.length
    if (nextLevel >= levels?.length) {
      if (maxLevel < levels.length) {
        updateMaxLevel(levels.length);
      }
      setShowCompletionModal(true);
    } else {
      setLevelIndex(nextLevel);
      // Scroll to top when moving to next level
      window.scrollTo({ top: 0, behavior: "smooth" });
      // If user just unlocked a new maxLevel, update maxLevel in backend as well
      if (nextLevel > maxLevel) {
        updateMaxLevel(nextLevel);
      }
    }
  }, [completedLevelIndex, levelIndex, levels?.length, maxLevel, updateMaxLevel]);

  const handleRestart = useCallback(() => {
    playSound("/sounds/button-sound.mp3");
    setLevelIndex(0);
    setExplanation(false);
    setMark("");
    setShowCompletionModal(false);
    setCompletedLevelIndex(null);
  }, []);

  const handleShowLogin = useCallback(() => setShowLoginModal(true), []);
  const switchToSignup = useCallback(() => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  }, []);
  const switchToLogin = useCallback(() => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  }, []);
  const closeAuthModals = useCallback(() => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">
            Loading Puzzle Quest...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-white mb-4">{error}</p>
          <button
            onClick={fetchLevels}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background for Game Mode */}
      {!welcome && <AnimatedBackground />}

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header - Only show when not in welcome mode */}
        {!welcome && (
      <Header
        buttonSoundOn={buttonSoundOn}
        setButtonSoundOn={setButtonSoundOn}
        bgMusicOn={bgMusicOn}
        setBgMusicOn={setBgMusicOn}
        levels={levels}
        levelIndex={levelIndex}
        setLevelIndex={setLevelIndex}
        setExplanation={setExplanation}
            explanation={explanation}
            completedLevelIndex={completedLevelIndex}
            showingExplanationForLevel={completedLevelIndex}
      />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex items-center justify-center p-4">
        {welcome ? (
            <WelcomeToGame
              setBgMusicOn={setBgMusicOn}
              setWelcome={setWelcome}
            />
        ) : (
            <div className="w-full max-w-4xl">
            {levelIndex < levels?.length ? (
              !explanation ? (
                <AnswerForm
                  onAnswer={handleSubmitAnswer}
                  mark={mark}
                  levelIndex={levelIndex}
                  showLogin={handleShowLogin}
                    onRestart={handleRestart}
                />
              ) : (
                <Explanation
                  onNext={handleExplationNextButtonClick}
                    levelIndex={completedLevelIndex}
                    onRestart={handleRestart}
                    isLastLevel={completedLevelIndex === levels.length - 1}
                />
              )
            ) : (
                <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
                  <h2 className="text-3xl font-bold text-green-500 mb-4">
                    🎉 Congratulations! 🎉
                  </h2>
                  <p className="text-lg text-gray-100 mb-6">You've completed all levels. Do you want to restart from level 1? <br/>(This will not reset your maxLevel or achievements.)</p>
                  <button
                    onClick={handleRestart}
                    className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    Restart from Level 1
                  </button>
              </div>
            )}
            </div>
        )}
      </main>

        {/* Chat Room Button - Only show when not in welcome mode */}
        {!welcome && (
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
              className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
          title="Chat Room"
        >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
        </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl p-6 max-w-sm mx-4 rounded-2xl text-center border border-white/20">
            <h2 className="text-3xl font-bold text-green-500 mb-4">
              🎉 Congratulations! 🎉
            </h2>
            <p className="text-lg text-gray-100 mb-6">You've completed all levels. Do you want to restart from level 1? <br/>(This will not reset your maxLevel or achievements.)</p>
            <button
              onClick={handleRestart}
              className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
              Restart from Level 1
            </button>
          </div>
        </div>
      )}

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={closeAuthModals}
          onSwitchToSignup={switchToSignup}
        />
      )}
      {showSignupModal && (
        <SignupModal
          isOpen={showSignupModal}
          onClose={closeAuthModals}
          onSwitchToLogin={switchToLogin}
        />
      )}
      {showChatRoom && (
        <ChatRoom
          isOpen={showChatRoom}
          onClose={() => setShowChatRoom(false)}
        />
      )}
    </div>
  );
}
