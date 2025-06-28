import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLevels } from "../context/LevelContext";
import { useProfile } from "../context/ProfileContext.jsx";
import playSound from "../utils/playSound.jsx";
import AnswerForm from "./AnswerForm";
import Explanation from "./Explanation";
import Header from "./Header";
import WelcomeToGame from "./WelcomeToGame.jsx";

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

  // Loading state
  if (isLoading) {
    return (
      <div
        className="h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: "url('/bg-images/notepad.png')" }}
      >
        <div className="card p-8 text-center animate-fade-in max-w-sm mx-4">
          <div className="w-16 h-16 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-responsive-xl font-bold text-gray-700 mb-2">
            Loading Game...
          </h2>
          <p className="text-responsive-sm text-gray-500">
            Preparing your puzzle adventure
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: "url('/bg-images/notepad.png')" }}
      >
        <div className="card p-8 text-center animate-fade-in max-w-sm mx-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-responsive-xl font-bold text-red-600 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-responsive-sm text-gray-600 mb-6">{error}</p>
          <button onClick={fetchLevels} className="btn btn-primary w-full">
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: "url('/bg-images/notepad.png')" }}
    >
      <div className="w-full max-w-sm mx-4">
        <div className="card p-4 sm:p-6 relative animate-fade-in h-[calc(100vh-2rem)] max-h-[600px] flex flex-col">
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

          <div className="flex-1 flex flex-col overflow-hidden">
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
                    />
                  ) : (
                    <Explanation
                      onNext={handleExplationNextButtonClick}
                      levelIndex={levelIndex}
                    />
                  )
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-responsive-2xl font-bold text-green-700 mb-4">
                      All Questions Completed!
                    </h2>
                    <p className="text-responsive-base text-gray-700 mb-6">
                      Congratulations! You've solved all {levels?.length}{" "}
                      puzzles! 🧠🔥
                    </p>
                    <button
                      onClick={handleRestart}
                      className="btn btn-primary text-responsive-lg"
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
          <div className="modal-content p-6 sm:p-8 max-w-sm mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-responsive-xl font-bold text-green-700 mb-4">
                Level {levelIndex + 1} Completed!
              </h2>
              <p className="text-responsive-sm text-gray-600 mb-6">
                Great job! Ready for the next challenge?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Continue
                </button>
                <button
                  onClick={handleRestart}
                  className="btn btn-ghost flex-1"
                >
                  Restart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
