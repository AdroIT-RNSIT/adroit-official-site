import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Members from "./pages/Members";
import MainLayout from "./layout/MainLayout";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </MainLayout>
  );
}
