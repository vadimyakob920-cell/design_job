import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobsPage from "./pages/JobsPage";
import Application from "./pages/Application";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JobsPage />} />
        <Route path="/application" element={<Application />} />
      </Routes>
    </BrowserRouter>
  );
}