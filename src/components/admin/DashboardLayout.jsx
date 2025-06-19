import AddQuestionForm from "./AddQuestionForm";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div class="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main class="flex-1 p-6 bg-white h-screen overflow-y-auto">
        <AddQuestionForm />
      </main>
    </div>
  );
}
