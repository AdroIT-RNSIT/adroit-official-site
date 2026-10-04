import { useState } from "react";
import { Check, Share2 } from "lucide-react";

function absoluteUrl(path) {
  return new URL(path, window.location.origin).href;
}

function sharePayload(title, text, url) {
  const withAll = { title, text, url };
  const withUrl = { title, url };
  const textOnly = { title, text: text ? `${text}\n${url}` : url };
  const candidates = [withAll, withUrl, textOnly, { url }];
  if (!navigator.canShare) return withUrl;
  return candidates.find((data) => navigator.canShare(data)) || { url };
}

function copyText(value) {
  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("contenteditable", "true");
  field.style.position = "fixed";
  field.style.top = "0";
  field.style.left = "0";
  field.style.width = "2em";
  field.style.height = "2em";
  field.style.padding = "0";
  field.style.border = "none";
  field.style.outline = "none";
  field.style.boxShadow = "none";
  field.style.background = "transparent";
  field.style.fontSize = "16px";
  document.body.appendChild(field);
  field.focus();
  field.select();
  try {
    field.setSelectionRange(0, field.value.length);
  } catch {
    /* iOS can reject setSelectionRange on some fields */
  }
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  field.remove();
  return ok;
}

export default function ShareEventButton({ title, text, path, tone = "light", className = "" }) {
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");

  const markCopied = () => {
    setCopied(true);
    setLink("");
    window.setTimeout(() => setCopied(false), 2000);
  };

  const onShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = absoluteUrl(path);
    const message = text ? `${text}\n${url}` : url;

    if (typeof navigator.share === "function") {
      try {
        Promise.resolve(navigator.share(sharePayload(title, text, url))).then(() => {
          setLink("");
        }).catch((err) => {
          if (err?.name === "AbortError") return;
          if (copyText(message)) markCopied();
          else setLink(url);
        });
        return;
      } catch {
        if (copyText(message)) {
          markCopied();
          return;
        }
      }
    }

    if (copyText(message)) {
      markCopied();
      return;
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(message).then(markCopied).catch(() => setLink(url));
      return;
    }
    setLink(url);
  };

  const toneClass =
    tone === "dark"
      ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
      : "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-sky-600/40 hover:text-sky-800 dark:border-white/10 dark:bg-[#111111] dark:text-slate-100";

  return (
    <span className={`inline-flex max-w-full flex-col items-stretch gap-1 ${className}`}>
      <button
        type="button"
        onClick={onShare}
        className={`inline-flex touch-manipulation items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:px-3.5 sm:text-sm ${toneClass}`}
      >
        {copied ? <Check size={15} /> : <Share2 size={15} />}
        {copied ? "Link copied" : "Share"}
      </button>
      {link && (
        <input
          readOnly
          value={link}
          onClick={(e) => {
            e.stopPropagation();
            e.currentTarget.select();
          }}
          className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700"
          aria-label="Event link"
        />
      )}
    </span>
  );
}
