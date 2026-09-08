let lenisInstance = null;

export function registerLenis(instance) {
  lenisInstance = instance;
}

export function unregisterLenis() {
  lenisInstance = null;
}

export function getLenis() {
  return lenisInstance;
}

export function scrollToTop({ immediate = true } = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate });
    return;
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: immediate ? "auto" : "smooth",
  });
}

export function stopLenis() {
  lenisInstance?.stop();
}

export function startLenis() {
  lenisInstance?.start();
}
