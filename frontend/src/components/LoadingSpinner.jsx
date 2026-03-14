

export default function LoadingSpinner({ icon, text }) {
  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">{icon || "📚"}</span>
          </div>
        </div>
        <p className="text-gray-400 text-sm">{text || "Loading ..."}</p>
      </div>
    </div>
  );
}