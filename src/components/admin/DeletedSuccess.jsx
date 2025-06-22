import { Link, useParams } from "react-router";

export function DeletedSuccess() {
  const prams = useParams();
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#fefce8] px-4"
      style={{ backgroundImage: "url('/bg-images/wood.png')" }}
    >
      <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-yellow-300 max-w-md w-full text-center space-y-4">
        <h2 className="text-3xl font-bold text-red-500">
          ✅ Deleted Successfully!
        </h2>
        <p className="text-gray-600 text-lg">
          Your level: {prams?.id} has been removed.
        </p>

        <Link
          to="/dashboard"
          className="inline-block mt-4 bg-yellow-300 hover:bg-yellow-400 text-[#444] font-bold px-6 py-3 rounded-2xl shadow-md border-b-4 border-yellow-500 transition duration-300"
        >
          🏠 Go to Home
        </Link>
      </div>
    </div>
  );
}
