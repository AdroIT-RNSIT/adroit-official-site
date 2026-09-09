import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { prefersReducedMotion } from "../lib/revealObserver";
import {
  addNetworkRipple,
  canUseNetworkPointer,
  setNetworkPointer,
  setNetworkPointerHover,
} from "../lib/networkPointer";

export default function NetworkCursor() {
  const [active, setActive] = useState(false);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const targetRef = useRef({ x: -9999, y: -9999 });
  const posRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (!canUseNetworkPointer() || prefersReducedMotion()) return undefined;

    setActive(true);
    const root = document.documentElement;
    root.classList.add("site-network-cursor");

    const onMove = (event) => {
      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;
      setNetworkPointer(event.clientX, event.clientY, true);

      const interactive = event.target.closest(
        "a, button, [role='button'], input, textarea, select, label, summary"
      );
      const isInteractive = Boolean(interactive);
      setNetworkPointerHover(isInteractive);
      ringRef.current?.classList.toggle("network-cursor__ring--hover", isInteractive);
    };

    const onLeave = () => {
      setNetworkPointer(-9999, -9999, false);
      setNetworkPointerHover(false);
      ringRef.current?.classList.remove("network-cursor__ring--hover");
    };

    const onClick = (event) => {
      addNetworkRipple(event.clientX, event.clientY);
    };

    const render = () => {
      const pos = posRef.current;
      const target = targetRef.current;
      const cursor = cursorRef.current;

      pos.x += (target.x - pos.x) * 0.72;
      pos.y += (target.y - pos.y) * 0.72;

      if (cursor) {
        cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }

      rafRef.current = window.requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("click", onClick);
    rafRef.current = window.requestAnimationFrame(render);

    return () => {
      root.classList.remove("site-network-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("click", onClick);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      setNetworkPointer(-9999, -9999, false);
      setNetworkPointerHover(false);
      setActive(false);
    };
  }, []);

  if (!active) {
    return null;
  }

  return createPortal(
    <div ref={cursorRef} className="network-cursor" aria-hidden="true">
      <span ref={ringRef} className="network-cursor__ring" />
      <span className="network-cursor__cross network-cursor__cross--h" />
      <span className="network-cursor__cross network-cursor__cross--v" />
      <span className="network-cursor__dot" />
    </div>,
    document.body
  );
}
