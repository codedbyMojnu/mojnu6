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
import Home from "./components/Home";
import AuthProvider from "./context/AuthContext";
import LevelProvider from "./context/LevelContext";
import ProfileProvider from "./context/profileContext";
import PrivateRoutes from "./utils/PrivateRoutes";

export default function App() {
  return (
    <AuthProvider>
      <LevelProvider>
        <ProfileProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<Home />} />
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
