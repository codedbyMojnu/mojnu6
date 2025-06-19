export default function Explanation() {
  return (
    <div class="flex items-center justify-center h-screen overflow-hidden m-0 p-0">
      <div class="w-[375px] h-[667px] bg-white shadow-md rounded-md p-6 overflow-hidden text-center">
        <h2 class="text-xl font-bold text-gray-700 mb-2">🧠 Brain Test App</h2>

        <h3 class="text-xl font-semibold text-gray-800 mb-3">
          Correct Answer!
        </h3>
        <p class="text-gray-700 mb-6">3 + 4 = 7. It’s a simple addition.</p>
        <a
          href="answer-form.html"
          class="inline-block w-full bg-blue-600 text-white py-3 rounded text-lg hover:bg-blue-700 transition"
        >
          Next Level →
        </a>
      </div>
    </div>
  );
}
