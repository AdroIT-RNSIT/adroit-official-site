import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0d1117] overflow-x-hidden">
      <Navbar />
      <Sidebar />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
}
