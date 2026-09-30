import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";  // No props!
import Footer from "../components/Footer";
import { useTheme } from "../lib/theme";

export default function MainLayout({ children }) {
  const location = useLocation();
  const { isDark } = useTheme();
  const showMap = location.pathname === "/";

  return (
    <div
      className={`min-h-dvh font-sans overflow-x-clip ${
        isDark ? "bg-[#080c16] text-slate-100" : "bg-white text-slate-900"
      }`}
    >
      <Navbar />
      <Sidebar />  {/* No showOnHomepage prop! */}
      <main className="pt-[var(--nav-height)] relative z-10">{children}</main>
      <Footer showMap={showMap} />
    </div>
  );
}
