import { useEffect, useState } from "react";
import api from "../../api"; // Adjust path if needed
import { useAuth } from "../../context/AuthContext";

export default function ApprovedTransactionList() {
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await api.get("/api/transactions", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (res.status === 200) {
          // Only show approved transactions
          const approved = res.data.filter(
            (tx) => tx.approveStatus === "approved"
          );
          setTransactions(approved);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    }

    fetchTransactions();
  }, [user]);

  return (
    <div className="p-6 font-[Patrick_Hand] w-full h-full overflow-y-auto bg-green-50/30">
      <h2 className="text-3xl text-center font-bold text-green-700 mb-6">
        Approved Transactions
      </h2>

      <div className="overflow-x-auto rounded-xl border border-green-300 shadow-md">
        <table className="min-w-full text-lg text-gray-700">
          <thead className="bg-green-200 text-gray-800 font-semibold text-left">
            <tr>
              <th className="p-3 border-b">Username</th>
              <th className="p-3 border-b">Transaction ID</th>
              <th className="p-3 border-b">Package Name</th>
              <th className="p-3 border-b">Approved Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No approved transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-green-100 transition">
                  <td className="p-3 border-b">{tx.username}</td>
                  <td className="p-3 border-b">{tx.transactionId}</td>
                  <td className="p-3 border-b">{tx.selectedPackage}</td>
                  <td className="p-3 border-b">
                    {new Date(tx.updatedAt || tx.createdAt).toLocaleString()}
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
