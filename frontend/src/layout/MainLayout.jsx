import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import CircuitBG from "../components/CircuitBG";

export default function MainLayout({ children }) {
  const location  = useLocation();
  const isEventPage = location.pathname.startsWith("/events");
  const isHomePage  = location.pathname === "/";

  return (
    <div
      className={`min-h-dvh overflow-x-clip relative ${
        isEventPage
          ? "bg-[#060b18] text-slate-100"
          : isHomePage
            ? "bg-white dark:bg-[#060b18] text-slate-900 dark:text-slate-100"
            : "bg-gradient-to-b from-white via-[#f8f5ff] to-[#f2eeff] dark:bg-[#060b18] dark:from-[#060b18] dark:to-[#060b18] text-slate-900 dark:text-slate-100"
      }`}
    >
      {/* ── Circuit board background — consistent across all pages ── */}
      <CircuitBG />

      {/* ── Subtle ambient colour orbs — desktop only ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] overflow-hidden hidden md:block"
      >
        {/* Cyan glow — top-left */}
        <div style={{
          position: "absolute",
          top: "-15%", left: "-8%",
          width: "50vw", height: "50vw",
          maxWidth: 640, maxHeight: 640,
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 40%, rgba(0,212,255,0.07) 0%, transparent 65%)",
          filter: "blur(40px)",
        }} />
        {/* Violet glow — bottom-right */}
        <div style={{
          position: "absolute",
          bottom: "-10%", right: "-8%",
          width: "50vw", height: "50vw",
          maxWidth: 640, maxHeight: 640,
          borderRadius: "50%",
          background: "radial-gradient(circle at 60% 60%, rgba(124,58,237,0.07) 0%, transparent 65%)",
          filter: "blur(50px)",
        }} />
      </div>

      <Navbar />
      <Sidebar />
      <main className="pt-[var(--nav-height)] relative z-10">{children}</main>
      <Footer showMap={isHomePage} />
    </div>
  );
}
