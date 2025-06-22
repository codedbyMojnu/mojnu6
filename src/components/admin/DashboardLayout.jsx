import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div className="h-screen flex overflow-hidden font-[Patrick_Hand]">
      {/* Sidebar with independent scroll */}
      <Sidebar />

      {/* Right Content Panel: No scrolling here */}
      <main className="flex-1 h-full overflow-hidden">
        <div className="h-full w-full ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
