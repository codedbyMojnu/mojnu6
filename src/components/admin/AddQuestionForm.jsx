export default function AddQuestionForm() {
  return (
    <>
      <h2 class="text-2xl font-semibold mb-6">✍️ Edit Level</h2>

      <div class="space-y-4">
        {/* <!-- Question --> */}
        <div>
          <label class="block font-bold mb-1">Question</label>
          <input
            type="text"
            value="What is 3 + 4?"
            class="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        {/* <!-- Answer --> */}
        <div>
          <label class="block font-bold mb-1">Answer (Number)</label>
          <input
            type="number"
            value="7"
            class="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        {/* <!-- Explanation --> */}
        <div>
          <label class="block font-bold mb-1">Explanation</label>
          <textarea rows="3" class="w-full p-3 border border-gray-300 rounded">
            3 + 4 = 7
          </textarea>
        </div>

        {/* <!-- Buttons --> */}
        <div class="pt-2 space-x-2">
          <button class="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded">
            ➕ Add
          </button>
          <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
            💾 Update
          </button>
          <button class="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded">
            🗑️ Delete
          </button>
        </div>
      </div>
    </>
  );
}
