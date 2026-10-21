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

export default function ShareEventButton({ title, text, path, className = "" }) {
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

  return (
    <span className={`inline-flex max-w-full flex-col items-stretch gap-1 ${className}`}>
      <button
        type="button"
        onClick={onShare}
        data-part="share"
        className="ui-pill inline-flex min-h-10 touch-manipulation items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink transition-colors sm:px-3.5 sm:text-sm"
      >
        {copied ? <Check size={15} /> : <Share2 size={15} />}
        {copied ? "Link copied" : "Share"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
      {link && (
        <input
          readOnly
          value={link}
          onClick={(e) => {
            e.stopPropagation();
            e.currentTarget.select();
          }}
          data-part="share-link"
          className="ui-input w-full min-w-0 rounded-lg px-2 py-1 text-[11px] text-ink"
          aria-label="Event link"
        />
      )}
    </span>
  );
}
