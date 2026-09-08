import { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { scrollToTop } from "./lib/scroll";

// ===== LAYOUT =====
import MainLayout from "./layout/MainLayout";

// ===== PUBLIC PAGES (No Login Required) =====
import Home from "./pages/Home";
import Events from "./pages/Events";
import Domains from "./pages/Domains";
import Contact from "./pages/Contact";
// ===== PROTECTED PAGES (Login Required + Approval) =====
import Resources from "./pages/Resources";
import Members from "./pages/Members";
import Profile from "./pages/Profile";

// ===== ADMIN ONLY PAGES =====
import AdminDashboard from "./pages/AdminDashboard";

// ===== PROTECTED ROUTE WRAPPER =====
import ProtectedRoute from "./components/ProtectedRoute";

// ===== AI CHATBOT =====
// import ChatBot from "./components/ChatBot";

// Layout wrapper component
function WithLayout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop({ immediate: true });
  }, [pathname]);

  return (
    <>
      <Routes>




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
          path="/resources/:domain?"
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
              <div className="min-h-[70vh] bg-bg-base flex items-center justify-center px-4 py-16">
                <div className="text-center max-w-md">
                  <p className="section-kicker">404</p>
                  <h1 className="section-title">Page Not Found</h1>
                  <p className="text-text-body mb-8">
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/" className="btn btn-primary">
                      Return Home
                    </Link>
                    <Link to="/domains" className="btn btn-secondary">
                      Explore Domains
                    </Link>
                  </div>
                </div>
              </div>
            </WithLayout>
          }
        />
      </Routes>
      {/* <ChatBot /> */}
    </>
  );
}