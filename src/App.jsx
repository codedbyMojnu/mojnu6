import { BrowserRouter, Route, Routes } from "react-router";
import AnswerForm from "./components/AnswerForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<AnswerForm />} />
      </Routes>
    </BrowserRouter>
  );
}
