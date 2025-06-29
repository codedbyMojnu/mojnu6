import { useCallback } from "react";

// Enhanced SVG Icons with better accessibility
const SoundOnIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z" />
  </svg>
);

const SoundOffIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z" />
    <path d="M19 12c0 2.21-1.2 4.15-3 5.19V6.81C17.8 7.85 19 9.79 19 12z" />
    <path d="M3 9v6h4l5 5V4L7 9H3z" />
  </svg>
);

const MusicOnIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
  </svg>
);

const MusicOffIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const NotificationOnIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 0 0 6 19h12a1 1 0 0 0 .71-1.71L18 16z" />
  </svg>
);

const NotificationOffIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 0 0 6 19h12a1 1 0 0 0 .71-1.71L18 16z" />
    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function SettingsModal({
  onClose,
  bgMusicOn,
  setBgMusicOn,
  buttonSoundOn,
  setButtonSoundOn,
  notificationOn,
  setNotificationOn,
  totalHintPoints,
  language = "English",
  setLanguage,
}) {
  // Enhanced toggle handlers
  const handleSoundToggle = useCallback(() => {
    setButtonSoundOn(!buttonSoundOn);
  }, [buttonSoundOn, setButtonSoundOn]);

  const handleMusicToggle = useCallback(() => {
    setBgMusicOn(!bgMusicOn);
  }, [bgMusicOn, setBgMusicOn]);

  const handleNotificationToggle = useCallback(() => {
    setNotificationOn(!notificationOn);
  }, [notificationOn, setNotificationOn]);

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content p-6 sm:p-8 max-w-sm mx-4 animate-bounce-in">
        {/* Enhanced Close Button */}
        <button
          className="absolute top-3 left-3 bg-yellow-100 hover:bg-yellow-200 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
          onClick={onClose}
          aria-label="Close settings"
        >
          <CloseIcon />
        </button>

        {/* Enhanced Title */}
        <h2 className="text-responsive-xl sm:text-2xl font-extrabold text-center mb-6 tracking-wider text-gray-800">
          ⚙️ SETTINGS
        </h2>

        {/* Enhanced Language Selector */}
        <div className="flex items-center justify-center mb-6">
          <span className="font-bold text-responsive-base mr-3 text-gray-700">
            🌐 LANGUAGE
          </span>
          <select
            className="input text-responsive-sm bg-white border-2 border-blue-200 focus:border-blue-400"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Select language"
          >
            <option value="english">English</option>
            <option value="bangla">বাংলা</option>
            <option value="hindi">हिंदी</option>
          </select>
        </div>

        {/* Enhanced Audio Controls */}
        <div className="space-y-4 mb-6">
          {/* Background Music Toggle */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${bgMusicOn ? 'bg-blue-500 text-white scale-110' : 'bg-gray-300 text-gray-600'}`}>
                {bgMusicOn ? <MusicOnIcon /> : <MusicOffIcon />}
              </div>
              <div>
                <h3 className="font-bold text-responsive-sm text-gray-800">🎵 Background Music</h3>
                <p className="text-responsive-xs text-gray-600">Immerse yourself with ambient tunes</p>
              </div>
            </div>
            <button
              onClick={handleMusicToggle}
              className={`relative px-4 py-2 rounded-lg font-semibold text-responsive-sm transition-all duration-300 transform hover:scale-105 ${
                bgMusicOn 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label={bgMusicOn ? "Turn off background music" : "Turn on background music"}
            >
              {bgMusicOn ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Button Sound Toggle */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${buttonSoundOn ? 'bg-green-500 text-white scale-110' : 'bg-gray-300 text-gray-600'}`}>
                {buttonSoundOn ? <SoundOnIcon /> : <SoundOffIcon />}
              </div>
              <div>
                <h3 className="font-bold text-responsive-sm text-gray-800">🔊 Button Sounds</h3>
                <p className="text-responsive-xs text-gray-600">Hear satisfying click feedback</p>
              </div>
            </div>
            <button
              onClick={handleSoundToggle}
              className={`relative px-4 py-2 rounded-lg font-semibold text-responsive-sm transition-all duration-300 transform hover:scale-105 ${
                buttonSoundOn 
                  ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label={buttonSoundOn ? "Turn off button sounds" : "Turn on button sounds"}
            >
              {buttonSoundOn ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <button
            className="btn btn-secondary w-full text-responsive-base font-bold"
            aria-label="Try other games"
          >
            🎮 TRY OUR OTHER GAMES!
          </button>

          <div className="flex w-full gap-3">
            <button
              className="btn btn-secondary flex-1 text-responsive-sm font-bold"
              aria-label="Get support"
            >
              💬 SUPPORT
            </button>
            <button
              className="btn btn-secondary flex-1 text-responsive-sm font-bold"
              aria-label="Share the game"
            >
              📤 SHARE
            </button>
          </div>
        </div>

        {/* Enhanced Social Media */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className="relative group"
            aria-label="Visit our YouTube channel"
          >
            <img
              src="/icons/youtube.png"
              alt="YouTube"
              className="w-10 h-10 rounded-xl border-2 border-red-400 group-hover:scale-110 transition-transform"
            />
            <span className="absolute -bottom-2 -right-3 bg-yellow-200 rounded-full px-2 text-xs font-bold border border-yellow-400">
              +50
            </span>
          </button>

          <button className="group" aria-label="Follow us on TikTok">
            <img
              src="/icons/tiktok.png"
              alt="TikTok"
              className="w-10 h-10 rounded-xl border-2 border-black group-hover:scale-110 transition-transform"
            />
          </button>

          <button className="group" aria-label="Follow us on Instagram">
            <img
              src="/icons/instagram.png"
              alt="Instagram"
              className="w-10 h-10 rounded-xl border-2 border-pink-400 group-hover:scale-110 transition-transform"
            />
          </button>

          <button className="group" aria-label="Follow us on Facebook">
            <img
              src="/icons/facebook.png"
              alt="Facebook"
              className="w-10 h-10 rounded-xl border-2 border-blue-400 group-hover:scale-110 transition-transform"
            />
          </button>
        </div>

        {/* Enhanced Links */}
        <div className="flex justify-between text-responsive-xs">
          <a
            href="#"
            className="text-blue-700 underline hover:text-blue-900 transition-colors"
            aria-label="Read privacy policy"
          >
            PRIVACY POLICY
          </a>
          <a
            href="#"
            className="text-blue-700 underline hover:text-blue-900 transition-colors"
            aria-label="Read terms of use"
          >
            TERMS OF USE
          </a>
        </div>
      </div>
    </div>
  );
}
