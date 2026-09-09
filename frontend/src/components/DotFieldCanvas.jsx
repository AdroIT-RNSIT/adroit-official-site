import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/revealObserver";

const FRAME_MS = 33;
const DPR_CAP = 2;
const INDIGO = "79, 70, 229";
const SLATE = "148, 163, 184";

function getNodeCount(width) {
  if (width >= 1024) return 60 + Math.floor(Math.random() * 21);
  if (width >= 768) return 40 + Math.floor(Math.random() * 11);
  return 25 + Math.floor(Math.random() * 11);
}

function createNodes(count, width, height) {
  const nodes = [];
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.05 + Math.random() * 0.1;
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1.5 + Math.random() * 1,
      indigo: Math.random() > 0.35,
    });
  }
  return nodes;
}

function computeConnections(nodes, neighborCount = 3) {
  const connections = [];
  const seen = new Set();

  for (let i = 0; i < nodes.length; i += 1) {
    const nearest = [];
    for (let j = 0; j < nodes.length; j += 1) {
      if (i === j) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      nearest.push({ j, d: dx * dx + dy * dy });
    }
    nearest.sort((a, b) => a.d - b.d);

    for (let k = 0; k < Math.min(neighborCount, nearest.length); k += 1) {
      const j = nearest[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      connections.push([i, j]);
    }
  }

  return connections;
}

function drawFrame(ctx, nodes, connections, width, height) {
  ctx.clearRect(0, 0, width, height);

  ctx.lineWidth = 1;
  for (let c = 0; c < connections.length; c += 1) {
    const [a, b] = connections[c];
    ctx.strokeStyle = `rgba(${INDIGO}, 0.11)`;
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  }

  for (let n = 0; n < nodes.length; n += 1) {
    const node = nodes[n];
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fillStyle = node.indigo
      ? `rgba(${INDIGO}, 0.44)`
      : `rgba(${SLATE}, 0.36)`;
    ctx.fill();
  }
}

function updateNodes(nodes, width, height) {
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < 0) node.x += width;
    if (node.x >= width) node.x -= width;
    if (node.y < 0) node.y += height;
    if (node.y >= height) node.y -= height;
  }
}

export default function DotFieldCanvas({ className = "", variant = "hero" }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const reduced = prefersReducedMotion();
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    const state = {
      nodes: [],
      connections: [],
      width: 0,
      height: 0,
      rafId: null,
      lastFrame: 0,
      running: false,
      inView: true,
      tabVisible: document.visibilityState === "visible",
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
      const connections = computeConnections(nodes);

      state.nodes = nodes;
      state.connections = connections;
      state.width = width;
      state.height = height;

      drawFrame(ctx, nodes, connections, width, height);
    };

    const tick = (now) => {
      if (!state.running) return;

      state.rafId = window.requestAnimationFrame(tick);

      if (!state.inView || !state.tabVisible) return;
      if (now - state.lastFrame < FRAME_MS) return;

      state.lastFrame = now;
      updateNodes(state.nodes, state.width, state.height);
      drawFrame(ctx, state.nodes, state.connections, state.width, state.height);
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
    variant === "philosophy" ? "dot-field-wrap--philosophy" : "dot-field-wrap--hero";

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
