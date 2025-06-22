export default function WelcomeAdminDashboard() {
  return (
    <div
      className="w-full h-full p-6 font-[Patrick_Hand] text-gray-800"
      style={{ backgroundImage: "url('/bg-images/wood.png')" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-indigo-800 mb-4">
          Welcome, Admin!
        </h1>
        <p className="text-2xl text-gray-700 mb-6">
          This is your control panel to manage levels and questions.
        </p>

        <div className="bg-yellow-100/60 border border-dashed border-gray-400 p-6 rounded-2xl shadow-md text-xl space-y-4">
          <div className="text-left">
            <p>✅ Add new quiz levels with questions.</p>
            <p>📝 Edit or delete existing ones easily.</p>
            <p>📊 Monitor and improve the quiz experience.</p>
          </div>
        </div>

        <p className="mt-8 text-xl text-gray-600">
          🚀 Let’s build something fun and brainy!
        </p>
      </div>
    </div>
  );
}
