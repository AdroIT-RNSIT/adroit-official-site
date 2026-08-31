import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";  // No props!
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  const location = useLocation();
  const showMap = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans overflow-x-clip">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] max-w-[100vw] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] max-w-[100vw] h-[600px] bg-purple-600/5 rounded-full blur-[150px]"></div>
      </div>

      <Navbar />
      <Sidebar />  {/* No showOnHomepage prop! */}
      <main className="pt-16 relative z-10">{children}</main>
      <Footer showMap={showMap}/>
    </div>
  );
}