// Example playful icons (replace with your SVGs or images as needed)
const SoundOnIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="#7c3aed">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z" />
  </svg>
);
const SoundOffIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="#a3a3a3">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z" />
    <path d="M19 12c0 2.21-1.2 4.15-3 5.19V6.81C17.8 7.85 19 9.79 19 12z" />
    <path d="M3 9v6h4l5 5V4L7 9H3z" />
  </svg>
);
const MusicOnIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="#38bdf8">
    <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
  </svg>
);
const MusicOffIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="#a3a3a3">
    <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    <line x1="1" y1="1" x2="23" y2="23" stroke="#a3a3a3" strokeWidth="2" />
  </svg>
);
const NotificationOnIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="#a3e635">
    <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 0 0 6 19h12a1 1 0 0 0 .71-1.71L18 16z" />
  </svg>
);
const NotificationOffIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="#a3a3a3">
    <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 0 0 6 19h12a1 1 0 0 0 .71-1.71L18 16z" />
    <line x1="1" y1="1" x2="23" y2="23" stroke="#a3a3a3" strokeWidth="2" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#444"
    strokeWidth="3"
    strokeLinecap="round"
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
  language = "Enlish",
  setLanguage,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg-images/notepad.png')" }}
    >
      <div className="w-full max-w-sm bg-white/90 shadow-lg rounded-2xl p-6 mx-3 border-[3px] border-[#a17358] font-[Patrick_Hand] relative">
        {/* Close Button */}
        <button
          className="absolute top-3 left-3 bg-yellow-200 rounded-full p-1 hover:bg-yellow-300"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {/* Hint Count */}
        <div className="absolute top-3 right-6 flex items-center gap-1 bg-white rounded-xl px-3 py-1 border-2 border-yellow-300 shadow">
          <img src="/icons/hint.png" alt="Hint" className="w-6 h-6" />
          <span className="font-bold text-lg text-yellow-700">
            {totalHintPoints}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-center mb-4 tracking-wider">
          SETTINGS
        </h2>

        {/* Toggles */}
        <div className="flex justify-around mb-6">
          <button
            className="flex flex-col items-center"
            onClick={() => setButtonSoundOn((prev) => prev)}
          >
            {buttonSoundOn ? <SoundOnIcon /> : <SoundOffIcon />}
            <span className="mt-1 text-base font-bold">SOUND</span>
          </button>
          <button
            className="flex flex-col items-center"
            onClick={() => setBgMusicOn((prev) => !prev)}
          >
            {bgMusicOn ? <MusicOnIcon /> : <MusicOffIcon />}
            <span className="mt-1 text-base font-bold">MUSIC</span>
          </button>
          <button
            className="flex flex-col items-center"
            onClick={() => setNotificationOn(!notificationOn)}
          >
            {notificationOn ? <NotificationOnIcon /> : <NotificationOffIcon />}
            <span className="mt-1 text-base font-bold">NOTIFICATION</span>
          </button>
        </div>

        {/* Language */}
        <div className="flex items-center justify-center mb-5">
          <span className="font-bold text-lg mr-2">LANGUAGE</span>
          <select
            className="rounded-xl border-2 border-blue-200 px-3 py-1 text-lg bg-white"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="english">English</option>
            <option value="bangla">Bangla</option>
            {/* Add more languages as needed */}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <button className="w-full py-2 rounded-2xl bg-orange-200 text-xl font-bold border-2 border-orange-400 shadow hover:bg-orange-300 mb-1">
            TRY OUR OTHER GAMES!
          </button>
          <div className="flex w-full gap-3">
            <button className="flex-1 py-2 rounded-2xl bg-yellow-200 text-lg font-bold border-2 border-yellow-400 shadow hover:bg-yellow-300">
              SUPPORT
            </button>
            <button className="flex-1 py-2 rounded-2xl bg-purple-200 text-lg font-bold border-2 border-purple-400 shadow hover:bg-purple-300">
              SHARE
            </button>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex justify-center gap-5 mb-4">
          <button className="relative">
            <img
              src="/icons/youtube.png"
              alt="YouTube"
              className="w-10 h-10 rounded-xl border-2 border-red-400"
            />
            <span className="absolute -bottom-2 -right-3 bg-yellow-200 rounded-full px-2 text-xs font-bold border border-yellow-400">
              +50
            </span>
          </button>
          <button>
            <img
              src="/icons/tiktok.png"
              alt="TikTok"
              className="w-10 h-10 rounded-xl border-2 border-black"
            />
          </button>
          <button>
            <img
              src="/icons/instagram.png"
              alt="Instagram"
              className="w-10 h-10 rounded-xl border-2 border-pink-400"
            />
          </button>
          <button>
            <img
              src="/icons/facebook.png"
              alt="Facebook"
              className="w-10 h-10 rounded-xl border-2 border-blue-400"
            />
          </button>
        </div>

        {/* Links */}
        <div className="flex justify-between text-blue-700 underline text-sm mt-2">
          <a href="#" className="hover:text-blue-900">
            PRIVACY POLICY
          </a>
          <a href="#" className="hover:text-blue-900">
            TERMS OF USE
          </a>
        </div>
      </div>
    </div>
  );
}
