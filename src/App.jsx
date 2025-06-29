import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import AddQuestionForm from "./components/admin/AddQuestionForm";
import AddSuccess from "./components/admin/AddSuccess";
import DashboardLayout from "./components/admin/DashboardLayout";
import { DeletedSuccess } from "./components/admin/DeletedSuccess";
import EditedSuccess from "./components/admin/EditedSuccess";

import ApprovedTransactionList from "./components/admin/ApprovedTransactionList";
import FakedTransactionList from "./components/admin/FakedTransactionList";
import TransactionList from "./components/admin/TransactionList";
import WelcomeAdminDashboard from "./components/admin/WelcomeAdminDashboard";
import CommunityMarketplace from "./components/CommunityMarketplace";
import Home from "./components/Home";
import PuzzleCreator from "./components/PuzzleCreator";
import AuthProvider from "./context/AuthContext";
import LevelProvider from "./context/LevelContext";
import ProfileProvider from "./context/ProfileContext";
import { hideLoadingScreen } from "./utils/hideLoadingScreen";
import PrivateRoutes from "./utils/PrivateRoutes";

export default function App() {
  useEffect(() => {
    // Hide the loading screen when the app is fully loaded
    const timer = setTimeout(() => {
      hideLoadingScreen();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <LevelProvider>
        <ProfileProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<Home />} />
              <Route path="community" element={<CommunityMarketplace />} />
              <Route path="create-puzzle" element={<PuzzleCreator />} />
              <Route element={<PrivateRoutes />}>
                <Route path="dashboard" element={<DashboardLayout />}>
                  <Route index element={<WelcomeAdminDashboard />} />
                  <Route path="add" element={<AddQuestionForm />} />
                  <Route path="edit/:id" element={<AddQuestionForm />} />
                  <Route path="deleted/:id" element={<DeletedSuccess />} />
                  <Route path="edited/:id" element={<EditedSuccess />} />
                  <Route path="added/:id" element={<AddSuccess />} />
                  <Route path="transactions" element={<TransactionList />} />
                  <Route
                    path="approved-transactions"
                    element={<ApprovedTransactionList />}
                  />
                   <Route path="faked-transactions" element={<FakedTransactionList />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </ProfileProvider>
      </LevelProvider>
    </AuthProvider>
  );
}
