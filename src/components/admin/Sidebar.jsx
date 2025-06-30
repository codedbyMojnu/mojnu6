import { Link, NavLink } from "react-router";
import { useLevels } from "../../context/LevelContext";
import playSound from "../../utils/playSound";

export default function Sidebar() {
  const { levels } = useLevels();

  const activeLinkStyle = {
    backgroundColor: "#feeaa5",
    color: "#374151",
    fontWeight: "bold",
  };

  return (
    <aside className="w-56 bg-yellow-100/60 text-gray-700 h-full overflow-y-auto flex-shrink-0 border-r-2 border-dashed border-red-400/50 p-4">
      <div className="text-center mb-4 space-y-3">
        {/* App Title */}
        <h3 className="text-2xl font-extrabold text-[#4b0082] drop-shadow-sm tracking-wide">
          Brain Test
        </h3>

        {/* Play Puzzle Button */}
        <button onClick={() => playSound("/sounds/button-sound.mp3")}>
          <Link
            to="/"
            className="inline-block text-md font-bold uppercase px-2  rounded-2xl bg-yellow-300 text-[#333] hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-100 border-b-4 border-yellow-500"
          >
            🧩 Play Puzzle
          </Link>
        </button>
      </div>
      <NavLink
        to="/dashboard/survey"
        style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
        className="block w-full text-left font-bold px-4 py-2 text-xl text-pink-600 rounded-lg hover:bg-pink-100/80 transition-colors duration-200 mb-2"
      >
        📝 Survey
      </NavLink>
      <NavLink
        to="/dashboard/transactions"
        style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
        className="block w-full text-left font-bold px-4 py-2 text-xl text-blue-600 rounded-lg hover:bg-blue-100/80 transition-colors duration-200"
      >
        🧾 Transactions
      </NavLink>
      <ul className="pl-6 mt-1 space-y-1">
        <li>
          <NavLink
            to="/dashboard/approved-transactions"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="block w-full text-left px-4 py-2 text-xl rounded-lg hover:bg-yellow-200/60 transition-colors duration-200"
          >
            Approve Transactions
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/faked-transactions"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="block w-full text-left px-4 py-2 text-xl rounded-lg hover:bg-yellow-200/60 transition-colors duration-200"
          >
            Fake Transactions
          </NavLink>
        </li>
      </ul>
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/dashboard/add"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="block w-full text-left font-bold px-4 py-2 text-xl text-green-600 rounded-lg hover:bg-green-100/80 transition-colors duration-200"
          >
            + Add New Level
          </NavLink>
        </li>
        {levels?.map((level, i) => (
          <li key={level._id}>
            <NavLink
              to={`/dashboard/edit/${level._id}`}
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              className="block w-full text-left px-4 py-2 text-xl rounded-lg hover:bg-yellow-200/60 transition-colors duration-200"
            >
              {`Level ${i + 1}`}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
