import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobsPage from "./pages/JobsPage";
import Application from "./pages/Application";
import ApplicationSuccess from "./pages/ApplicationSuccess";
import { recordVisitStep } from "./api/backend";

function VisitTracker() {
  useEffect(() => {
    recordVisitStep(1).catch(() => {});
  }, []);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <VisitTracker />
      <Routes>
        <Route path="/" element={<JobsPage />} />
        <Route path="/application" element={<Application />} />
        <Route path="/application/success" element={<ApplicationSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}
