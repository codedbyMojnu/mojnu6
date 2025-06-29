import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Leaderboard API functions
export const leaderboardAPI = {
  // Get global leaderboard
  getGlobalLeaderboard: (params = {}) => api.get('/api/leaderboard/global', { params }),

  // Get weekly leaderboard
  getWeeklyLeaderboard: (params = {}) => api.get('/api/leaderboard/weekly', { params }),

  // Get monthly leaderboard
  getMonthlyLeaderboard: (params = {}) => api.get('/api/leaderboard/monthly', { params }),

  // Get user ranking
  getUserRanking: (username) => api.get(`/api/leaderboard/ranking/${username}`),

  // Create friend challenge
  createChallenge: (data, token) => api.post('/api/leaderboard/challenge', data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Respond to challenge
  respondToChallenge: (username, data, token) => api.put(`/api/leaderboard/challenge/${username}/respond`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Get user challenges
  getUserChallenges: (username, token) => api.get(`/api/leaderboard/challenges/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Get user notifications
  getUserNotifications: (username, params = {}, token) => api.get(`/api/leaderboard/notifications/${username}`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Mark notification as read
  markNotificationRead: (username, notificationId, token) => api.put(`/api/leaderboard/notifications/${username}/${notificationId}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Update competition points
  updateCompetitionPoints: (username, data, token) => api.put(`/api/leaderboard/competition/${username}/points`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

export default api;
