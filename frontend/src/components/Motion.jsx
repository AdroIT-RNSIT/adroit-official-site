import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Global motion layer: scroll progress, scroll-reveal with stagger, card tilt-free hover polish.
// Intentionally skips the Home hero (initialisation animation) and elements managing their own reveal.
export default function Motion() {
  const { pathname } = useLocation();

  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - innerHeight;
        if (bar) bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    const seen = new WeakSet();
    const scan = () => {
      const main = document.querySelector("main");
      if (!main) return;
      const hero = pathname === "/" ? main.querySelector("section") : null;
      main.querySelectorAll("section, section h2, section h3, section p, section article, section li, section img, section form, section [class*='rounded-2xl'], section [class*='rounded-xl'], section [class*='rounded-3xl']").forEach((el) => {
        if (seen.has(el) || el.closest(".no-rv") || el.closest("[class*='animate-marquee']") || el.closest("[data-registration-scroll]")) return;
        if (hero && (el === hero || hero.contains(el))) return;
        if (/\bopacity-0\b/.test(el.className?.toString?.() || "") ) return;
        if (el.querySelector(":scope > section")) return;
        seen.add(el);
        const sib = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
        el.style.setProperty("--rv-d", `${Math.min(sib, 6) * 70}ms`);
        el.classList.add("rv");
        io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(() => scan());
    mo.observe(document.querySelector("main") || document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);

  return <div id="scroll-progress" aria-hidden="true" />;
}
