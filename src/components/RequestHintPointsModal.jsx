import { useState } from "react";
import api from "../api";
import checkUserType from "../utils/checkUserType";

export default function RequestHintPointsModal({ isOpen, onClose, user, profile, setProfile }) {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWaitModal, setShowWaitModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  if (!isOpen) return null;

  const handleRequestPointsForm = async (e) => {
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
        setShowWaitModal(true);
        setTransactionId("");
        setSelectedPackage("");
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 5000);
      }
    } catch (error) {
      alert("Failed to submit transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-7 max-w-md mx-4 rounded-2xl shadow-2xl border-2 border-blue-200 w-full" style={{ boxShadow: '0 8px 32px 0 rgba(80, 120, 255, 0.18)' }}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-blue-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors"
            aria-label="Close request hint points modal"
          >
            ×
          </button>
          <h3 className="text-2xl font-extrabold text-blue-700 mb-4 flex items-center gap-2">
            <span className="text-3xl">💡</span> Request Hint Points
          </h3>
          <div className="mb-5 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <div className="text-base font-bold text-pink-700 mb-1">Bkash Number: <span className="font-mono">01788262433</span></div>
            <div className="text-sm text-blue-800">Send Money to this and Submit your transaction.</div>
          </div>
          <form onSubmit={handleRequestPointsForm} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-2">
                Select Package:
              </label>
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="w-full p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-blue-900 font-semibold"
                required
              >
                <option value="">Select a package</option>
                <option value="basic">Basic Package (100 points)</option>
                <option value="premium">Premium Package (250 points)</option>
                <option value="ultimate">Ultimate Package (500 points) & get all benafits</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-2">
                Transaction ID:
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
                className="w-full p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-blue-900 font-semibold"
                required
              />
            </div>
            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Wait Modal */}
      {showWaitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-xl p-6 max-w-sm mx-4 rounded-2xl shadow-xl border border-white/20 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Request Submitted!
            </h3>
            <p className="text-gray-600 mb-4">
              Your transaction is being reviewed. You'll receive your hint
              points soon.
            </p>
            <button
              onClick={() => setShowWaitModal(false)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Transaction submitted successfully!
        </div>
      )}
    </>
  );
} 