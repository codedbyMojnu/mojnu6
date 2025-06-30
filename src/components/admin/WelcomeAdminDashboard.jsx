import { useEffect, useState } from 'react';
import api from '../../api';

export default function WelcomeAdminDashboard() {
  const [survey, setSurvey] = useState(null);
  useEffect(() => {
    api.get('/api/survey/summary').then(res => setSurvey(res.data));
  }, []);

  return (
    <div
      className="w-full h-full p-6 font-[Patrick_Hand] text-gray-800"
      style={{ backgroundImage: "url('/bg-images/wood.png')" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-indigo-800 mb-4">
          Welcome, Admin!
        </h1>
        <p className="mt-8 text-xl text-gray-600">
          🚀 Let's build something fun and brainy!
        </p>
        <p className="text-2xl text-gray-700 mb-6">
          This is your control panel to manage levels and questions.
        </p>

        {/* Survey Analytics */}
        {survey && (
          <div className="bg-pink-100/60 border border-pink-300 p-6 rounded-2xl shadow-md text-xl space-y-2 mb-8">
            <div className="font-bold text-pink-700 text-2xl mb-2">Survey Analytics</div>
            <div className="flex flex-wrap gap-6 justify-center mb-2">
              <div>⭐ গড় রেটিং: <span className="font-bold text-yellow-600">{survey.avgRating}</span> / 5</div>
              <div>👥 মোট রেসপন্স: <span className="font-bold">{survey.total}</span></div>
              <div>😊 খুশি: <span className="font-bold text-green-600">{survey.happyCount}</span></div>
              <div>😞 খুশি না: <span className="font-bold text-red-600">{survey.unhappyCount}</span></div>
            </div>
            <div className="text-left mt-4">
              <div className="font-semibold mb-1">📝 পরামর্শসমূহ:</div>
              <ul className="list-disc pl-6 space-y-1 text-base">
                {survey.suggestions.length === 0 && <li className="text-gray-500">No suggestions yet.</li>}
                {survey.suggestions.map((s, i) => (
                  <li key={i}>
                    <span className="text-gray-800">{s.suggestion}</span>
                    <span className="text-xs text-gray-400 ml-2">({new Date(s.createdAt).toLocaleString()})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="bg-yellow-100/60 border border-dashed border-gray-400 p-6 rounded-2xl shadow-md text-xl space-y-4">
          <div>Instructions</div>
          <div className="text-left">
            <p>✅ Add new quiz levels with questions.</p>
            <p>📝 Edit or delete existing ones easily.</p>
            <p>📊 Monitor and improve the quiz experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
