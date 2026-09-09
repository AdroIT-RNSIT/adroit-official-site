import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";  // No props!
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  const location = useLocation();
  const showMap = location.pathname === "/";
  const isEventPage = location.pathname.startsWith("/events");
  const isHomePage = location.pathname === "/";
  const isDomainsPage = location.pathname === "/domains";

  return (
    <div
      className={`min-h-dvh font-sans overflow-x-clip ${
        isEventPage
          ? "bg-[#080c16] text-slate-100"
          : isDomainsPage
            ? "bg-white text-slate-900"
            : isHomePage
              ? "bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900"
              : "bg-gradient-to-b from-white via-[#f9f0ff] to-[#f3e8ff] text-slate-900"
      }`}
    >
      {!isEventPage && (
        <div className="fixed inset-0 pointer-events-none z-0 hidden md:block">
          <div className={`absolute top-1/3 left-1/4 w-[500px] max-w-[100vw] h-[500px] rounded-full blur-[150px] ${isHomePage ? "bg-sky-600/5" : "bg-sky-600/5"}`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-[600px] max-w-[100vw] h-[600px] rounded-full blur-[150px] ${isHomePage ? "bg-slate-400/8" : "bg-sky-600/5"}`}></div>
        </div>
      )}

      <Navbar />
      <Sidebar />  {/* No showOnHomepage prop! */}
      <main className="pt-[var(--nav-height)] relative z-10">{children}</main>
      <Footer showMap={showMap} light={isDomainsPage} />
    </div>
  );
}