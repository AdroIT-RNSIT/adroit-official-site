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
    if (!shouldEnableLenis()) return undefined;

    const lenis = new Lenis({
      lerp: 0.16,
      smoothWheel: true,
      autoRaf: true,
      wheelMultiplier: 1,
      anchors: true,
    });

    registerLenis(lenis);
    document.documentElement.classList.add("lenis");

    return () => {
      lenis.destroy();
      unregisterLenis();
      document.documentElement.classList.remove("lenis");
    };
  }, []);
}
