import { useEffect, useRef } from "react";
import { useTheme } from "../lib/theme";

const CELL = 28;
const WAVE = 220;
const AMP = 2.4;
const STEP = 18;

function sway(along, seed) {
  return Math.sin(along / WAVE + seed) * AMP;
}

export default function InteractiveGrid() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const pointer = { x: -9999, y: -9999, active: false };
    let frame = 0;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const line = isDark ? "rgba(186, 214, 232, 0.22)" : "rgba(71, 85, 105, 0.28)";
      ctx.strokeStyle = line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const startX = -(scrollX % CELL);
      const startY = -(scrollY % CELL);
      for (let x = startX; x <= w + CELL; x += CELL) {
        const seed = Math.round((x + scrollX) / CELL) * 0.85;
        ctx.moveTo(x + sway(scrollY, seed), 0);
        for (let y = STEP; y <= h + STEP; y += STEP) {
          ctx.lineTo(x + sway(y + scrollY, seed), Math.min(y, h));
        }
      }
      for (let y = startY; y <= h + CELL; y += CELL) {
        const seed = Math.round((y + scrollY) / CELL) * 1.15;
        ctx.moveTo(0, y + sway(scrollX, seed));
        for (let x = STEP; x <= w + STEP; x += STEP) {
          ctx.lineTo(Math.min(x, w), y + sway(x + scrollX, seed));
        }
      }
      ctx.stroke();

      if (!pointer.active) return;
      const pageX = pointer.x + scrollX;
      const pageY = pointer.y + scrollY;
      const col = Math.floor(pageX / CELL);
      const row = Math.floor(pageY / CELL);

      for (let dy = -2; dy <= 2; dy += 1) {
        for (let dx = -2; dx <= 2; dx += 1) {
          const dist = Math.hypot(dx, dy);
          if (dist > 2.4) continue;
          const vx = (col + dx) * CELL - scrollX;
          const vy = (row + dy) * CELL - scrollY;
          const strength = dx === 0 && dy === 0 ? 1 : 0.45 / dist;
          ctx.fillStyle = isDark
            ? `rgba(125, 211, 252, ${0.14 * strength})`
            : `rgba(2, 132, 199, ${0.12 * strength})`;
          ctx.fillRect(vx, vy, CELL, CELL);
        }
      }

      const vx = col * CELL - scrollX;
      const vy = row * CELL - scrollY;
      ctx.strokeStyle = isDark ? "rgba(125, 211, 252, 0.55)" : "rgba(2, 132, 199, 0.4)";
      ctx.strokeRect(vx + 0.5, vy + 0.5, CELL - 1, CELL - 1);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };

    const onPointer = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      schedule();
    };

    const onLeave = () => {
      pointer.active = false;
      schedule();
    };

    schedule();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-dvh w-full"
    />
  );
}
