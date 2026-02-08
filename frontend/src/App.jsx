import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Members from "./pages/Members";
import Login from "./pages/Login";
import Resources from "./pages/Resources";
import Events from "./pages/Events";
import AdminDashboard from "./pages/AdminDashboard";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function WithLayout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}

export default function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Routes>
      {/* Login — standalone, no layout */}
      <Route path="/login" element={<Login />} />

      {/* Public pages with layout */}
      <Route
        path="/"
        element={
          <WithLayout>
            <Home />
          </WithLayout>
        }
      />
      <Route
        path="/members"
        element={
          <WithLayout>
            <Members />
          </WithLayout>
        }
      />

      {/* Protected: logged-in users */}
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
      <Route
        path="/events"
        element={
          <WithLayout>
            <Events />
          </WithLayout>
        }
      />

      {/* Protected: admin only */}
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
    </Routes>
  );
}
