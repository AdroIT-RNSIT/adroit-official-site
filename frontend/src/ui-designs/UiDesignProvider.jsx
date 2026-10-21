import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  clearPreviewDesign,
  getDesign,
  isValidDesign,
  loadDesignCss,
  readPreviewDesign,
  readStoredDesign,
  UI_DESIGN_KEY,
} from "./registry";
import { UiDesignContext } from "./useUiDesign";

function PreviewBadge({ id, onExit }) {
  return (
    <div
      data-part="preview-badge"
      role="status"
      className="ui-card fixed left-4 z-[70] inline-flex items-center gap-1 rounded-full py-1 pl-4 pr-1 text-sm text-ink bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))+4.5rem)] lg:bottom-4"
    >
      <span>
        Previewing: <strong className="font-semibold">{getDesign(id)?.label || id}</strong>
      </span>
      <a
        href={window.location.pathname}
        onClick={(e) => {
          e.preventDefault();
          onExit();
        }}
        className="inline-flex min-h-10 items-center rounded-full px-3 font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Exit
      </a>
    </div>
  );
}

export function UiDesignProvider({ children }) {
  const [design, setDesignState] = useState(readStoredDesign);
  const [preview, setPreview] = useState(readPreviewDesign);
  const [loaded, setLoaded] = useState(null);
  const designRef = useRef(design);
  const active = preview || design;
  const loading = loaded !== active;

  useEffect(() => {
    designRef.current = design;
  }, [design]);

  useEffect(() => {
    let cancelled = false;
    loadDesignCss(active)
      .then(() => {
        if (cancelled || document.documentElement.dataset.uiLock) return;
        document.documentElement.dataset.ui = active;
        if (preview) return;
        try {
          localStorage.setItem(UI_DESIGN_KEY, active);
        } catch {
          /* ignore */
        }
      })
      .finally(() => {
        if (!cancelled) setLoaded(active);
      });
    return () => {
      cancelled = true;
    };
  }, [active, preview]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ui-design")
      .then((res) => (res.ok ? res.json() : null))
      .then(async (data) => {
        const next = data?.design;
        if (cancelled || !isValidDesign(next) || next === designRef.current) return;
        await loadDesignCss(next);
        if (cancelled) return;
        setDesignState(next);
      })
      .catch(() => {
        /* keep the cached or default design */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setDesign = useCallback((id) => {
    if (!isValidDesign(id)) return;
    setDesignState(id);
  }, []);

  const exitPreview = useCallback(() => {
    clearPreviewDesign();
    setPreview(null);
  }, []);

  const value = useMemo(
    () => ({ design: active, setDesign, loading, preview }),
    [active, setDesign, loading, preview],
  );

  return (
    <UiDesignContext.Provider value={value}>
      {children}
      {preview && <PreviewBadge id={preview} onExit={exitPreview} />}
    </UiDesignContext.Provider>
  );
}
