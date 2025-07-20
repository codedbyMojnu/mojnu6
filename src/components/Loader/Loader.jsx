import React from "react";
import "./Loader.css";

export default function Loader({
  progress = 0,
  status = "Loading...",
  error = null,
  retry = null,
  title = "Loading...",
  description = "Please wait while we load your content.",
}) {
  // Clamp progress between 0 and 100
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div
      id="initial-loading"
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden loading-fade-in"
      style={{ backgroundImage: 'url("/bg-images/notepad.png")' }}
      aria-busy={!error}
      aria-live="polite"
      role="status"
    >
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-2 sm:mx-4">
        <div className="loading-card p-4 sm:p-6 md:p-8 text-center loading-fade-in">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-green-500 border-t-transparent rounded-full loading-spin mx-auto mb-4 sm:mb-6" aria-hidden="true"></div>
          <h1 className="loading-text-lg sm:loading-text-2xl font-bold text-gray-700 mb-3 sm:mb-4">
            {title}
          </h1>
          <p className="loading-text-sm sm:loading-text-lg text-gray-600 mb-4 sm:mb-6">
            {description}
            <span className="loading-dots"></span>
          </p>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-bold text-red-500 mb-2">Error</h2>
              <p className="text-gray-700 mb-3">{error}</p>
              {retry && (
                <button
                  onClick={retry}
                  className="w-full py-2 bg-blue-500 text-white rounded-md font-bold hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full loading-bounce"></div>
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full loading-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full loading-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="loading-text-sm text-gray-600">{status}</span>
                  <span
                    id="progress-text"
                    className="loading-text-sm font-semibold text-green-500"
                  >
                    {safeProgress}%
                  </span>
                </div>
                <div className="loading-progress-container">
                  <div
                    id="progress-fill"
                    className="loading-progress-fill"
                    style={{ width: `${safeProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-6 loading-text-sm text-gray-500">
            <p id="loading-status">{error ? "An error occurred." : status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
