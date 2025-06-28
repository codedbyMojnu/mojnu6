import { useCallback, useEffect, useState } from "react";
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
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [inputError, setInputError] = useState("");
  const { levels } = useLevels();
  const { user } = useAuth();
  const { profile, setProfile } = useProfile();
  const [transactionId, setTransactionId] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");

  const navigate = useNavigate();

  // Calculate progress percentage
  const progressPercentage =
    levels.length > 0 ? ((levelIndex + 1) / levels.length) * 100 : 0;
  const completedLevels = profile?.maxLevel || 0;
  const totalLevels = levels.length;

  // Clear input error when user types
  useEffect(() => {
    if (inputError && userAnswer.trim()) {
      setInputError("");
    }
  }, [userAnswer, inputError]);

  // Enhanced text answer handling with validation
  const handleTextAnswer = useCallback(() => {
    const trimmedAnswer = userAnswer.trim();
    if (!trimmedAnswer) {
      setInputError("Please enter your answer");
      return;
    }
    setInputError("");
    onAnswer(trimmedAnswer, levels[levelIndex]);
  }, [userAnswer, onAnswer, levels, levelIndex]);

  // Enhanced option answer handling
  const handleOptionAnswer = useCallback(
    (option) => {
      setSelectedOption(option);
      onAnswer(option, levels[levelIndex]);
    },
    [onAnswer, levels, levelIndex]
  );

  // Enhanced hint points management
  const handleDecreaseHintPoints = useCallback(async () => {
    if (!profile?.username) return;

    try {
      const updatedProfileData = {
        ...profile,
        hintPoints: Math.max(0, profile.hintPoints - 15),
        takenHintLevels: [...(profile.takenHintLevels || []), levelIndex],
      };

      const response = await api.put(
        `/api/profile/${profile.username}`,
        updatedProfileData
      );

      if (response.status === 200) {
        setProfile(updatedProfileData);
      }
    } catch (error) {
      console.error("Failed to update hint points:", error);
    }
  }, [profile, levelIndex, setProfile]);

  // Enhanced transaction form handling
  const handleRequestPointsForm = useCallback(
    async (e) => {
      e.preventDefault();
      if (!selectedPackage || !transactionId.trim()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const { username } = checkUserType(user?.token);
        const transactionData = {
          username,
          transactionId: transactionId.trim(),
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
    },
    [selectedPackage, transactionId, user?.token]
  );

  // Handle hint button click
  const handleHintClick = useCallback(() => {
    setShowRequestForm(false);
    setShowWaitModal(false);

    if (!user?.token) {
      navigate("/login");
      return;
    }

    const hasTakenHint = profile?.takenHintLevels?.includes(levelIndex);
    if (hasTakenHint) {
      setShowHints(true);
    } else {
      if (profile?.hintPoints > 14) {
        setShowHints(true);
        handleDecreaseHintPoints();
      } else {
        setShowHints(false);
        setShowRequestForm(true);
      }
    }
  }, [user?.token, navigate, profile, levelIndex, handleDecreaseHintPoints]);

  // Handle skip button click
  const handleSkipClick = useCallback(() => {
    setShowSkipModal(true);
  }, []);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e) => {
      if (
        e.key === "Enter" &&
        !showHints &&
        !showRequestForm &&
        !showWaitModal
      ) {
        e.preventDefault();
        handleTextAnswer();
      }
    },
    [handleTextAnswer, showHints, showRequestForm, showWaitModal]
  );

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHints && !event.target.closest(".hint-modal")) {
        setShowHints(false);
      }
      if (showRequestForm && !event.target.closest(".request-modal")) {
        setShowRequestForm(false);
      }
      if (showWaitModal && !event.target.closest(".wait-modal")) {
        setShowWaitModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHints, showRequestForm, showWaitModal]);

  return (
    <div className="flex flex-col h-full font-[Patrick_Hand] text-gray-800 relative">
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-down max-w-sm mx-4">
          <div className="flex items-center gap-2 text-responsive-sm">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Transaction submitted! Admin will review shortly.</span>
          </div>
        </div>
      )}

      {/* Question Display */}
      <div className="text-responsive-sm sm:text-base leading-snug mb-3 px-4 font-[Google_Sans] bg-yellow-50/50 rounded-lg p-3 flex-1 max-h-[80px] overflow-y-auto">
        {levels[levelIndex]?.question}
      </div>

      {/* Enhanced Text Input */}
      {!levels[levelIndex]?.options?.length > 0 && (
        <div className="px-4 mb-3">
          <input
            type="text"
            value={userAnswer}
            autoFocus
            placeholder="✍️ Write your answer here in English"
            className={`input text-responsive-sm font-medium placeholder-gray-500 ${
              inputError ? "border-red-400 focus:border-red-400" : ""
            }`}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Enter your answer"
          />
          {inputError && (
            <p className="text-red-500 text-responsive-xs mt-1">{inputError}</p>
          )}
        </div>
      )}

      {/* Enhanced Options */}
      {levels[levelIndex]?.options?.length > 0 && (
        <div className="grid grid-cols-1 gap-2 px-4 mb-3 flex-1 overflow-y-auto">
          {levels[levelIndex]?.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionAnswer(option)}
              className="w-full text-left px-3 py-2 rounded-lg border-2 transition-all duration-200 font-medium text-responsive-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[44px] flex items-center"
              aria-label={`Select option ${String.fromCharCode(
                65 + index
              )}: ${option}`}
            >
              <span className="font-bold text-blue-600 mr-2">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Enhanced Action Buttons Row */}
      <div className="flex flex-row justify-center gap-4 sm:gap-6 mb-4 px-4">
        {/* Skip Button */}
        <button
          type="button"
          title="Skip Level"
          onClick={handleSkipClick}
          className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 hover:border-blue-300 hover:from-blue-100 hover:to-indigo-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          aria-label="Skip to next level"
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-700 group-hover:text-blue-800 transition-colors duration-300 relative z-10 w-4 h-4"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>

          {/* Label */}
          <span className="text-responsive-xs font-semibold text-blue-700 group-hover:text-blue-800 mt-1 transition-colors duration-300 relative z-10">
            Skip
          </span>

          {/* Tooltip */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-responsive-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
            Skip to next level
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        </button>

        {/* Use Hint Button */}
        <button
          type="button"
          title="Use Hint"
          onClick={handleHintClick}
          className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-200 hover:border-amber-300 hover:from-amber-100 hover:to-yellow-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          aria-label="Get a hint for this level"
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-700 group-hover:text-amber-800 transition-colors duration-300 relative z-10 w-4 h-4"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12" y2="17" />
          </svg>

          {/* Label */}
          <span className="text-responsive-xs font-semibold text-amber-700 group-hover:text-amber-800 mt-1 transition-colors duration-300 relative z-10">
            Hint
          </span>

          {/* Tooltip */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-responsive-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
            Use hint ({profile?.hintPoints || 0} available)
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        </button>
      </div>

      {/* Submit Button */}
      <div className="px-4 mt-auto">
        {!mark && !levels[levelIndex]?.options?.length > 0 ? (
          <button
            onClick={handleTextAnswer}
            disabled={!userAnswer.trim()}
            className="btn btn-primary w-full text-responsive-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        ) : mark ? (
          <Marker mark={mark} />
        ) : null}
      </div>

      {/* Enhanced Hints Modal */}
      {showHints && (
        <div className="modal-overlay">
          <div className="modal-content p-4 max-w-sm mx-4 hint-modal animate-bounce-in">
            {/* Close Button */}
            <button
              onClick={() => setShowHints(false)}
              className="absolute top-2 right-2 text-indigo-700 hover:text-indigo-900 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-100 transition-colors"
              aria-label="Close hint"
            >
              ×
            </button>

            <h3 className="text-responsive-lg font-bold text-center mb-3 text-indigo-900">
              🧩 Puzzle Hint
            </h3>

            <div className="bg-yellow-50 border-2 border-indigo-200 rounded-xl p-3">
              <p className="text-responsive-sm text-center leading-relaxed text-indigo-800">
                {levels[levelIndex]?.hint ||
                  "No hint available for this level. Try to think outside the box!"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Transaction Request Modal */}
      {showRequestForm && (
        <div className="modal-overlay">
          <div className="modal-content p-4 max-w-sm mx-4 request-modal animate-bounce-in max-h-[80vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowRequestForm(false)}
              className="absolute top-2 right-2 text-indigo-700 hover:text-indigo-900 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-100 transition-colors"
              aria-label="Close request form"
            >
              ×
            </button>

            <h3 className="text-responsive-lg font-bold text-center mb-3 text-indigo-900">
              🎁 Deposit for Hint Points
            </h3>

            <form className="space-y-3" onSubmit={handleRequestPointsForm}>
              {/* Package Selection */}
              <div>
                <label className="block mb-1 font-semibold text-responsive-xs text-indigo-800">
                  Select Hint Package:
                </label>
                <hr className="border-b-2 border-dashed border-gray-400 mb-2" />
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setSelectedPackage("20tk")}
                    className={`px-3 py-2 rounded-full border font-bold text-responsive-xs transition-all ${
                      selectedPackage === "20tk"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    20৳ = 100 Hints
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPackage("50tk")}
                    className={`px-3 py-2 rounded-full border font-bold text-responsive-xs transition-all ${
                      selectedPackage === "50tk"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    50৳ = 500 Hints
                  </button>
                </div>
              </div>

              {/* Payment Info */}
              <div className="text-responsive-xs bg-indigo-100 rounded-xl p-3 text-center font-semibold">
                <p className="mb-1">Send Money to:</p>
                <p className="text-responsive-sm font-bold text-indigo-800 mb-2">
                  📱 01788262433
                </p>
                <button
                  type="button"
                  className="px-3 py-1 rounded-full border font-bold text-responsive-xs bg-white text-pink-600 border-pink-400 hover:bg-pink-50 transition-colors"
                >
                  🅱️ Bkash
                </button>
              </div>

              {/* Transaction ID Input */}
              <div>
                <label className="block mb-1 font-semibold text-responsive-xs text-indigo-800">
                  Transaction ID:
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="input text-responsive-xs"
                  placeholder="Enter your Transaction ID"
                  required
                  aria-label="Transaction ID"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  !selectedPackage || !transactionId.trim() || isSubmitting
                }
                className={`btn w-full font-bold text-responsive-xs transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "btn-primary"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  "🚀 Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Wait Modal */}
      {showWaitModal && (
        <div className="modal-overlay">
          <div className="modal-content p-4 max-w-sm mx-4 wait-modal animate-bounce-in">
            {/* Close Button */}
            <button
              onClick={() => setShowWaitModal(false)}
              className="absolute top-2 right-2 text-indigo-700 hover:text-indigo-900 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-100 transition-colors"
              aria-label="Close wait modal"
            >
              ×
            </button>

            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-responsive-lg font-bold mb-2 text-green-700">
                Thanks for Your Submission!
              </h3>
              <p className="text-responsive-xs mb-2 text-gray-700">
                Please wait{" "}
                <span className="font-semibold text-green-600">5 minutes</span>{" "}
                while we verify your transaction.
              </p>
              <p className="text-responsive-xs text-gray-600">
                For any inquiry, feel free to call:{" "}
                <span className="font-bold text-green-800">01788262433</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Skip Level Modal */}
      {showSkipModal && (
        <div className="modal-overlay">
          <div className="modal-content p-4 max-w-sm mx-4 animate-bounce-in">
            {/* Close Button */}
            <button
              onClick={() => setShowSkipModal(false)}
              className="absolute top-2 right-2 text-indigo-700 hover:text-indigo-900 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-100 transition-colors"
              aria-label="Close skip modal"
            >
              ×
            </button>

            <div className="text-center">
              <div className="text-4xl mb-3">🚫</div>
              <h3 className="text-responsive-lg font-bold mb-3 text-red-700">
                Skip Not Allowed
              </h3>
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
                <p className="text-responsive-sm text-center leading-relaxed text-red-800 font-medium">
                  We are not allowed you, to skip a level
                </p>
              </div>
              <p className="text-responsive-xs text-gray-600 mb-4">
                Please complete the current level to progress. Use hints if you need help!
              </p>
              <button
                onClick={() => setShowSkipModal(false)}
                className="btn btn-secondary w-full text-responsive-sm"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
