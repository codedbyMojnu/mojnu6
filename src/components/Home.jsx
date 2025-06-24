import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import api from "../api/index.js";
import { useLevels } from "../context/LevelContext";
import playSound from "../utils/playSound.jsx";
import AnswerForm from "./AnswerForm";
import Explanation from "./Explanation";
import Header from "./Header";
import WelcomeToGame from "./WelcomeToGame.jsx";

export default function Home() {
  const [welcome, setWelcome] = useState(true);
  const [explanation, setExplanation] = useState(false);
  const [levelIndex, setLevelIndex] = useState(() => {
    return localStorage.getItem("level")
      ? JSON.parse(localStorage.getItem("level"))
      : 0;
  });
  const [soundOn, setSoundON] = useState(false);
  const [mark, setMark] = useState("");
  // For Passed Levels

  const [slicesLevels, setSlicesLevels] = useState([]);

  // Hints
  const [showHints, setShowHints] = useState(false);

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

      //  যদি ইউজার নতুন লেভেল খেলে তবেই লেভেল পরিবর্তন করো
      if (levelIndex > JSON.parse(localStorage.getItem("level")) - 1) {
        localStorage.setItem("level", JSON.stringify(levelIndex + 1));
      }
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
        <Header
          sliceLevels={slicesLevels}
          setSlicesLevels={setSlicesLevels}
          levels={levels}
          levelIndex={levelIndex}
          setLevelIndex={setLevelIndex}
          totalHintPoints={15}
          setExplanation={setExplanation}
        />

        {welcome && (
          <WelcomeToGame
            setSoundON={setSoundON}
            setWelcome={setWelcome}
            levelIndex={levelIndex}
          />
        )}

        {!welcome ? (
          levelIndex < levels?.length ? (
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
                  localStorage.setItem("level", JSON.stringify(0));
                }}
                to="/"
                className="mt-4 inline-block bg-[#85cc3c] hover:bg-[#76b535] text-white py-2 px-4 rounded-xl border-b-4 border-r-2 border-[#6d4d3a] shadow-md transition transform active:translate-y-1"
              >
                🔁 Restart
              </Link>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
