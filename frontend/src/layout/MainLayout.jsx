import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";  // No props!
import Footer from "../components/Footer";
import InteractiveGrid from "../components/InteractiveGrid";
import { useTheme } from "../lib/theme";

export default function MainLayout({ children }) {
  const location = useLocation();
  const { isDark } = useTheme();
  const showMap = location.pathname === "/";
  const gridLines = location.pathname === "/events/skill-up-bootcamp";

  return (
    <div
      className={`min-h-dvh font-sans overflow-x-clip ${
        isDark ? "bg-[#000000] text-slate-100" : "bg-white text-slate-900"
      } ${gridLines ? "grid-lines" : ""} ${location.pathname === "/" ? "pb-32 lg:pb-0" : ""}`}
    >
      {gridLines && <InteractiveGrid />}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="brand-instagram" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f9ce34" />
            <stop offset="50%" stopColor="#ee2a7b" />
            <stop offset="100%" stopColor="#6228d7" />
          </linearGradient>
        </defs>
      </svg>
      <Navbar />
      <Sidebar />  {/* No showOnHomepage prop! */}
      <main className="pt-[var(--nav-height)] relative z-10">{children}</main>
      <Footer showMap={showMap} />
    </div>
  );
}
