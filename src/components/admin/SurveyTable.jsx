import { useEffect, useState } from 'react';
import api from '../../api';

export default function SurveyTable() {
  const [allSurveys, setAllSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const res = await api.get('/api/survey/all');
        setAllSurveys(res.data);
      } catch (err) {
        setError('Could not load survey responses.');
      } finally {
        setLoading(false);
      }
    }
    fetchSurveys();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">All Survey Responses</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="min-w-full text-left text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Username</th>
                <th className="p-2">Rating</th>
                <th className="p-2">Happy?</th>
                <th className="p-2">Suggestion</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {allSurveys.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400 p-4">No survey responses yet.</td></tr>
              )}
              {allSurveys.map((s, i) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-pink-50">
                  <td className="p-2 font-semibold text-indigo-700">{s.user}</td>
                  <td className="p-2">{s.rating} / 5</td>
                  <td className="p-2">{s.happyIfClosed ? '😊' : '😞'}</td>
                  <td className="p-2 max-w-xs break-words">{s.suggestion || <span className="text-gray-400">—</span>}</td>
                  <td className="p-2 text-xs text-gray-500">{new Date(s.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 