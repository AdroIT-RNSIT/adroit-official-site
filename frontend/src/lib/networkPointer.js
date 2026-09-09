const POINTER_RADIUS = 150;
const RIPPLE_DURATION_MS = 550;

const state = {
  x: -9999,
  y: -9999,
  active: false,
  hoverInteractive: false,
  ripples: [],
};

export function getPointerRadius() {
  return POINTER_RADIUS;
}

export function getRippleDurationMs() {
  return RIPPLE_DURATION_MS;
}

export function setNetworkPointer(x, y, active = true) {
  state.x = x;
  state.y = y;
  state.active = active;
}

export function setNetworkPointerHover(isInteractive) {
  state.hoverInteractive = isInteractive;
}

export function addNetworkRipple(x, y) {
  state.ripples.push({ x, y, start: performance.now() });
  if (state.ripples.length > 8) {
    state.ripples.splice(0, state.ripples.length - 8);
  }
}

export function getNetworkPointer() {
  return state;
}

export function pruneNetworkRipples(now) {
  state.ripples = state.ripples.filter(
    (ripple) => now - ripple.start < RIPPLE_DURATION_MS
  );
}

export function canUseNetworkPointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
