import playSound from "../utils/playSound";

export default function WelcomeToGame({
  setBgMusicOn,
  setWelcome,
  levelIndex,
}) {
  function handleClose() {
    setWelcome(false);
  }

  return (
    <div className="flex flex-col justify-between h-[400px] font-[Patrick_Hand] text-gray-800 relative">
      {/* Level and Hints button row */}
      <div className="flex items-center justify-center gap-4 bg-white/80 px-6 py-1 rounded-2xl mt-[-20px]">
        <div className="text-center">
          <h1 className="text-xl mt-16 leading-relaxed">
            ARE YOU READY TO <br />
            Solve 1,000 Questions <br />
            Before Your Frontend Dev Interview?
          </h1>

          <button
            onClick={() => {
              playSound("/sounds/button-sound.mp3");
              handleClose();
              setBgMusicOn(true);
            }}
            className="mt-6 px-6 py-2 rounded-xl text-lg font-bold uppercase tracking-wide bg-gradient-to-r from-lime-200 to-lime-400 text-[#333] shadow-md border-2 border-lime-500 hover:from-lime-300 hover:to-lime-500 hover:scale-105 transition-transform duration-300 active:translate-y-1 animate-pulse-pop"
          >
            Level {levelIndex + 1}
          </button>
        </div>
      </div>
    </div>
  );
}
