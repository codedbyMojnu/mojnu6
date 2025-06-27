import { useEffect, useState } from "react";
import { useProfile } from "../context/ProfileContext";
import checkUserType from "../utils/checkUserType";
import playSound from "../utils/playSound";
import SettingsModal from "./SettingsModal";

// Placeholder SVGs for missing icons
const GearIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c0 .43.17.84.47 1.15.3.3.72.47 1.15.47h.09a1.65 1.65 0 0 0 1.51 1z" />
  </svg>
);

const LevelCompletedIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 12l2 2l4-4" />
  </svg>
);

export default function Header({
  buttonSoundOn,
  setButtonSoundOn,
  bgMusicOn,
  setBgMusicOn,
  slicesLevels,
  setSlicesLevels,
  levels,
  levelIndex,
  setLevelIndex,
  totalHintPoints,
  setExplanation,
}) {
  // Settings modal state
  const [showSettings, setShowSettings] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [notificationOn, setNotificationOn] = useState(true);
  const [language, setLanguage] = useState("english");
  const [showPastLevels, setShowPastLevels] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // profile data
  const { profile, fetchProfile } = useProfile();

  // Track previous hint points to detect changes
  const [prevHintPoints, setPrevHintPoints] = useState(0);

  useEffect(() => {
    if (profile?.hintPoints !== prevHintPoints && prevHintPoints > 0) {
      const difference = profile?.hintPoints - prevHintPoints;
      if (difference > 0) {
        setNotificationMessage(`🎉 +${difference} Hint Points Added!`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    }
    setPrevHintPoints(profile?.hintPoints || 0);
  }, [profile?.hintPoints, prevHintPoints]);

  // Function to refresh profile data
  const handleRefreshProfile = async () => {
    playSound("/sounds/button-sound.mp3");
    setIsRefreshing(true);
    
    try {
      if (fetchProfile) {
        const { username } = checkUserType(localStorage.getItem('token'));
        await fetchProfile(username);
        console.log('Profile refreshed successfully');
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <header className="flex justify-between items-center mb-6 gap-4 select-none">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
          {notificationMessage}
        </div>
      )}

      {/* Gear Icon */}
      <button
        className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 transition duration-300 shadow-md border border-yellow-400"
        title="Settings"
        onClick={() => {
          playSound("/sounds/button-sound.mp3");
          setShowSettings(true);
        }}
      >
        <GearIcon />
      </button>

      {/* Level Completed Icon */}
      <button
        className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition duration-300 shadow-md border border-green-400"
        title="Levels Passed"
        onClick={() => {
          playSound("/sounds/button-sound.mp3");
          const slice = levels?.slice(
            0,
            JSON.parse(localStorage.getItem("level")) ?? 0
          );
          setSlicesLevels(slice);
          setShowPastLevels((prev) => !prev);
        }}
      >
        <LevelCompletedIcon />
      </button>

      {/* Level Name (center) */}
      <div className="flex-1 text-center">
        <span className="font-extrabold text-lg text-[#444] tracking-wide uppercase drop-shadow-sm">
          Level {levelIndex + 1}
        </span>
      </div>

      {/* Display Passed Levels */}
      {
        // when Past levels true
        showPastLevels && (
          <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white border-2 border-pink-400 rounded-xl p-4 shadow-lg z-50">
            {/* Close Button */}
            <button
              onClick={() => setShowPastLevels(false)}
              className="absolute top-2 right-3 text-pink-500 hover:text-pink-700 text-xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-center text-xl font-bold text-pink-600 mb-3">
              🔢 Go to Level
            </h3>

            {slicesLevels?.length > 0 ? (
              <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
                {slicesLevels.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playSound("/sounds/button-sound.mp3");
                      setExplanation(false);
                      setLevelIndex(idx);
                      setShowPastLevels(false);
                    }}
                    className={`py-2 rounded-lg font-bold ${
                      idx === levelIndex
                        ? "bg-green-400 text-white"
                        : "bg-pink-100 text-pink-800"
                    } hover:bg-green-500 hover:text-white transition duration-300 text-sm`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-md font-bold text-black mb-3">
                You are in Level 0
              </p>
            )}
          </div>
        )
      }

      {/* Hints Point Icon (display only) */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center gap-2">
          {/* Total Hints Point */}
          <button
            onClick={handleRefreshProfile}
            title="Refresh Hint Points"
            className={`w-15 h-15 flex items-center justify-center hover:scale-110 transition-transform ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            aria-label="Refresh Hint Points"
            disabled={isRefreshing}
          >
            <img 
              src="/icons/hint.png" 
              alt="Hint Icon" 
              className={`w-15 h-15 ${isRefreshing ? 'opacity-50' : ''}`} 
            />
          </button>

          {/* Hint Count */}
          <span className="text-xl font-bold text-[#444] mt-[-20px] ml-[-28px] select-none">
            ×{profile?.hintPoints}
          </span>
          
          {/* Refresh indicator */}
          {isRefreshing && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Settings Modal Overlay */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          bgMusicOn={bgMusicOn}
          setBgMusicOn={setBgMusicOn}
          buttonSoundOn={buttonSoundOn}
          setButtonSoundOn={setButtonSoundOn}
          musicOn={musicOn}
          setMusicOn={setMusicOn}
          notificationOn={notificationOn}
          setNotificationOn={setNotificationOn}
          totalHintPoints={totalHintPoints}
          language={language}
          setLanguage={setLanguage}
        />
      )}
    </header>
  );
}
