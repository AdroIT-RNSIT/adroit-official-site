import { useEffect } from "react";
import { prefersReducedMotion } from "../lib/revealObserver";

const MAX_OFFSET_PX = 40;

function canUseScrollParallax() {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  return true;
}

function cssScrollTimelineSupported() {
  return typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()");
}

function isDesktopViewport() {
  return window.matchMedia("(min-width: 768px)").matches;
}

function isLenisActive() {
  return document.documentElement.classList.contains("lenis");
}

function shouldUseJsParallax() {
  if (!canUseScrollParallax()) return false;
  if (!isDesktopViewport()) return false;
  if (isLenisActive()) return true;
  return !cssScrollTimelineSupported();
}

function getScrollOffset() {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

function computeLayerOffset(el, scrollY) {
  const section = el.closest("section");
  if (!section) return 0;

  const sectionTop = section.offsetTop;
  const sectionHeight = section.offsetHeight || 1;
  const progress = Math.min(
    1,
    Math.max(0, (scrollY - sectionTop + window.innerHeight * 0.25) / sectionHeight)
  );
  const rate = Number.parseFloat(el.dataset.parallaxRate || "0.35");
  return Math.min(MAX_OFFSET_PX, progress * sectionHeight * rate * 0.08);
}

/** Desktop-only JS parallax fallback for [data-parallax] layers. */
export default function useDesktopParallax() {
  useEffect(() => {
    let disposed = false;
    let mountId = null;
    let teardown = () => {};

    const mount = () => {
      teardown();

      if (!shouldUseJsParallax()) {
        return;
      }

      const layers = Array.from(document.querySelectorAll("[data-parallax]"));
      if (!layers.length) return;

      let rafId = null;

      const apply = () => {
        rafId = null;
        const scrollY = getScrollOffset();
        layers.forEach((el) => {
          const offset = computeLayerOffset(el, scrollY);
          el.style.transform = `translate3d(0, ${offset}px, 0)`;
        });
      };

      const onScroll = () => {
        if (rafId !== null) return;
        rafId = window.requestAnimationFrame(apply);
      };

      let resizeTimer = null;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (!shouldUseJsParallax()) {
            layers.forEach((el) => {
              el.style.transform = "";
            });
          } else {
            onScroll();
          }
        }, 150);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      onScroll();

      teardown = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        window.clearTimeout(resizeTimer);
        if (rafId !== null) window.cancelAnimationFrame(rafId);
        layers.forEach((el) => {
          el.style.transform = "";
        });
      };
    };

    mountId = window.requestAnimationFrame(() => {
      if (!disposed) mount();
    });

    return () => {
      disposed = true;
      if (mountId !== null) window.cancelAnimationFrame(mountId);
      teardown();
    };
  }, []);
}
