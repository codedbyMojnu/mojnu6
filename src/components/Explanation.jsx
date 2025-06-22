import { useLevels } from "../context/LevelContext";

export default function Explanation({ onNext, levelIndex }) {
  const { levels } = useLevels();

  return (
    <div className="flex flex-col justify-between h-[400px] font-[Patrick_Hand] text-gray-800">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-center text-indigo-800">
          Brain Test
        </h2>
        <h3 className="text-3xl font-semibold text-green-600 mb-4 text-center">
          🎉 Correct Answer!
        </h3>

        <p className="text-lg text-brown-700 mb-2 font-semibold">
          📜 Explanation:
        </p>
        <div className="bg-yellow-100/70 border-2 border-dashed border-[#a17358] px-4 py-3 rounded-lg mb-6 text-gray-800 text-lg leading-relaxed h-[180px] overflow-y-auto shadow-inner font-[Google_Sans]">
          {levels[levelIndex]?.explanation}
        </div>
      </div>

      <div className="px-4">
        <button
          onClick={onNext}
          className="w-full bg-[#85cc3c] hover:bg-[#76b535] transition text-white py-3 text-2xl uppercase rounded-2xl border-b-8 border-r-4 border-[#a17358] shadow-lg transform active:translate-y-1 animate-pulse-pop"
        >
          Next
        </button>
      </div>
    </div>
  );
}
