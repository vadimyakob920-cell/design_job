import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobsPage from "./pages/JobsPage";
import Application from "./pages/Application";
import ApplicationSuccess from "./pages/ApplicationSuccess";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JobsPage />} />
        <Route path="/application" element={<Application />} />
        <Route path="/application/success" element={<ApplicationSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}