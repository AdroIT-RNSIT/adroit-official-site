export default function LoadingSpinner({ icon, text }) {
  return (
    <div className="min-h-[60vh] bg-bg-base flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-border-subtle border-t-accent-primary rounded-full animate-spin mx-auto mb-3" />
        {icon ? <p className="text-lg mb-1">{icon}</p> : null}
        <p className="text-sm text-text-body">{text || "Loading ..."}</p>
      </div>
    </div>
  );
}
