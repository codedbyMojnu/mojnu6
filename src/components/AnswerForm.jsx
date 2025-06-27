import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useLevels } from "../context/LevelContext";
import { useProfile } from "../context/ProfileContext";
import checkUserType from "../utils/checkUserType";
import Marker from "./Marker";

export default function AnswerForm({ onAnswer, mark, levelIndex }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showWaitModal, setShowWaitModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const { levels } = useLevels();
  const { user } = useAuth();
  const { profile, setProfile } = useProfile();
  const [transactionId, setTransactionId] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");

  const navigate = useNavigate();
  function handleTextAnswer() {
    if (userAnswer.trim()) {
      onAnswer(userAnswer, levels[levelIndex]);
    }
  }

  function handleOptionAnswer(option) {
    setSelectedOption(option);
    onAnswer(option, levels[levelIndex]);
  }

  async function handleDecreaseHintPoints() {
    const updatedProfileData = {
      ...profile,
      hintPoints: profile?.hintPoints - 15,
      takenHintLevels: [...profile?.takenHintLevels, levelIndex],
    };
    const response = await api.put(
      `/api/profile/${profile?.username}`,
      updatedProfileData
    );
    if (response.status === 200) {
      setProfile(updatedProfileData);
    }
  }

  // handle Request Points Form
  async function handleRequestPointsForm(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { username } = checkUserType(user?.token);
      const transactionData = {
        username,
        transactionId,
        selectedPackage,
      };
      const response = await api.post("/api/transactions", transactionData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.statusText === "Created") {
        setShowRequestForm(false);
        setShowWaitModal(true);
        setTransactionId("");
        setSelectedPackage("");

        // Show success notification
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 5000);

        console.log(
          "Transaction submitted successfully! Admin will review shortly."
        );
      }
    } catch (error) {
      console.error("Failed to submit transaction:", error);
      alert("Failed to submit transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col justify-between h-[400px] font-[Patrick_Hand] text-gray-800 relative">
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Transaction submitted! Admin will review shortly.
          </div>
        </div>
      )}

      <div className="text-md leading-snug mb-6 px-4 font-[Google_Sans]">
        {levels[levelIndex]?.question}
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-row justify-center gap-4 mb-4">
        {/* Skip Button */}
        <button
          type="button"
          title="Skip"
          onClick={() => {
            /* TODO: implement skip logic */
          }}
          className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition duration-300 shadow-md border border-blue-400 flex items-center justify-center text-blue-700 text-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {/* Skip SVG */}
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
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        {/* Use Hint Button */}
        <button
          type="button"
          title="Use Hint"
          onClick={() => {
            setShowRequestForm(false);
            setShowWaitModal(false);
            if (!user?.token) {
              navigate("/login");
            } else {
              const hasTakenHint =
                profile?.takenHintLevels?.includes(levelIndex);
              if (hasTakenHint) {
                setShowHints(true);
              } else {
                if (profile?.hintPoints > 14) {
                  setShowHints(true);
                  // decrease here points
                  handleDecreaseHintPoints();
                } else {
                  // show request form for points
                  setShowHints(false);
                  setShowRequestForm(true);
                }
              }
            }
          }}
          className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 transition duration-300 shadow-md border border-yellow-400 flex items-center justify-center text-yellow-700 text-xl focus:outline-none focus:ring-2 focus:ring-yellow-300"
        >
          {/* Hint SVG */}
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
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12" y2="17" />
          </svg>
        </button>
      </div>

      {!levels[levelIndex]?.options?.length > 0 && (
        <input
          type="text"
          value={userAnswer}
          autoFocus
          placeholder="✍️ Write your answer here in English"
          className="w-full px-4 py-3 border-b-2 border-dashed border-gray-400 bg-yellow-100/60 text-lg font-medium placeholder-gray-500 focus:outline-none"
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onAnswer(userAnswer, levels[levelIndex]);
            }
          }}
        />
      )}

      {/* Options */}
      {levels[levelIndex]?.options?.length > 0 && (
        <div className="grid grid-cols-1 gap-3 px-4">
          {levels[levelIndex]?.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionAnswer(option)}
              className="w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium text-lg shadow-lg"
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4">
        {!mark && !levels[levelIndex]?.options?.length > 0 ? (
          <button
            onClick={() => handleTextAnswer()}
            className="w-full bg-[#85cc3c] hover:bg-[#76b535] transition text-white py-3 text-2xl rounded-2xl border-b-8 border-r-4 border-[#a17358] shadow-md transform active:translate-y-1 animate-pulse-pop"
          >
            Submit Answer
          </button>
        ) : (
          <Marker mark={mark} />
        )}
      </div>

      {/* Hints Modal */}
      {showHints && (
        <div
          className="absolute top-5 left-1/2 transform -translate-x-1/2
               z-50 bg-yellow-100 rounded-3xl p-5 shadow-xl
               w-[90%] max-w-[400px] max-h-[240px] overflow-y-auto
               border border-indigo-600 font-[Comic_Sans_MS] text-indigo-900"
        >
          {/* Close Button */}
          <button
            onClick={() => setShowHints(false)}
            className="absolute top-2 right-3 text-indigo-700 hover:text-indigo-900 text-xl font-bold"
            aria-label="Close"
          >
            &times;
          </button>

          <h3 className="text-xl font-bold text-center mb-3">🧩 Puzzle Hint</h3>

          <p className="text-base text-center leading-relaxed">
            {levels[levelIndex]?.hint ||
              "No hint available for this level. Try to think outside the box!"}
          </p>
        </div>
      )}

      {/* Transcation Requestion Modal */}
      {showRequestForm && (
        <div
          className="absolute top-5 left-1/2 transform -translate-x-1/2
      z-50 bg-yellow-100 rounded-3xl p-5 shadow-xl
      w-[90%] max-w-[400px] max-h-[460px] overflow-y-auto
      border border-indigo-600 font-[Comic_Sans_MS] text-indigo-900 mt-[-80px]"
        >
          {/* Close Button */}
          <button
            onClick={() => setShowRequestForm(false)}
            className="absolute top-2 right-3 text-indigo-700 hover:text-indigo-900 text-xl font-bold"
            aria-label="Close"
          >
            &times;
          </button>

          <h3 className="text-xl font-bold text-center mb-4">
            🎁 Deposit for Hint Points
          </h3>

          <form className="space-y-4" onSubmit={handleRequestPointsForm}>
            <div>
              <label className="block mb-2 font-semibold text-sm text-indigo-800">
                Select Hint Package:
              </label>
              <hr className="border-b-2 border-dashed border-gray-400 mb-1" />
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setSelectedPackage("20tk")}
                  className={`px-4 py-2 rounded-full border font-bold text-sm 
              ${
                selectedPackage === "20tk"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-indigo-700 border-indigo-300"
              }`}
                >
                  20৳ = 100 Hints
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPackage("50tk")}
                  className={`px-4 py-2 rounded-full border font-bold text-sm 
              ${
                selectedPackage === "50tk"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-indigo-700 border-indigo-300"
              }`}
                >
                  50৳ = 500 Hints
                </button>
              </div>
            </div>
            {/* Bkash Number */}
            <div className="text-sm bg-indigo-200 rounded-xl p-3 text-center font-semibold">
              Send Money to: <br />
              📱 <span className="text-indigo-800">01788262433</span>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  className="px-4 py-2 rounded-full border font-bold text-sm bg-white text-pink-600 border-pink-400"
                >
                  🅱️ Bkash
                </button>
              </div>
            </div>
            {/* Transaction ID Input */}
            <div>
              <label className="block mb-1 font-semibold text-sm">
                Transaction ID:
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full p-2 rounded-md border border-indigo-300"
                placeholder="Type your Transaction ID"
                required
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedPackage || !transactionId || isSubmitting}
              className={`w-full font-bold py-2 px-4 rounded-md transition-colors ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                "🚀 Submit"
              )}
            </button>
          </form>
        </div>
      )}
      {showWaitModal && (
        <div
          className="absolute top-5 left-1/2 transform -translate-x-1/2
      z-50 bg-yellow-100 rounded-3xl p-5 shadow-xl
      w-[90%] max-w-[400px] max-h-[460px] overflow-y-auto
      border border-indigo-600 font-[Comic_Sans_MS] text-indigo-900"
        >
          {/* Close Button */}
          <button
            onClick={() => setShowWaitModal(false)}
            className="absolute top-2 right-3 text-indigo-700 hover:text-indigo-900 text-xl font-bold"
            aria-label="Close"
          >
            &times;
          </button>

          <h3 className="text-2xl font-bold mb-3">
            ✅ Thanks for Your Submission!
          </h3>
          <p className="text-md mb-2">
            Please wait <span className="font-semibold">5 minutes</span> while
            we verify your transaction.
          </p>
          <p className="text-sm">
            For any inquiry, feel free to call:{" "}
            <span className="font-bold text-green-800">01788262433</span>
          </p>
        </div>
      )}
    </div>
  );
}
