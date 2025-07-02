import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import checkUserType from "../utils/checkUserType";
import Achievements from "./Achievements";
import LoginModal from "./auth/LoginModal";
import SignupModal from "./auth/SignupModal";
import DailyStreak from "./DailyStreak";
import Leaderboard from "./Leaderboard";
import Rewards from "./Rewards";
import SettingsModal from "./SettingsModal";
import SurveyModal from "./SurveyModal";

// Enhanced SVG Icons with better accessibility
const GearIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82-.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c0 .43.17.84.47 1.15.3.3.72.47 1.15.47h.09a1.65 1.65 0 0 0 1.51 1z" />
  </svg>
);

const LevelCompletedIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 12l2 2l4-4" />
  </svg>
);

const RefreshIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
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
  const [showSettings, setShowSettings] = useState(false);
  const [showLevelsModal, setShowLevelsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const { user } = useAuth();
  const { profile, setProfile } = useProfile();
  const navigate = useNavigate();
  const [showDailyStreak, setShowDailyStreak] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyTaken, setSurveyTaken] = useState(false);

  // Check if user is visiting for the first time
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited && !user?.token) {
      setShowWelcomeModal(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, [user?.token]);

  // Enhanced profile fetching with error handling
  const fetchProfile = useCallback(async () => {
    if (!user?.token) return;

    setIsLoading(true);
    setError(null);

    try {
      const { username } = checkUserType(user.token);
      const response = await api.get(`/api/profile/${username}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (response.status === 200) {
        setProfileData(response.data);
        setProfile(response.data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
      setShowErrorNotification(true);
      setNotificationMessage("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  }, [user?.token, setProfile]);

  // Enhanced level switching with validation
  const handleLevelSwitch = useCallback(
    async (newLevelIndex) => {
      if (newLevelIndex < 0 || newLevelIndex >= levels?.length) {
        setShowErrorNotification(true);
        setNotificationMessage("Invalid level selected");
        return;
      }

      if (newLevelIndex > profile?.maxLevel) {
        setShowErrorNotification(true);
        setNotificationMessage("You haven't unlocked this level yet");
        return;
      }

      setLevelIndex(newLevelIndex);
      setExplanation(false);
      setShowLevelsModal(false);

      setShowSuccessNotification(true);
      setNotificationMessage(`Switched to Level ${newLevelIndex + 1}`);
    },
    [levels?.length, profile?.maxLevel, setLevelIndex, setExplanation]
  );

  // Enhanced logout with cleanup
  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("level");
    setProfile(null);
    setProfileData(null);
    setLevelIndex(0);
    setExplanation(false);
    setShowSettings(false);
    setShowLevelsModal(false);
    setShowProfileModal(false);
    setShowLoginModal(false);
    setShowSignupModal(false);
  }, [setProfile, setLevelIndex, setExplanation]);

  // Handle login modal
  const handleLoginClick = useCallback(() => {
    setShowLoginModal(true);
    setShowSignupModal(false);
  }, []);

  // Handle signup modal
  const handleSignupClick = useCallback(() => {
    setShowSignupModal(true);
    setShowLoginModal(false);
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

  // Enhanced settings toggle
  const toggleSettings = useCallback(() => {
    setShowSettings(!showSettings);
    setShowLevelsModal(false);
    setShowProfileModal(false);
  }, [showSettings]);

  // Enhanced levels modal toggle
  const toggleLevelsModal = useCallback(() => {
    setShowLevelsModal(!showLevelsModal);
    setShowSettings(false);
    setShowProfileModal(false);
  }, [showLevelsModal]);

  // Enhanced profile modal toggle
  const toggleProfileModal = useCallback(() => {
    setShowProfileModal(!showProfileModal);
    setShowSettings(false);
    setShowLevelsModal(false);
    if (!showProfileModal) {
      fetchProfile();
    }
  }, [showProfileModal, fetchProfile]);

  // Enhanced sound toggle with feedback
  const toggleButtonSound = useCallback(() => {
    setButtonSoundOn(!buttonSoundOn);
    if (!buttonSoundOn) {
      try {
        const audio = new Audio("/sounds/button-sound.mp3");
        audio.volume = 0.4;
        audio.play().catch((error) => {
          console.warn("Sound playback failed:", error);
        });
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
  }, [buttonSoundOn, setButtonSoundOn]);

  // Auto-hide notifications
  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => setShowSuccessNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);

  useEffect(() => {
    if (showErrorNotification) {
      const timer = setTimeout(() => setShowErrorNotification(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showErrorNotification]);

  useEffect(() => {
    // Check if user has already submitted the survey
    async function checkSurvey() {
      if (user?.token && user?.username) {
        try {
          const res = await api.get("/api/survey/summary", {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (res.data && res.data.suggestions) {
            // If the user's username is in the survey list, they've taken it
            setSurveyTaken(
              res.data.suggestions.some((s) => s.user === user.username)
            );
          }
        } catch (err) {
          setSurveyTaken(false);
        }
      } else {
        setSurveyTaken(false);
      }
    }
    checkSurvey();
  }, [user]);

  return (
    <>
      {/* Enhanced Header */}
      <header
        className="sticky top-0 z-40 w-full bg-[#232b3e] text-white flex items-center justify-between px-12 py-6 rounded-3xl"
        style={{ minHeight: 80, margin: '0 auto', maxWidth: '1200px', left: 0, right: 0 }}
      >
        {/* Left: Logo & Level Selector */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleLevelsModal}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-yellow-400 text-[#181f2a] font-bold shadow hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            aria-label="Select level"
          >
            <span>🎯</span>
            <span>Level {levelIndex + 1}</span>
          </button>
        </div>

        {/* Center: User Info or Login */}
        <div className="flex items-center gap-6">
          {user?.token ? (
            <button
              onClick={toggleProfileModal}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-400 text-[#181f2a] font-bold shadow hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="View profile"
            >
              <span>👤</span>
              <span>{profile?.username || "User"}</span>
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-400 text-[#181f2a] font-bold shadow hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Login"
            >
              <span>🔐</span>
              <span>Login</span>
            </button>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          {/* Daily Streak Button */}
          <div className="relative inline-block">
            <button
              onClick={() => setShowDailyStreak(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-400 text-[#181f2a] font-bold shadow hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-green-300"
              aria-label="View daily streak"
            >
              🔥
            </button>
            {profile?.currentStreak > 0 && (
              <div className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white shadow-sm">
                {profile.currentStreak}
              </div>
            )}
          </div>
          {/* Achievements Button */}
          <div className="relative inline-block">
            <button
              onClick={() => setShowAchievements(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 text-[#181f2a] font-bold shadow hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              aria-label="View achievements"
            >
              🏆
            </button>
            {profile?.achievements?.length > 0 && (
              <div className="absolute -top-2 -right-1 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white shadow-sm">
                {profile.achievements.length}
              </div>
            )}
          </div>
          {/* Rewards Button */}
          <div className="relative inline-block">
            <button
              onClick={() => setShowRewards(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-400 text-[#181f2a] font-bold shadow hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="View rewards"
            >
              🎁
            </button>
            {profile?.rewards?.length > 0 && (
              <div className="absolute -top-2 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white shadow-sm">
                {profile.rewards.length}
              </div>
            )}
          </div>
          {/* Leaderboard Button */}
          <div className="relative inline-block">
            <button
              onClick={() => setShowLeaderboard(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 text-[#181f2a] font-bold shadow hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              aria-label="View leaderboard"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 01.894.553l1.382 2.764 3.05.444a1 1 0 01.554 1.707l-2.205 2.148.52 3.033a1 1 0 01-1.451 1.054L10 12.347l-2.744 1.446a1 1 0 01-1.451-1.054l.52-3.033-2.205-2.148a1 1 0 01.554-1.707l3.05-.444L9.106 2.553A1 1 0 0110 2z" />
              </svg>
            </button>
            {profile?.leaderboardNotifications?.length > 0 && (
              <div className="absolute -top-2 -right-1 bg-yellow-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white shadow-sm">
                {profile.leaderboardNotifications.length}
              </div>
            )}
          </div>
          {/* Settings Button */}
          <button
            onClick={toggleSettings}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-400 text-[#181f2a] font-bold shadow hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-green-300"
            aria-label="Open settings"
          >
            <GearIcon />
          </button>
        </div>
      </header>

      {/* Enhanced Notifications */}
      {showSuccessNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in-down max-w-sm mx-4">
          <div className="flex items-center gap-2 text-responsive-xs">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}

      {showErrorNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in-down max-w-sm mx-4">
          <div className="flex items-center gap-2 text-responsive-xs">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* Enhanced Levels Modal */}
      {showLevelsModal && (
        <div className="modal-overlay">
          <div className="modal-content p-4 max-w-sm mx-4 animate-bounce-in max-h-[80vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={toggleLevelsModal}
              className="absolute top-2 right-2 text-indigo-700 hover:text-indigo-900 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-100 transition-colors"
              aria-label="Close levels modal"
            >
              ×
            </button>

            <h3 className="text-responsive-lg font-bold text-center mb-3 text-indigo-900">
              🎯 Select Level
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {levels?.map((level, index) => (
                <button
                  key={index}
                  onClick={() => handleLevelSwitch(index)}
                  disabled={index > profile?.maxLevel}
                  className={`p-2 rounded-lg border-2 transition-all text-responsive-xs font-bold ${
                    index === levelIndex
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : index <= profile?.maxLevel
                      ? "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                  aria-label={`Select level ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-3 text-center text-responsive-xs text-gray-600">
              <p>🔒 Locked levels will unlock as you progress</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content p-4 max-w-sm mx-4 animate-bounce-in relative">
            {/* Close Button */}
            <button
              onClick={toggleProfileModal}
              className="absolute top-2 right-2 text-indigo-700 hover:text-indigo-900 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-100 transition-colors"
              aria-label="Close profile modal"
            >
              ×
            </button>

            <h3 className="text-responsive-lg font-bold text-center mb-3 text-indigo-900">
              👤 Profile
            </h3>

            {isLoading ? (
              <div className="text-center py-4">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-responsive-xs text-gray-600">
                  Loading profile...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-responsive-xs text-red-600 mb-2">{error}</p>
                <button
                  onClick={fetchProfile}
                  className="btn btn-secondary text-responsive-xs"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Enhanced Level Progress Bar */}
                <div className="mb-3 px-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-responsive-xs font-semibold text-gray-600">
                      Level {levelIndex + 1} of {levels?.length || 0}
                    </span>
                    <span className="text-responsive-xs font-semibold text-green-600">
                      {levels?.length > 0
                        ? Math.round(((levelIndex + 1) / levels.length) * 100)
                        : 0}
                      % Complete
                    </span>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="progress-bar">
                    {/* Progress Fill */}
                    <div
                      className="progress-fill animate-progress-fill"
                      style={{
                        width: `${
                          levels?.length > 0
                            ? ((levelIndex + 1) / levels.length) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  {/* Progress Stats */}
                  <div className="flex justify-between items-center mt-1 text-responsive-xs text-gray-500">
                    <span>🎯 Current: Level {levelIndex + 1}</span>
                    <span>
                      🏆 Highest: Level {(profileData?.maxLevel || 0) + 1}
                    </span>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-responsive-xs font-semibold text-indigo-800">
                      Username:
                    </span>
                    <span className="text-responsive-xs text-indigo-700">
                      {profileData?.username}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-responsive-xs font-semibold text-indigo-800">
                      Max Level:
                    </span>
                    <span className="text-responsive-xs text-indigo-700">
                      {profileData?.maxLevel + 1}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-responsive-xs font-semibold text-indigo-800">
                      Hint Points:
                    </span>
                    <span className="text-responsive-xs text-indigo-700">
                      {profileData?.hintPoints || 0}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-secondary w-full text-responsive-xs"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          onClose={toggleSettings}
          buttonSoundOn={buttonSoundOn}
          setButtonSoundOn={setButtonSoundOn}
          bgMusicOn={bgMusicOn}
          setBgMusicOn={setBgMusicOn}
          onLogout={handleLogout}
        />
      )}

      {/* Welcome Instruction Modal */}
      {showWelcomeModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6 max-w-md mx-4 animate-bounce-in">
            {/* Close Button */}
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="absolute top-2 right-2 text-indigo-700 hover:text-indigo-900 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-100 transition-colors"
              aria-label="Close welcome modal"
            >
              ×
            </button>

            <div className="text-center">
              {/* Welcome Icon */}
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <h3 className="text-responsive-lg font-bold mb-3 text-indigo-900">
                Welcome to Our App! 🎉
              </h3>

              <p className="text-responsive-sm text-gray-600 mb-4 leading-relaxed">
                Welcome to our interactive learning platform! Dive into engaging
                challenges and enhance your skills with our comprehensive
                features.
              </p>

              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <h4 className="text-responsive-sm font-semibold text-indigo-800 mb-3">
                  ✨ Key Features:
                </h4>
                <div className="space-y-2 text-responsive-xs text-indigo-700">
                  <div className="flex items-center gap-2">
                    <span>🎯</span>
                    <span>
                      Progressive level system with adaptive difficulty
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💡</span>
                    <span>Smart hint system to guide your learning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📊</span>
                    <span>Detailed progress tracking and analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🏆</span>
                    <span>Achievement system to celebrate milestones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🎵</span>
                    <span>
                      Immersive audio experience with background music
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-responsive-sm text-gray-600 mb-6 leading-relaxed">
                <strong>Login to get better UI experience</strong> and unlock
                personalized features, save your progress, and compete with
                others!
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowWelcomeModal(false);
                    handleLoginClick();
                  }}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-responsive-sm"
                >
                  🔐 Login Now
                </button>

                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-responsive-sm"
                >
                  Maybe Later
                </button>
              </div>

              <p className="text-responsive-xs text-gray-500 mt-4">
                You can always login later from the header
              </p>
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

      {/* Daily Streak Modal */}
      {showDailyStreak && (
        <DailyStreak
          isOpen={showDailyStreak}
          onClose={() => setShowDailyStreak(false)}
        />
      )}

      {/* Achievements Modal */}
      {showAchievements && (
        <Achievements
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* Rewards Modal */}
      {showRewards && (
        <Rewards isOpen={showRewards} onClose={() => setShowRewards(false)} />
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <Leaderboard
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      <SurveyModal
        isOpen={showSurvey}
        onClose={() => setShowSurvey(false)}
        token={user?.token}
      />
    </>
  );
}
