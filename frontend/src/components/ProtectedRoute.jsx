import { Navigate } from "react-router-dom";
import { useSession } from "../lib/auth-client";

/**
 * Wraps a route so only authenticated AND approved users can access it.
 * If `adminOnly` is true, also checks for role === "admin".
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = session.user?.role === "admin";
  const isApproved = session.user?.approved === true;

  // Admins always pass; non-admins need approval
  if (!isAdmin && !isApproved) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Pending Approval
          </h2>
          <p className="text-gray-500">
            Your account is waiting for admin approval. You'll be able to access
            this page once an admin approves your account.
          </p>
        </div>
      </div>
    );
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
