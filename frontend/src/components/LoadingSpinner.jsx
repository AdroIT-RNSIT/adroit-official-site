
import { BookOpen } from "lucide-react";

export default function LoadingSpinner({ icon: Icon = BookOpen, text }) {
  return (
    <div className="min-h-screen bg-[#f3e8ff] dark:bg-[#080c16] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-sky-600/30 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon size={20} className="text-sky-700" strokeWidth={2} />
          </div>
        </div>
        <p className="text-slate-600 text-sm">{text || "Loading ..."}</p>
      </div>
    </div>
  );
}
