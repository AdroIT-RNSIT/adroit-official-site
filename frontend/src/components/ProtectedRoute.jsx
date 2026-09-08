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
          <div className="w-10 h-10 border-2 border-border-subtle border-t-accent-primary rounded-full animate-spin" />
          <p className="text-text-muted font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = session.user?.role === "admin";
  const isApproved = session.user?.approved === true;

  if (!isAdmin && !isApproved) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Pending Approval
          </h2>
          <p className="text-text-body mb-4">
            Your account is waiting for admin approval. You'll be able to access
            this page once an admin approves your account.
          </p>
          <div className="card p-4 mb-4 text-left">
            <p className="text-text-primary text-sm font-medium">
              Please contact an admin to get your account approved.
            </p>
            <a
              href="mailto:adroit@example.com"
              className="btn btn-secondary mt-3 text-sm"
            >
              Contact Admin
            </a>
          </div>
          <p className="text-text-muted text-xs">
            Already approved? Try refreshing the page.
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
