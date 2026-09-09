import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { registerLenis, unregisterLenis } from "../lib/scroll";
import { prefersReducedMotion } from "../lib/revealObserver";

function shouldEnableLenis() {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  return window.matchMedia(
    "(min-width: 768px) and (hover: hover) and (pointer: fine)"
  ).matches;
}

export default function useLenis() {
  useEffect(() => {
    let lenis = null;
    const media = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)"
    );

    const destroyLenis = () => {
      if (!lenis) return;
      lenis.destroy();
      lenis = null;
      unregisterLenis();
      document.documentElement.classList.remove("lenis");
    };

    const initLenis = () => {
      if (!shouldEnableLenis() || lenis) return;

      lenis = new Lenis({
        lerp: 0.16,
        smoothWheel: true,
        autoRaf: true,
        wheelMultiplier: 1,
        anchors: true,
      });

      registerLenis(lenis);
      document.documentElement.classList.add("lenis");
    };

    initLenis();

    const onMediaChange = () => {
      if (shouldEnableLenis()) {
        initLenis();
      } else {
        destroyLenis();
      }
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onMediaChange);
    } else {
      media.addListener(onMediaChange);
    }

    return () => {
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", onMediaChange);
      } else {
        media.removeListener(onMediaChange);
      }
      destroyLenis();
    };
  }, []);
}
