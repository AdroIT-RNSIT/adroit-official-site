import { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

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
import Profile from "./pages/Profile";

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

      {/* Team - Public Showcase (Leadership, Domain Heads, Operations, Senior Core) */}
      <Route
        path="/team"
        element={
          <WithLayout>
            <Team />
          </WithLayout>
        }
      />

      {/* Domains - 4 Core Domains Showcase */}
      <Route
        path="/domains"
        element={
          <WithLayout>
            <Domains />
          </WithLayout>
        }
      />

      {/* Contact - Public Contact Form */}
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
      
      {/* Resources - Learning Hub (Protected) */}
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

      {/* Members Directory - Complete Club Roster (Protected) */}
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

      {/* Profile Page - User Account Management (Protected) */}
      <Route
        path="/profile"
        element={
          <WithLayout>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </WithLayout>
        }
      />
      

      {/* ============================================ */}
      {/* ===== 4. ADMIN ONLY PAGES ================= */}
      {/* ============================================ */}
      
      {/* Admin Dashboard - Full Control Panel */}
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

      {/* Admin Dashboard - Members Management Tab */}
      <Route
        path="/admin/members"
        element={
          <WithLayout>
            <ProtectedRoute adminOnly>
              <AdminDashboard initialTab="members" />
            </ProtectedRoute>
          </WithLayout>
        }
      />

      {/* Admin Dashboard - Resources Management Tab */}
      <Route
        path="/admin/resources"
        element={
          <WithLayout>
            <ProtectedRoute adminOnly>
              <AdminDashboard initialTab="resources" />
            </ProtectedRoute>
          </WithLayout>
        }
      />

      {/* Admin Dashboard - Events Management Tab */}
      <Route
        path="/admin/events"
        element={
          <WithLayout>
            <ProtectedRoute adminOnly>
              <AdminDashboard initialTab="events" />
            </ProtectedRoute>
          </WithLayout>
        }
      />

      {/* Admin Dashboard - Users Management Tab */}
      <Route
        path="/admin/users"
        element={
          <WithLayout>
            <ProtectedRoute adminOnly>
              <AdminDashboard initialTab="users" />
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
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center pt-16 px-4">
              <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 border border-white/10 rounded-full mb-6">
                  <span className="text-4xl font-bold text-gray-400">404</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Page Not Found
                </h1>
                
                <p className="text-gray-400 mb-8">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Return Home
                  </Link>
                  
                  <Link
                    to="/domains"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Explore Domains
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </WithLayout>
        }
      />
    </Routes>
  );
}