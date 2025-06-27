import { useEffect, useState } from "react";
import api from "../../api"; // Adjust path if needed
import { useAuth } from "../../context/AuthContext";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await api.get("/api/transactions", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (res.status === 200) {
          setTransactions(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    }

    fetchTransactions();
  }, [user]);

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
      const res = await api.patch(`/api/transactions/${id}`, {
        approveStatus: "faked",
      }, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.status === 200) {
        setTransactions((prev) => prev.filter((tx) => tx._id !== id));
      }
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  }

  return (
    <div className="p-6 font-[Patrick_Hand] w-full h-full overflow-y-auto bg-yellow-50/30">
      <h2 className="text-3xl text-center font-bold text-[#4b0082] mb-6">
        Pending Transactions
      </h2>

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
                  No transactions found.
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
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.536-10.95a1 1 0 00-1.414-1.415L10 8.586 7.879 6.464a1 1 0 00-1.415 1.414L8.586 10l-2.122 2.121a1 1 0 101.415 1.415L10 11.414l2.121 2.122a1 1 0 001.415-1.415L11.414 10l2.122-2.121z"
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
