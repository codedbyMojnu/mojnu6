import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import checkUserType from "../../utils/checkUserType";
import playSound from "../../utils/playSound";
import api from "./../../api/index";

export default function Login() {
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
            const { role } = checkUserType(response?.data?.token);
            if (role === "admin") {
              navigate("/dashboard");
            }
            if (role === "user") {
              navigate("/");
            }
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
    <div
      className="flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat bg-gradient-to-br from-blue-100 to-purple-200 font-[Patrick_Hand]"
      style={{
        backgroundImage: "url('/bg-images/notepad.png')",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-5 border-[3px] border-[#a17358]"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700">
          Login
        </h2>

        <div>
          <label className="block text-sm mb-1">Give a username:</label>
          <input
            name="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="rahim121"
            type="text"
          />
          {/* {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )} */}
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="*******"
            type="password"
          />
          {/* {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )} */}
        </div>

        <button
          onClick={() => playSound("/sounds/button-sound.mp3")}
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-500">
          Have You Already An Acount?{" "}
          <Link to="/signup" className="text-purple-600 font-medium">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
