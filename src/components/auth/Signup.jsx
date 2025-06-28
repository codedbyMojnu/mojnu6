import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../../api";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // Enhanced form handling
  const handleChange = useCallback((e) => {
    if (error) setError(""); // Clear error when user starts typing
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }, [formData, error]);

  // Enhanced form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    
    // Validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please fill in all fields");
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
        password: formData.password
      });
      
      if (response.statusText === "Created") {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [formData, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat bg-gradient-to-br from-blue-100 to-purple-200 font-[Patrick_Hand]"
         style={{ backgroundImage: "url('/bg-images/notepad.png')" }}>
      <div className="container">
        <div className="card p-6 sm:p-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-responsive-xl sm:text-2xl font-bold text-purple-700">
              Join the Adventure!
            </h2>
            <p className="text-responsive-sm text-gray-600 mt-2">
              Create your account to start solving puzzles
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-responsive-sm text-green-700">
                  Account created successfully! Redirecting to login...
                </span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-responsive-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Hint Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-responsive-sm text-yellow-800">
                <strong>Important:</strong> You need an account to use hints and save your progress!
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-responsive-sm font-semibold mb-2 text-gray-700">
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

            {/* Password Field */}
            <div>
              <label className="block text-responsive-sm font-semibold mb-2 text-gray-700">
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
                minLength={6}
              />
              <p className="text-responsive-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full text-responsive-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="text-center mt-6">
            <p className="text-responsive-sm text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-purple-600 font-semibold hover:text-purple-700 underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-responsive-sm font-semibold text-blue-800 mb-2">
              🎁 Account Benefits:
            </h3>
            <ul className="text-responsive-xs text-blue-700 space-y-1">
              <li>• Save your progress across devices</li>
              <li>• Use hints when you're stuck</li>
              <li>• Track your highest level</li>
              <li>• Compete with other players</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
