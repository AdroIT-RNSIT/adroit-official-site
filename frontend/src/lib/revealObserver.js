const callbacks = new WeakMap();
let observer = null;

const OBSERVER_OPTIONS = { threshold: 0.1, rootMargin: "0px 0px -24px 0px" };

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const cb = callbacks.get(entry.target);
        if (cb) cb();
        observer.unobserve(entry.target);
        callbacks.delete(entry.target);
      });
    }, OBSERVER_OPTIONS);
  }
  return observer;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function observeReveal(el, onVisible) {
  if (!el) return () => {};

  if (prefersReducedMotion()) {
    onVisible();
    return () => {};
  }

  callbacks.set(el, onVisible);
  getObserver().observe(el);

  return () => {
    getObserver().unobserve(el);
    callbacks.delete(el);
  };
}
