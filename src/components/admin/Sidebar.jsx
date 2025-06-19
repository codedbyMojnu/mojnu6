export default function Sidebar() {
  return (
    <aside class="w-52 bg-gray-800 text-white p-4 h-screen overflow-y-auto flex-shrink-0">
      <h3 class="text-lg font-semibold mb-4">📋 Levels</h3>
      <ul class="space-y-2">
        <li class="bg-gray-700 hover:bg-gray-600 rounded px-3 py-2 cursor-pointer">
          Level 1
        </li>
        <li class="bg-gray-800 hover:bg-gray-600 rounded px-3 py-2 cursor-pointer">
          Level 2
        </li>
        <li class="bg-gray-800 hover:bg-gray-600 rounded px-3 py-2 cursor-pointer">
          Level 3
        </li>
      </ul>
    </aside>
  );
}
