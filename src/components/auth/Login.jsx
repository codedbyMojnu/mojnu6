import { useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../../context/AuthContext";
import playSound from "../../utils/playSound";
import api from "./../../api/index";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginData = { username: userName, password };
    if (userName.trim() && password.trim()) {
      async function handleLogin() {
        try {
          const response = await api.post("/api/auth/login", loginData);
          if (response.status === 200) {
            setUser({ token: response.data.token });
            setUserName("");
            setPassword("");
            navigate("/dashboard");
          } else {
            console.log("No match password and username");
          }
        } catch (err) {
          console.log(err.message);
        }
      }
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefce8] px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border-4 border-yellow-200">
        <h2 className="text-3xl font-extrabold text-center text-[#444] mb-6">
          🔐 Login to Brain Test
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          {/* User Name*/}
          <input
            type="text"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-5 py-3 text-lg rounded-xl border-2 border-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-200 placeholder-gray-500 shadow-inner"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 text-lg rounded-xl border-2 border-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-200 placeholder-gray-500 shadow-inner"
            required
          />

          {/* Login Button */}
          <button
            onClick={() => playSound("/sounds/button-sound.mp3")}
            type="submit"
            className="w-full bg-[#85cc3c] hover:bg-[#76b535] text-white text-xl font-bold py-3 rounded-2xl border-b-8 border-r-4 border-[#a17358] shadow-lg transform active:translate-y-1 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
