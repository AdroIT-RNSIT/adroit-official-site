import { useEffect, useRef, useState } from "react";

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loader = null;

function loadTurnstile() {
  loader ||= new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve(window.turnstile);
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resolve(window.turnstile);
    s.onerror = () => {
      loader = null;
      reject(new Error("turnstile"));
    };
    document.head.appendChild(s);
  });
  return loader;
}

export default function Turnstile({ siteKey, onToken }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let widget = null;
    let alive = true;
    loadTurnstile()
      .then((ts) => {
        if (!alive || !ref.current) return;
        widget = ts.render(ref.current, {
          sitekey: siteKey,
          theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
          callback: (token) => onToken(token),
          "expired-callback": () => onToken(""),
          "error-callback": () => onToken(""),
        });
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
      if (widget != null) window.turnstile?.remove(widget);
    };
  }, [siteKey, onToken]);

  return (
    <div>
      <div ref={ref} />
      {failed && (
        <p role="alert" className="text-sm text-danger">
          The verification check couldn't load. Disable any content blocker for this page and reload.
        </p>
      )}
    </div>
  );
}
