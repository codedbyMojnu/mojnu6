import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
import checkUserType from "../utils/checkUserType";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export default function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    _id: "",
    username: "",
    hintPoints: 0,
    maxLevel: 0,
    takenHintLevels: [],
  });
  const { user } = useAuth();
  const [error, setError] = useState("");

  // Function to fetch profile data
  const fetchProfile = async (username) => {
    try {
      const response = await api.get(`/api/profile/${username}`);
      if (response?.status === 200) {
        setProfile(response?.data);
        setError("");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Profile not found. Please contact support or try again.");
      } else {
        setError("An error occurred while fetching the profile. Please try again later.");
      }
    }
  };

  useEffect(() => {
    if (user?.token) {
      const { username } = checkUserType(user?.token);
      fetchProfile(username);

      // Set up polling every 15 seconds to check for profile updates
      const pollInterval = setInterval(() => {
        fetchProfile(username);
      }, 15000); // 15 seconds

      // Cleanup interval on unmount or when user changes
      return () => clearInterval(pollInterval);
    }
  }, [user?.token]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, error, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
