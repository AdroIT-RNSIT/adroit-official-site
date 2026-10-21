
import { BookOpen } from "lucide-react";

export default function LoadingSpinner({ icon: Icon = BookOpen, text }) {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin motion-reduce:animate-none mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon size={20} className="text-primary" strokeWidth={2} />
          </div>
        </div>
        <p className="text-ink-muted text-sm">{text || "Loading ..."}</p>
      </div>
    </div>
  );
}
