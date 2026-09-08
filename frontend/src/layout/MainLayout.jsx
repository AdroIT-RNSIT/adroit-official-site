import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useLenis from "../hooks/useLenis";

export default function MainLayout({ children }) {
  const location = useLocation();
  const showMap = location.pathname === "/";

  useLenis();

  return (
    <div className="min-h-dvh bg-bg-base text-text-primary font-sans">
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer showMap={showMap} />
    </div>
  );
}
