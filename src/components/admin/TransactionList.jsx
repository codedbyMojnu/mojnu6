import { useEffect, useRef, useState } from "react";
import api from "../../api"; // Adjust path if needed
import { useAuth } from "../../context/AuthContext";
import playSound from "../../utils/playSound";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewTransactionAlert, setShowNewTransactionAlert] = useState(false);
  const { user } = useAuth();
  const prevTransactionCountRef = useRef(0);

  // Function to fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/transactions", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.status === 200) {
        const newTransactions = res.data;
        const pendingCount = newTransactions.filter(
          (tx) => tx.approveStatus === "pending"
        ).length;
        const prevCount = prevTransactionCountRef.current;

        // Show alert if new transactions arrived
        if (pendingCount > prevCount && prevCount > 0) {
          setShowNewTransactionAlert(true);
          setTimeout(() => setShowNewTransactionAlert(false), 5000);
          // Play notification sound
          playSound("/sounds/next-2.mp3");
        }

        prevTransactionCountRef.current = pendingCount;
        setTransactions(newTransactions);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      // Initial fetch
      fetchTransactions();

      // Set up polling every 10 seconds to check for new transactions
      const pollInterval = setInterval(() => {
        fetchTransactions();
      }, 10000); // 10 seconds

      // Cleanup interval on unmount or when user changes
      return () => clearInterval(pollInterval);
    }
  }, [user?.token]);

  // get specific user profile data includes hintPoints, maxLevel
  async function fetchProfile(username) {
    const response = await api.get(`/api/profile/${username}`);
    if (response?.status === 200) {
      return response?.data;
    }
  }

  async function handleApprove(id, username, packege) {
    const profile = await fetchProfile(username);
    let updatedProfileData = null;
    if (packege === "20tk") {
      updatedProfileData = {
        ...profile,
        hintPoints: profile?.hintPoints + 100,
      };
    }

    if (packege === "50tk") {
      updatedProfileData = {
        ...profile,
        hintPoints: profile?.hintPoints + 500,
      };
    }
    // This must be protect route on server and must header admin bearer api
    const response = await api.put(
      `/api/profile/${profile?.username}`,
      updatedProfileData
    );
    if (response.status === 200) {
      console.log("Hint Point Added");
    }

    // approve Status Set True When Approve a Transaction
    async function handleApproveStatus() {
      try {
        const response = await api.patch(
          `/api/transactions/${id}`,
          {
            approveStatus: "approved",
          },
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        console.log(response);
        if (response.status === 200) {
          const updatedTransactions = transactions?.filter(
            (transaction) => transaction._id !== id
          );
          setTransactions(updatedTransactions);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.error("Transaction not found.");
        } else {
          console.error(
            "An error occurred while updating the transaction status."
          );
        }
      }
    }
    await handleApproveStatus();
  }

  async function handleCancel(id) {
    try {
      const res = await api.patch(
        `/api/transactions/${id}`,
        {
          approveStatus: "faked",
        },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      if (res.status === 200) {
        setTransactions((prev) => prev.filter((tx) => tx._id !== id));
      }
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  }

  // Manual refresh function
  const handleManualRefresh = () => {
    fetchTransactions();
  };

  return (
    <div className="p-6 font-[Patrick_Hand] w-full h-full overflow-y-auto bg-yellow-50/30">
      {/* New Transaction Alert */}
      {showNewTransactionAlert && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            New transaction received! 🎉
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-[#4b0082]">
            Pending Transactions
          </h2>
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {
              transactions?.filter((tx) => tx.approveStatus === "pending")
                .length
            }{" "}
            Pending
          </div>
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Monitoring
          </div>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Refreshing...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-yellow-300 shadow-md">
        <table className="min-w-full text-lg text-gray-700">
          <thead className="bg-yellow-200 text-gray-800 font-semibold text-left">
            <tr>
              <th className="p-3 border-b">Username</th>
              <th className="p-3 border-b">Transaction ID</th>
              <th className="p-3 border-b">Package Name</th>
              <th className="p-3 border-b">Request Time</th>
              <th className="p-3 border-b text-center">Approve</th>
              <th className="p-3 border-b text-center">Cancel</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.filter((tx) => tx.approveStatus === "pending")
              .length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  {isLoading
                    ? "Loading transactions..."
                    : "No transactions found."}
                </td>
              </tr>
            ) : (
              transactions
                .filter((tx) => tx.approveStatus === "pending")
                .map((tx) => (
                  <tr key={tx._id} className="hover:bg-yellow-100 transition">
                    <td className="p-3 border-b">{tx.username}</td>
                    <td className="p-3 border-b">{tx.transactionId}</td>
                    <td className="p-3 border-b">{tx.selectedPackage}</td>
                    <td className="p-3 border-b">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 border-b text-center">
                      <button
                        onClick={() =>
                          handleApprove(tx._id, tx.username, tx.selectedPackage)
                        }
                        className="text-green-700 hover:text-green-900 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 mx-auto"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                    <td className="p-3 border-b text-center">
                      <button
                        onClick={() => handleCancel(tx._id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 mx-auto"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.536-10.95a1 1 0 00-1.414-1.415L10 8.586 7.879 6.464a1 1 0 00-1.415 1.414L10 11.414l2.121 2.122a1 1 0 001.415-1.415L11.414 10l2.122-2.121z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
