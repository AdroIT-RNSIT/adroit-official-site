import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";  // No props!
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  const location = useLocation();
  const showMap = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#0d1117] overflow-hidden">
      <Navbar />
      <Sidebar />  {/* No showOnHomepage prop! */}
      <main className="pt-16">{children}</main>
      <Footer showMap={showMap}/>
    </div>
  );
}