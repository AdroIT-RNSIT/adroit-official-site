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
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin motion-reduce:animate-none"></div>
          <p className="text-ink-subtle font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  const isAdmin = session.user?.role === "admin";
  const isApproved = session.user?.approved === true;

  // Admins always pass; non-admins need approval
  if (!isAdmin && !isApproved) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/15 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-warning"
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
          <h2 className="ui-heading text-xl font-bold text-ink mb-2">
            Pending Approval
          </h2>
          <p className="text-ink-subtle mb-4">
            Your account is waiting for admin approval. You'll be able to access
            this page once an admin approves your account.
          </p>
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-4">
            <p className="text-warning text-sm font-medium">
              Please contact an admin to get your account approved.
            </p>
            <a
              href="mailto:adroit@example.com"
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-warning/15 hover:bg-warning/25 text-warning font-semibold rounded-lg text-sm transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Admin
            </a>
          </div>
          <p className="text-ink-muted text-xs">
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
