import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

// ===== LAYOUT =====
import MainLayout from "./layout/MainLayout";

// ===== PUBLIC PAGES (No Login Required) =====
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Domains from "./pages/Domains";
import Contact from "./pages/Contact";
import DomainRegister from "./pages/DomainRegister";
// ===== PROTECTED PAGES (Login Required + Approval) =====
import Resources from "./pages/Resources";
import Members from "./pages/Members";
import Profile from "./pages/Profile";

// ===== ADMIN ONLY PAGES =====
import AdminDashboard from "./pages/AdminDashboard";

// ===== PROTECTED ROUTE WRAPPER =====
import ProtectedRoute from "./components/ProtectedRoute";
import IntroSplash from "./components/IntroSplash";

const DevUiKit = import.meta.env.DEV ? lazy(() => import("./pages/dev/UiKit.jsx")) : null;
const Recruitment = lazy(() => import("./pages/Recruitment.jsx"));

// ===== AI CHATBOT =====
// import ChatBot from "./components/ChatBot";

// Layout wrapper component
function WithLayout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <>
      <IntroSplash />
      <Routes>




        <Route path="/login" element={<Navigate to="/" replace />} />

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
        <Route
          path="/events/:slug"
          element={
            <WithLayout>
              <EventDetail />
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

        <Route
          path="/register/:domain"
          element={
            <WithLayout>
              <DomainRegister />
            </WithLayout>
          }
        />

        <Route
          path="/recruitment"
          element={
            <WithLayout>
              <Suspense fallback={<div className="min-h-dvh" aria-busy="true" />}>
                <Recruitment />
              </Suspense>
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
        {/* ===== 3. EXPLORE PAGES - NO LOGIN ======== */}
        {/* ============================================ */}

        {/* Resources - Learning Hub */}
        <Route
          path="/resources/:domain?"
          element={
            <WithLayout>
              <Resources />
            </WithLayout>
          }
        />

        {/* Members Directory - Complete Club Roster */}
        <Route
          path="/members"
          element={
            <WithLayout>
              <Members />
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


        {import.meta.env.DEV && (
          <Route
            path="/dev/ui-kit"
            element={
              <Suspense fallback={null}>
                <DevUiKit />
              </Suspense>
            }
          />
        )}

        {/* ============================================ */}
        {/* ===== 5. FALLBACK ROUTE - 404 ============= */}
        {/* ============================================ */}
        <Route
          path="*"
          element={
            <WithLayout>
              <div className="min-h-dvh bg-page text-ink flex items-center justify-center pt-16 px-4">
                <div className="ui-card text-center w-full max-w-md rounded-3xl p-8 sm:p-10">
                  <div className="ui-well inline-flex items-center justify-center w-24 h-24 rounded-full mb-6">
                    <span className="text-4xl font-bold text-ink-muted">404</span>
                  </div>

                  <h1 className="ui-heading text-3xl md:text-4xl font-bold text-ink mb-4">
                    Page Not Found
                  </h1>

                  <p className="text-ink-muted mb-8">
                    The page you're looking for doesn't exist or has been moved.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/"
                      className="ui-solid inline-flex items-center justify-center gap-2 whitespace-nowrap px-6 py-3 font-semibold rounded-xl"
                    >
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Return Home
                    </Link>

                    <Link
                      to="/domains"
                      className="ui-pill inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap px-6 py-3 text-ink font-semibold rounded-xl"
                    >
                      Explore Domains
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
      {/* <ChatBot /> */}
    </>
  );
}