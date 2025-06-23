import { useEffect } from "react";
import { Link } from "react-router";
import { useLevels } from "../context/LevelContext";

export default function Explanation({ onNext, levelIndex }) {
  const { levels } = useLevels();

  // handle globally enter key to Next
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Enter") {
        onNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, levelIndex]);

  return (
    <div className="flex flex-col justify-between h-[400px] font-[Patrick_Hand] text-gray-800">
      <div>
        <h3 className="text-3xl font-semibold text-green-600 mb-4 text-center mt-[-15px]">
          🎉 Correct Answer! {/* Hero Title */}
        </h3>
        <div className="bg-yellow-100/70 border-2 border-dashed border-[#a17358] px-4 py-3 rounded-lg text-gray-800 text-lg leading-relaxed h-[160px] overflow-y-auto shadow-inner font-[Google_Sans]">
          {levels[levelIndex]?.explanation}
        </div>
      </div>
      <section className="text-center px-4">
        {/* Not a programmer notice */}
        <div className="text-sm text-gray-600">
          <p className="mb-1">🙋‍♂️ Not a programmer? Try these instead:</p>

          <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs">
            <Link
              to="/bcs-english"
              className="px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 shadow-sm transition"
            >
              BCS English
            </Link>
            <Link
              to="/bcs-gk"
              className="px-3 py-1 rounded-full bg-green-100 hover:bg-green-200 text-green-700 border border-green-300 shadow-sm transition"
            >
              BCS GK
            </Link>
            <Link
              to="/hsc-math"
              className="px-3 py-1 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border border-yellow-300 shadow-sm transition"
            >
              HSC Math
            </Link>
            <Link
              to="/hsc-chemistry"
              className="px-3 py-1 rounded-full bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 shadow-sm transition"
            >
              HSC Chemistry
            </Link>
            <Link
              to="/hsc-biology"
              className="px-3 py-1 rounded-full bg-lime-100 hover:bg-lime-200 text-lime-700 border border-lime-300 shadow-sm transition"
            >
              HSC Biology
            </Link>
            <Link
              to="/hsc-physics"
              className="px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300 shadow-sm transition"
            >
              HSC Physics
            </Link>
          </div>
        </div>
      </section>

      <div className="px-4">
        <button
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onNext();
            }
          }}
          onClick={onNext}
          className="w-full bg-[#85cc3c] hover:bg-[#76b535] transition text-white py-3 text-2xl uppercase rounded-2xl border-b-8 border-r-4 border-[#a17358] shadow-lg transform active:translate-y-1 animate-pulse-pop"
        >
          Next
        </button>
      </div>
    </div>
  );
}
