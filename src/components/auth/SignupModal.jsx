import { useCallback, useState } from "react";
import api from "../../api";
import playSound from "../../utils/playSound";

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Enhanced form handling
  const handleChange = useCallback(
    (e) => {
      if (error) setError(""); // Clear error when user starts typing
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    },
    [formData, error]
  );

  // Enhanced form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Clear previous errors
      setError("");

      // Validation
      if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
        setError("Please fill in all fields");
        return;
      }
      // Simple email validation
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      setIsLoading(true);

      try {
        const response = await api.post("/api/auth/register", {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });

        if (response.status === 201) {
          setSuccess(true);
          setTimeout(() => {
            onSwitchToLogin();
            setSuccess(false);
            setFormData({ username: "", email: "", password: "" });
          }, 2000);
        }
      } catch (err) {
        console.error("Signup error:", err);
        setError(
          err.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [formData, onSwitchToLogin]
  );

  // Handle modal close
  const handleClose = useCallback(() => {
    setError("");
    setSuccess(false);
    setFormData({ username: "", email: "", password: "" });
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content p-6 max-w-sm mx-4 animate-bounce-in relative">
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
          aria-label="Close signup modal"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-2">
            🎉 Join the Adventure
          </h2>
          <p className="text-sm text-gray-600">
            Create your account to save progress and unlock hints
          </p>
        </div>

        {/* Success Display */}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-green-700">
                Account created successfully! Redirecting to login...
              </span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-red-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Username
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
              placeholder="Choose a username"
              type="text"
              disabled={isLoading}
              aria-label="Username"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="Enter your email"
              type="email"
              disabled={isLoading}
              aria-label="Email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Password
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="Create a password (min 6 characters)"
              type="password"
              disabled={isLoading}
              aria-label="Password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => playSound("/sounds/button-sound.mp3")}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-purple-600 font-semibold hover:text-purple-700 underline transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
