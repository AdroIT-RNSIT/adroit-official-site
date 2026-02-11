import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// ===== LAYOUT =====
import MainLayout from "./layout/MainLayout";

// ===== PUBLIC PAGES (No Login Required) =====
import Home from "./pages/Home";
import Events from "./pages/Events";
import Team from "./pages/Team";
import Domains from "./pages/Domains";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

// ===== PROTECTED PAGES (Login Required + Approval) =====
import Resources from "./pages/Resources";
import Members from "./pages/Members";

// ===== ADMIN ONLY PAGES =====
import AdminDashboard from "./pages/AdminDashboard";

// ===== PROTECTED ROUTE WRAPPER =====
import ProtectedRoute from "./components/ProtectedRoute";

// Layout wrapper component
function WithLayout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}

export default function App() {
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Routes>
      
      {/* ============================================ */}
      {/* ===== 1. AUTHENTICATION - NO LAYOUT ====== */}
      {/* ============================================ */}
      <Route path="/login" element={<Login />} />

      
      {/* ============================================ */}
      {/* ===== 2. PUBLIC PAGES - WITH LAYOUT ====== */}
      {/* ============================================ */}
      
      {/* Homepage */}
      <Route
        path="/"
        element={
          <WithLayout>
            <Home />
          </WithLayout>
        }
      />

      {/* Events - Public */}
      <Route
        path="/events"
        element={
          <WithLayout>
            <Events />
          </WithLayout>
        }
      />

      {/* Team - Public */}
      <Route
        path="/team"
        element={
          <WithLayout>
            <Team />
          </WithLayout>
        }
      />

      {/* Domains - NEW: Showcase your 4 core domains */}
      <Route
        path="/domains"
        element={
          <WithLayout>
            <Domains />
          </WithLayout>
        }
      />

      {/* Contact - Public */}
      <Route
        path="/contact"
        element={
          <WithLayout>
            <Contact />
          </WithLayout>
        }
      />


      {/* ============================================ */}
      {/* ===== 3. PROTECTED PAGES - LOGIN ONLY ===== */}
      {/* ============================================ */}
      
      {/* Resources - Protected (must be approved) */}
      <Route
        path="/resources"
        element={
          <WithLayout>
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          </WithLayout>
        }
      />

      {/* Resources with Domain Filter - Protected */}
      <Route
        path="/resources/:domain"
        element={
          <WithLayout>
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          </WithLayout>
        }
      />

      {/* Members Directory - Protected (must be approved) */}
      <Route
        path="/members"
        element={
          <WithLayout>
            <ProtectedRoute>
              <Members />
            </ProtectedRoute>
          </WithLayout>
        }
      />


      {/* ============================================ */}
      {/* ===== 4. ADMIN ONLY PAGES ================= */}
      {/* ============================================ */}
      
      {/* Admin Dashboard - Admin Only */}
      <Route
        path="/admin"
        element={
          <WithLayout>
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          </WithLayout>
        }
      />

      {/* Optional: Admin Members Management - if you want separate page */}
      <Route
        path="/admin/members"
        element={
          <WithLayout>
            <ProtectedRoute adminOnly>
              {/* You can create a separate AdminMembers component or use AdminDashboard with tab */}
              <AdminDashboard initialTab="members" />
            </ProtectedRoute>
          </WithLayout>
        }
      />


      {/* ============================================ */}
      {/* ===== 5. FALLBACK ROUTE - 404 ============= */}
      {/* ============================================ */}
      <Route
        path="*"
        element={
          <WithLayout>
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center pt-16">
              <div className="text-center px-4">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 border border-white/10 rounded-full mb-6">
                  <span className="text-4xl">404</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Page Not Found</h1>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Return Home
                </a>
              </div>
            </div>
          </WithLayout>
        }
      />
    </Routes>
  );
}