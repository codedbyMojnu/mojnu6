export default function EditedSuccess() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#fefce8] px-4"
      style={{ backgroundImage: "url('/bg-images/wood.png')" }}
    >
      <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-yellow-300 max-w-md w-full text-center space-y-4">
        <h2 className="text-3xl font-bold text-green-600">
          📝 Edited Successfully!
        </h2>
        <p className="text-gray-600 text-lg">
          You can continue editing from the sidebar level options.
        </p>
      </div>
    </div>
  );
}
