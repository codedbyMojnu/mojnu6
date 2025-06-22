import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import api from "../api/index.js";
import { useLevels } from "../context/LevelContext";
import SoundOff from "../icons/SoundOff";
import SoundOn from "../icons/SoundOn";
import playSound from "../utils/playSound.jsx";
import AnswerForm from "./AnswerForm";
import Explanation from "./Explanation";

export default function Home() {
  const [explanation, setExplanation] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  const [soundOn, setSoundON] = useState(false);
  const [mark, setMark] = useState("");
  const bgMusicRef = useRef();
  const { levels, setLevels } = useLevels();

  useEffect(() => {
    async function fetchLevels() {
      try {
        const response = await api.get("/api/levels");
        if (!response.status === "OK") {
          throw new Error("Server Problem");
        }
        setLevels(response.data);
      } catch (err) {
        console.log("Server is off maybe", err.message);
      }
    }
    fetchLevels();
  }, []);

  useEffect(() => {
    if (soundOn) {
      const bg = new Audio("/sounds/bg-music.mp3");
      bg.loop = true;
      bg.volume = 0.15;
      bg.play();
      bgMusicRef.current = bg;
    }

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, [soundOn]);

  function playMusic(src) {
    const audio = new Audio(src);
    audio.volume = 0.4;
    audio.play();
  }

  function handleSubmitAnswer(userAnswer, level) {
    if (level.answer == userAnswer) {
      playMusic("/sounds/right.mp3");
      setMark("✔️");
      setTimeout(() => {
        setExplanation(true);
        setMark("");
      }, 2000);
    } else {
      playMusic("/sounds/wrong.mp3");
      setMark("❌");
      setTimeout(() => {
        setMark("");
      }, 2000);
    }
  }

  function handleExplationNextButtonClick() {
    playSound("/sounds/button-sound.mp3");
    setExplanation(false);
    setLevelIndex(levelIndex + 1);
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg-images/notepad.png')" }}
    >
      <div className="w-full max-w-sm bg-white/90 shadow-lg rounded-2xl p-6 mx-3 border-[3px] border-[#a17358] font-[Patrick_Hand] relative">
        <div className="flex justify-between items-center mb-6 gap-4">
          {/* Sound Toggle Button */}
          <button
            className="p-3 rounded-full bg-yellow-100 hover:bg-yellow-200 transition duration-300 shadow-md border border-yellow-400"
            onClick={() => setSoundON((s) => !s)}
            title="Toggle sound"
          >
            {soundOn ? <SoundOn /> : <SoundOff />}
          </button>

          {/* Admin Link */}
          <Link
            onClick={() => playMusic("/sounds/button-sound.mp3")}
            to="/dashboard"
            className="px-5 py-2 text-md sm:text-md font-bold uppercase rounded-2xl bg-yellow-300 text-[#333] hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-md shadow-yellow-100 border-b-4 border-yellow-500"
          >
            Admin
          </Link>
        </div>

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
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              🎉 All Questions Completed!
            </h2>
            <p className="text-gray-700 text-base">
              Thanks for playing, bro! 🧠🔥
            </p>
            <Link
              onClick={() => {
                playMusic("/sounds/button-sound.mp3");
                setLevelIndex(0);
              }}
              to="/"
              className="mt-4 inline-block bg-[#85cc3c] hover:bg-[#76b535] text-white py-2 px-4 rounded-xl border-b-4 border-r-2 border-[#6d4d3a] shadow-md transition transform active:translate-y-1"
            >
              🔁 Restart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
