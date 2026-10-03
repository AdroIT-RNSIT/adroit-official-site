import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export default function ShareEventButton({ title, text, path, tone = "light", className = "" }) {
  const [copied, setCopied] = useState(false);

  const onShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = new URL(path, window.location.origin).href;
    const payload = { title, text: `${text}\n${url}`, url };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link to share", url);
    }
  };

  const toneClass =
    tone === "dark"
      ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
      : "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-sky-600/40 hover:text-sky-800 dark:border-white/10 dark:bg-[#10182a] dark:text-slate-100";

  return (
    <button
      type="button"
      onClick={onShare}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:px-3.5 sm:text-sm ${toneClass} ${className}`}
    >
      {copied ? <Check size={15} /> : <Share2 size={15} />}
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
