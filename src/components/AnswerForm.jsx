export default function AnswerForm() {
  return (
    <div className="flex justify-center items-center h-screen overflow-hidden m-0 p-0 bg-gray-100">
      <div className="w-[375px] h-[667px] bg-white shadow-md rounded-md p-6 overflow-hidden">
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          🧠 Brain Test App
        </h2>
        <p className="text-sm text-gray-500 mb-1">Level 1</p>
        <p className="text-xl font-semibold text-gray-800 mb-6">
          What is 3 + 4?
        </p>
        <form>
          <input
            type="number"
            placeholder="Your Answer"
            className="w-full px-4 py-3 border rounded text-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 text-lg rounded hover:bg-green-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
