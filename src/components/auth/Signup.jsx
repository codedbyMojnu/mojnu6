import { Link } from "react-router";

export default function Signup() {
  return (
    <div
      className="flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat bg-gradient-to-br from-blue-100 to-purple-200 font-[Patrick_Hand]"
      style={{
        backgroundImage: "url('/bg-images/notepad.png')",
      }}
    >
      <form
        //onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-5 border-[3px] border-[#a17358]"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700">
          Sign Up
        </h2>

        {/* Red message for hints */}
        <p className="text-center text-red-600 font-semibold text-base mb-2">
          If you want to use hint you must first create an account.
        </p>

        <div>
          <label className="block text-sm mb-1">Give a username:</label>
          <input
            name="username"
            //value={formData.username}
            //onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="example@email.com"
            type="text"
          />
          {/* {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )} */}
        </div>

        <div>
          <label className="block text-sm mb-1">পাসওয়ার্ড</label>
          <input
            name="password"
            // value={formData.password}
            //onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="*******"
            type="password"
          />
          {/* {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )} */}
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Register
        </button>

        <p className="text-sm text-center text-gray-500">
          Have You Already An Acount?{" "}
          <Link to="/login" className="text-purple-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
