import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/revealObserver";
import {
  canUseNetworkPointer,
  getNetworkPointer,
  getPointerRadius,
  getRippleDurationMs,
  pruneNetworkRipples,
} from "../lib/networkPointer";

const FRAME_MS = 16;
const DPR_CAP = 2;
const INDIGO = "79, 70, 229";
const SLATE = "148, 163, 184";
const CONNECTION_NEIGHBORS = 3;

function getNodeCount(width) {
  if (width >= 1024) return 58 + Math.floor(Math.random() * 14);
  if (width >= 768) return 38 + Math.floor(Math.random() * 10);
  return 22 + Math.floor(Math.random() * 8);
}

function createNodes(count, width, height) {
  const nodes = [];
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.14 + Math.random() * 0.32;
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1.4 + Math.random() * 1.4,
      indigo: Math.random() > 0.32,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.002 + Math.random() * 0.0035,
      orbitAngle: Math.random() * Math.PI * 2,
      orbitSpeed: 0.018 + Math.random() * 0.028,
      orbitDrift: 0.1 + Math.random() * 0.16,
      highlight: Math.random() > 0.88,
      interact: 0,
    });
  }
  return nodes;
}

function applyPointerInfluence(nodes, px, py, width, height) {
  const radius = getPointerRadius();
  const radiusSq = radius * radius;

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    node.interact *= 0.88;

    if (px < -20 || py < -20 || px > width + 20 || py > height + 20) {
      continue;
    }

    const dx = node.x - px;
    const dy = node.y - py;
    const distSq = dx * dx + dy * dy;
    if (distSq > radiusSq) continue;

    const dist = Math.sqrt(distSq) || 0.001;
    const t = 1 - dist / radius;
    const force = t * t * 0.5;

    node.x += (dx / dist) * force;
    node.y += (dy / dist) * force;
    node.interact = Math.max(node.interact, t);
  }
}

function updateNodes(nodes, width, height) {
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    node.orbitAngle += node.orbitSpeed;
    node.x +=
      node.vx + Math.cos(node.orbitAngle) * node.orbitDrift;
    node.y +=
      node.vy + Math.sin(node.orbitAngle * 0.85) * node.orbitDrift;

    if (node.x < 0) node.x += width;
    if (node.x >= width) node.x -= width;
    if (node.y < 0) node.y += height;
    if (node.y >= height) node.y -= height;
  }
}

function drawScanLine(ctx, width, height, time) {
  const scanY = (time * 0.065) % (height + 80) - 40;
  const gradient = ctx.createLinearGradient(0, scanY - 18, 0, scanY + 18);
  gradient.addColorStop(0, `rgba(${INDIGO}, 0)`);
  gradient.addColorStop(0.5, `rgba(${INDIGO}, 0.07)`);
  gradient.addColorStop(1, `rgba(${INDIGO}, 0)`);

  ctx.save();
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, scanY);
  ctx.lineTo(width, scanY);
  ctx.stroke();
  ctx.restore();
}

function drawSignal(ctx, nodes, signal, time) {
  if (!signal) return;

  const from = nodes[signal.from];
  const to = nodes[signal.to];
  if (!from || !to) return;

  signal.progress += 0.014;
  if (signal.progress >= 1) {
    signal.progress = 0;
    let from = Math.floor(Math.random() * nodes.length);
    let to = Math.floor(Math.random() * nodes.length);
    if (from === to) to = (to + 1) % nodes.length;
    signal.from = from;
    signal.to = to;
  }

  const t = signal.progress;
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t;
  const pulse = 0.55 + 0.45 * Math.sin(time * 0.006);

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, 2.2 * pulse, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${INDIGO}, ${0.22 * pulse})`;
  ctx.fill();

  ctx.strokeStyle = `rgba(${INDIGO}, ${0.16 * (1 - Math.abs(t - 0.5) * 2)})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.restore();
}

function drawConnections(ctx, nodes, width, height, time) {
  const maxDist = Math.min(width, height) * 0.24;
  const maxDistSq = maxDist * maxDist;

  ctx.lineWidth = 1;

  for (let i = 0; i < nodes.length; i += 1) {
    const nearest = [];
    for (let j = 0; j < nodes.length; j += 1) {
      if (i === j) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distSq = dx * dx + dy * dy;
      if (distSq <= maxDistSq) {
        nearest.push({ j, distSq });
      }
    }

    nearest.sort((a, b) => a.distSq - b.distSq);
    const limit = Math.min(CONNECTION_NEIGHBORS, nearest.length);

    for (let k = 0; k < limit; k += 1) {
      const { j, distSq } = nearest[k];
      if (j < i) continue;

      const dist = Math.sqrt(distSq);
      const fade = 1 - dist / maxDist;
      const pulse =
        0.5 +
        0.5 *
          Math.sin(
            time * nodes[i].pulseSpeed +
              nodes[j].phase +
              dist * 0.02
          );
      const interactBoost = Math.max(nodes[i].interact || 0, nodes[j].interact || 0);
      const alpha = 0.06 + fade * 0.18 * pulse + interactBoost * 0.14;

      ctx.strokeStyle = `rgba(${INDIGO}, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[j].x, nodes[j].y);
      ctx.stroke();
    }
  }
}

function drawNodes(ctx, nodes, time) {
  for (let n = 0; n < nodes.length; n += 1) {
    const node = nodes[n];
    const pulse =
      0.55 + 0.45 * Math.sin(time * node.pulseSpeed + node.phase);
    const interact = node.interact || 0;
    const radius = node.radius * (0.88 + pulse * 0.35 + interact * 0.25);
    const baseAlpha = node.indigo ? 0.48 : 0.34;
    const alpha = node.highlight
      ? baseAlpha + pulse * 0.28 + interact * 0.32
      : baseAlpha + pulse * 0.14 + interact * 0.28;

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = node.indigo
      ? `rgba(${INDIGO}, ${alpha})`
      : `rgba(${SLATE}, ${alpha * 0.85})`;
    ctx.fill();
  }
}

function drawPointerRipples(ctx, ripples, rect) {
  const duration = getRippleDurationMs();
  const now = performance.now();

  for (let r = 0; r < ripples.length; r += 1) {
    const ripple = ripples[r];
    const age = now - ripple.start;
    if (age < 0 || age > duration) continue;

    const lx = ripple.x - rect.left;
    const ly = ripple.y - rect.top;
    const progress = age / duration;
    const radius = 12 + progress * 130;
    const alpha = 0.22 * (1 - progress);

    ctx.save();
    ctx.strokeStyle = `rgba(${INDIGO}, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(lx, ly, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawFrame(ctx, nodes, width, height, time, signal, pointer, containerRect) {
  ctx.clearRect(0, 0, width, height);

  drawScanLine(ctx, width, height, time);

  if (pointer.active && canUseNetworkPointer()) {
    drawPointerRipples(ctx, pointer.ripples, containerRect);
  }

  drawConnections(ctx, nodes, width, height, time);
  drawSignal(ctx, nodes, signal, time);
  drawNodes(ctx, nodes, time);
}

export default function DotFieldCanvas({ className = "", variant = "hero" }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const reduced = prefersReducedMotion();
    const pointerEnabled = canUseNetworkPointer();
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    const state = {
      nodes: [],
      width: 0,
      height: 0,
      rafId: null,
      lastFrame: 0,
      time: 0,
      running: false,
      inView: true,
      tabVisible: document.visibilityState === "visible",
      signal: null,
    };

    const setup = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nodes = createNodes(getNodeCount(width), width, height);
      state.nodes = nodes;
      state.width = width;
      state.height = height;
      state.time = 0;
      const pickSignalPair = () => {
        let from = Math.floor(Math.random() * nodes.length);
        let to = Math.floor(Math.random() * nodes.length);
        if (from === to) to = (to + 1) % nodes.length;
        return { from, to, progress: Math.random() };
      };
      state.signal = pickSignalPair();

      const pointer = getNetworkPointer();
      drawFrame(
        ctx,
        nodes,
        width,
        height,
        0,
        state.signal,
        pointer,
        container.getBoundingClientRect()
      );
    };

    const tick = (now) => {
      if (!state.running) return;

      state.rafId = window.requestAnimationFrame(tick);

      if (!state.inView || !state.tabVisible) return;
      if (now - state.lastFrame < FRAME_MS) return;

      const delta = state.lastFrame ? now - state.lastFrame : FRAME_MS;
      state.lastFrame = now;
      state.time += delta;
      pruneNetworkRipples(performance.now());

      const pointer = getNetworkPointer();
      const containerRect = container.getBoundingClientRect();

      if (pointerEnabled && pointer.active) {
        applyPointerInfluence(
          state.nodes,
          pointer.x - containerRect.left,
          pointer.y - containerRect.top,
          state.width,
          state.height
        );
      }

      updateNodes(state.nodes, state.width, state.height);
      drawFrame(
        ctx,
        state.nodes,
        state.width,
        state.height,
        state.time,
        state.signal,
        pointer,
        containerRect
      );
    };

    const startLoop = () => {
      if (reduced || state.running) return;
      state.running = true;
      state.lastFrame = 0;
      state.rafId = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      state.running = false;
      if (state.rafId !== null) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
    };

    const syncLoop = () => {
      if (reduced) return;
      if (state.inView && state.tabVisible) startLoop();
      else stopLoop();
    };

    setup();
    if (!reduced) syncLoop();

    let resizeTimer = null;
    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        stopLoop();
        setup();
        syncLoop();
      }, 150);
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        state.inView = entries[0]?.isIntersecting ?? false;
        syncLoop();
      },
      { root: null, rootMargin: "80px 0px", threshold: 0 }
    );
    intersectionObserver.observe(container);

    const onVisibilityChange = () => {
      state.tabVisible = document.visibilityState === "visible";
      syncLoop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  const variantClass =
    variant === "philosophy"
      ? "dot-field-wrap--philosophy"
      : variant === "global"
        ? "dot-field-wrap--global"
        : "dot-field-wrap--hero";

  return (
    <div
      ref={containerRef}
      className={`dot-field-wrap ${variantClass} absolute inset-0 ${className}`.trim()}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="dot-field-canvas pointer-events-none block h-full w-full"
      />
    </div>
  );
}
