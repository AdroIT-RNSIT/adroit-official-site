import { prefersReducedMotion } from "./revealObserver";

/** Captured once per document load — true only if the browser opened/reloaded on Home. */
const LANDED_ON_HOME_AT_LOAD =
  typeof window !== "undefined" && window.location.pathname === "/";

let introConsumedThisDocument = false;

export function shouldPlayIntro() {
  if (prefersReducedMotion()) return false;
  if (!LANDED_ON_HOME_AT_LOAD) return false;
  if (introConsumedThisDocument) return false;
  return true;
}

export function consumeIntro() {
  introConsumedThisDocument = true;
}
