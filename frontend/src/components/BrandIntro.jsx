import { useCallback, useEffect, useRef, useState } from "react";
import { consumeIntro, shouldPlayIntro } from "../lib/brandIntro";

const REVEAL_START_MS = 200;
const REVEAL_DURATION_MS = 2500;
const TAG_PAUSE_MS = 50;
const TAG_START_MS = REVEAL_START_MS + REVEAL_DURATION_MS + TAG_PAUSE_MS;
const TAG_DURATION_MS = 250;
const BRAND_HOLD_MS = 600;
const EXIT_START_MS = TAG_START_MS + TAG_DURATION_MS + BRAND_HOLD_MS;
const PAGE_REVEAL_MS = 2000;
const FALLBACK_MS = EXIT_START_MS + PAGE_REVEAL_MS + 500;

const INTRO_ACTIVE_CLASS = "brand-intro-active";
const INTRO_EXIT_CLASS = "brand-intro-exit";

function clearIntroClasses() {
  document.documentElement.classList.remove(INTRO_ACTIVE_CLASS, INTRO_EXIT_CLASS);
}

function getInitialPhase() {
  if (typeof window === "undefined") return null;
  return shouldPlayIntro() ? "idle" : null;
}

export default function BrandIntro() {
  const [phase, setPhase] = useState(getInitialPhase);
  const finishedRef = useRef(false);
  const overlayRef = useRef(null);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearIntroClasses();
    setPhase(null);
  }, []);

  useEffect(() => {
    if (!shouldPlayIntro()) {
      return undefined;
    }

    consumeIntro();
    document.documentElement.classList.add(INTRO_ACTIVE_CLASS);

    const revealTimer = window.setTimeout(() => setPhase("reveal"), REVEAL_START_MS);
    const tagTimer = window.setTimeout(() => setPhase("tag"), TAG_START_MS);
    const exitTimer = window.setTimeout(() => setPhase("exit"), EXIT_START_MS);
    const fallbackTimer = window.setTimeout(finish, FALLBACK_MS);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(tagTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(fallbackTimer);
      clearIntroClasses();
    };
  }, [finish]);

  useEffect(() => {
    if (phase !== "exit") return undefined;

    document.documentElement.classList.add(INTRO_EXIT_CLASS);

    const el = overlayRef.current;
    const exitFallback = window.setTimeout(finish, PAGE_REVEAL_MS + 100);

    const onTransitionEnd = (event) => {
      if (event.target !== el || event.propertyName !== "opacity") return;
      window.clearTimeout(exitFallback);
      finish();
    };

    el?.addEventListener("transitionend", onTransitionEnd);

    return () => {
      window.clearTimeout(exitFallback);
      el?.removeEventListener("transitionend", onTransitionEnd);
    };
  }, [phase, finish]);

  if (phase === null) {
    return null;
  }

  const phaseClass =
    phase === "reveal" || phase === "tag" || phase === "exit"
      ? `brand-intro--phase-${phase}`
      : "";

  return (
    <div
      ref={overlayRef}
      className={`brand-intro ${phaseClass}`}
      aria-hidden="true"
      data-phase={phase}
    >
      <div className="brand-intro__ui" aria-hidden="true">
        <div className="brand-intro__grid" />
        <svg
          className="brand-intro__ui-piece brand-intro__ui-network"
          viewBox="0 0 420 72"
          fill="none"
          aria-hidden="true"
        >
          <path
            className="brand-intro__ui-network-line"
            d="M16 36 H120 V18 H300 V36 H404"
            pathLength="1"
          />
          <path
            className="brand-intro__ui-network-line brand-intro__ui-network-line--branch"
            d="M120 36 V54 H180"
            pathLength="1"
          />
          <circle className="brand-intro__ui-network-node" cx="16" cy="36" r="2.5" />
          <circle className="brand-intro__ui-network-node" cx="120" cy="36" r="2.5" />
          <circle className="brand-intro__ui-network-node" cx="300" cy="18" r="2.5" />
          <circle className="brand-intro__ui-network-node" cx="404" cy="36" r="2.5" />
          <circle className="brand-intro__ui-network-node" cx="180" cy="54" r="2" />
        </svg>
        <span className="brand-intro__ui-piece brand-intro__ui-label brand-intro__ui-label--tl">
          SYS/02
        </span>
        <span className="brand-intro__ui-piece brand-intro__ui-label brand-intro__ui-label--tr">
          STATUS // STBY
        </span>
        <span className="brand-intro__ui-piece brand-intro__ui-coord brand-intro__ui-coord--bl">
          12.971°E
        </span>
        <span className="brand-intro__ui-piece brand-intro__ui-readout brand-intro__ui-readout--br">
          [ADRO::CORE]
        </span>
        <span className="brand-intro__ui-piece brand-intro__ui-index brand-intro__ui-index--br">
          01
        </span>
        <span className="brand-intro__ui-piece brand-intro__ui-vreadout brand-intro__ui-vreadout--right">
          <span>AX-01</span>
          <span>37.4°N</span>
        </span>
        <span className="brand-intro__ui-piece brand-intro__ui-node brand-intro__ui-node--tl" />
        <span className="brand-intro__ui-piece brand-intro__ui-node brand-intro__ui-node--tl-dot" />
        <span className="brand-intro__ui-piece brand-intro__ui-node brand-intro__ui-node--tr" />
        <span className="brand-intro__ui-piece brand-intro__ui-node brand-intro__ui-node--bl" />
        <span className="brand-intro__ui-piece brand-intro__ui-node brand-intro__ui-node--bc" />
        <span className="brand-intro__ui-piece brand-intro__ui-frame brand-intro__ui-frame--left" />
        <span className="brand-intro__ui-piece brand-intro__ui-frame brand-intro__ui-frame--right" />
        <span className="brand-intro__ui-piece brand-intro__ui-ring" />
        <span className="brand-intro__ui-piece brand-intro__ui-status">
          <span className="brand-intro__ui-status-dot" />
          LINK
        </span>
        <svg
          className="brand-intro__ui-piece brand-intro__ui-svg brand-intro__ui-svg--top"
          viewBox="0 0 200 24"
          fill="none"
          aria-hidden="true"
        >
          <line
            className="brand-intro__ui-stroke"
            x1="0"
            y1="12"
            x2="200"
            y2="12"
            pathLength="1"
          />
        </svg>
        <svg
          className="brand-intro__ui-piece brand-intro__ui-svg brand-intro__ui-svg--bottom"
          viewBox="0 0 160 24"
          fill="none"
          aria-hidden="true"
        >
          <line
            className="brand-intro__ui-stroke"
            x1="0"
            y1="12"
            x2="160"
            y2="12"
            pathLength="1"
          />
        </svg>
        <span className="brand-intro__ui-piece brand-intro__ui-scan" />
      </div>
      <div className="brand-intro__inner">
        <div className="brand-intro__wordmark-wrap">
          <span className="brand-intro__wordmark">AdroIT</span>
        </div>
        <p className="brand-intro__tag">RNSIT Technical Club</p>
      </div>
    </div>
  );
}
