import { useEffect, useRef } from "react";
import * as THREE from "three";

export const ACCENTS = ["#34d399", "#818cf8", "#38bdf8", "#fb7185", "#fbbf24"];
export const AUTO_MS = 6000;
const N_DESKTOP = 4200;
const N_PHONE = 5200;

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildFormations(N) {
  const rnd = mulberry32(7);
  const jz = (s) => (rnd() - 0.5) * s;
  const make = (fn) => {
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i += 1) {
      const [x, y, z] = fn();
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  };

  const hs = [1.2, 1.9, 1.5, 2.6, 2.2, 3.1, 2.5, 3.5, 2.9, 3.8, 3.2, 4.1];
  const total = hs.reduce((a, b) => a + b, 0);
  const bars = make(() => {
    if (rnd() < 0.08) return [(rnd() - 0.5) * 7.6, -2, jz(0.4)];
    let r = rnd() * total;
    let i = 0;
    while (i < hs.length - 1 && r > hs[i]) {
      r -= hs[i];
      i += 1;
    }
    return [-3.3 + i * 0.6 + (rnd() - 0.5) * 0.4, -2 + rnd() * hs[i], jz(0.5)];
  });

  const blobs = [
    [-2.0, -0.1, 0.9],
    [-1.0, 0.6, 1.1],
    [0.2, 0.9, 1.3],
    [1.4, 0.4, 1.0],
    [2.1, -0.2, 0.8],
    [0.3, -0.2, 1.0],
  ];
  const cloud = make(() => {
    if (rnd() < 0.18) {
      const col = Math.floor(rnd() * 9);
      return [-2.4 + col * 0.6, -2.1 + rnd() * 1.1, jz(0.3)];
    }
    const [cx, cy, r] = blobs[Math.floor(rnd() * blobs.length)];
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * r;
    let y = cy + Math.sin(a) * d + 0.4;
    if (y < -0.5) y = -0.5 + rnd() * 0.05;
    return [cx + Math.cos(a) * d, y, jz(1.0)];
  });

  const layers = [4, 6, 6, 3];
  const xs = [-3.2, -1.1, 1.1, 3.2];
  const nodes = layers.map((n, l) =>
    Array.from({ length: n }, (_, k) => [xs[l], (k - (n - 1) / 2) * (3.6 / Math.max(n - 1, 1))]),
  );
  const net = make(() => {
    if (rnd() < 0.3) {
      const l = Math.floor(rnd() * layers.length);
      const [nx, ny] = nodes[l][Math.floor(rnd() * nodes[l].length)];
      return [nx + (rnd() + rnd() - 1) * 0.16, ny + (rnd() + rnd() - 1) * 0.16, jz(0.3)];
    }
    const l = Math.floor(rnd() * (layers.length - 1));
    const a = nodes[l][Math.floor(rnd() * nodes[l].length)];
    const b = nodes[l + 1][Math.floor(rnd() * nodes[l + 1].length)];
    const t = rnd();
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, jz(0.4)];
  });

  const halfW = (y) => (y > 0 ? 1.6 : 1.6 * Math.sqrt(Math.max(0, (y + 2) / 2)));
  const shield = make(() => {
    const r = rnd();
    if (r < 0.3) {
      const y = -2 + rnd() * 3.8;
      return [(rnd() < 0.5 ? -1 : 1) * halfW(y) * 1.15, y, jz(0.4)];
    }
    if (r < 0.42) return [(rnd() - 0.5) * 3.7, 1.8, jz(0.4)];
    if (r < 0.7) {
      const y = -2 + rnd() * 3.8;
      return [(rnd() - 0.5) * 2 * halfW(y) * 1.15, y, jz(0.5)];
    }
    if (r < 0.88) {
      const a = rnd() * Math.PI * 2;
      return [Math.cos(a) * 0.4, 0.45 + Math.sin(a) * 0.4, jz(0.3)];
    }
    return [(rnd() - 0.5) * 0.24, -0.9 + rnd() * 0.95, jz(0.3)];
  });

  const ox = -0.5;
  const coneH = (x) => 0.6 + ((x + 1.6) / 3.0) * 1.2;
  const megaphone = make(() => {
    const r = rnd();
    if (r < 0.12) {
      return [ox - 2.6 + rnd() * 1.0, (rnd() - 0.5) * 1.2, jz(0.5)];
    }
    if (r < 0.32) {
      const x = -1.6 + rnd() * 3.0;
      return [ox + x, (rnd() < 0.5 ? -1 : 1) * coneH(x), jz(0.4)];
    }
    if (r < 0.55) {
      const x = -1.6 + rnd() * 3.0;
      return [ox + x, (rnd() - 0.5) * 2 * coneH(x), jz(0.6)];
    }
    if (r < 0.65) {
      return [ox + 1.4 + (rnd() - 0.5) * 0.18, (rnd() - 0.5) * 3.6, jz(0.4)];
    }
    if (r < 0.73) {
      return [ox - 1.4 + rnd() * 0.5, -0.6 - rnd() * 1.2, jz(0.3)];
    }
    const radius = [0.8, 1.5, 2.2][Math.floor(rnd() * 3)];
    const a = (rnd() - 0.5) * 1.4;
    return [
      ox + 1.4 + Math.cos(a) * radius + (rnd() - 0.5) * 0.08,
      Math.sin(a) * radius + (rnd() - 0.5) * 0.08,
      jz(0.3),
    ];
  });

  return [bars, cloud, net, shield, megaphone];
}

export function ParticleStage({ activeRef, rotateRef }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phoneAtMount = window.innerWidth < 640;
    const N = phoneAtMount ? N_PHONE : N_DESKTOP;
    const forms = buildFormations(N);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !phoneAtMount, powerPreference: "low-power" });
    } catch {
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, phoneAtMount ? 1.5 : 2));
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 8;
    const group = new THREE.Group();
    scene.add(group);

    const cur = new Float32Array(forms[0]);
    const speeds = new Float32Array(N);
    const r2 = mulberry32(99);
    for (let i = 0; i < N; i += 1) {
      speeds[i] = 0.025 + r2() * 0.05;
    }
    const geo = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(cur, 3);
    geo.setAttribute("position", attr);

    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext("2d");
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.6)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);

    const mat = new THREE.PointsMaterial({
      size: 0.1,
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(ACCENTS[0]),
    });
    group.add(new THREE.Points(geo, mat));

    let faceYaw = 0;
    const applyThemeToParticles = () => {
      const darkMode = document.documentElement.classList.contains("dark");
      mat.blending = darkMode ? THREE.AdditiveBlending : THREE.NormalBlending;
      mat.needsUpdate = true;
    };
    applyThemeToParticles();

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const vh = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const vw = vh * camera.aspect;
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const phone = window.innerWidth < 640;
      const darkMode = document.documentElement.classList.contains("dark");

      // The formations are about 7.6 wide x 4.6 tall; fit both axes so nothing is cropped on any screen.
      const fit = Math.min(
        0.9,
        (vw * (desktop ? 0.55 : 0.94)) / 7.6,
        (vh * (desktop ? 0.8 : 0.9)) / 4.6,
      );
      group.scale.setScalar(fit);

      const sizeFloor = phone ? (darkMode ? 0.85 : 0.95) : darkMode ? 0.55 : 0.72;
      mat.size = 0.1 * Math.min(darkMode ? 1 : 1.15, Math.max(sizeFloor, fit / (darkMode ? 0.9 : 0.78)));
      mat.opacity = darkMode ? (desktop ? 0.95 : phone ? 1 : 0.95) : desktop ? 0.88 : 0.95;
      applyThemeToParticles();

      const px = desktop ? vw * 0.2 : 0;
      const py = desktop ? vh * 0.05 : 0;
      group.position.set(px, py, 0);
      faceYaw = -Math.atan2(px, camera.position.z);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();
    const themeObserver = new MutationObserver(() => resize());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const mouse = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const onMove = (e) => {
      if (e.pointerType === "touch") return;
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.4;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.25;
    };
    window.addEventListener("pointermove", onMove);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);
    let tabHidden = document.hidden;
    const onVis = () => {
      tabHidden = document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);

    const accent = new THREE.Color();
    const clock = new THREE.Clock();
    let spin = 0;
    let shown = activeRef.current;
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || tabHidden) return;
      const dt = clock.getDelta();
      const idx = activeRef.current % forms.length;
      if (idx !== shown) {
        shown = idx;
        spin = 0;
        if (rotateRef?.current) {
          rotateRef.current.x = 0;
          rotateRef.current.y = 0;
        }
      }
      if (!reduce) spin += Math.min(dt, 0.05) * 0.18;
      const tgt = forms[idx];
      for (let i = 0; i < N; i += 1) {
        const k = reduce ? 1 : speeds[i];
        const b = i * 3;
        cur[b] += (tgt[b] - cur[b]) * k;
        cur[b + 1] += (tgt[b + 1] - cur[b + 1]) * k;
        cur[b + 2] += (tgt[b + 2] - cur[b + 2]) * k;
      }
      attr.needsUpdate = true;
      mat.color.lerp(accent.set(ACCENTS[idx]), 0.06);
      smooth.x += (mouse.x - smooth.x) * 0.05;
      smooth.y += (mouse.y - smooth.y) * 0.05;
      const userY = rotateRef?.current?.y || 0;
      const userX = rotateRef?.current?.x || 0;
      group.rotation.y = faceYaw + spin + smooth.x * 0.35 + userY;
      group.rotation.x = smooth.y * 0.35 + userX;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      themeObserver.disconnect();
      io.disconnect();
      geo.dispose();
      mat.dispose();
      tex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [activeRef, rotateRef]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none h-full w-full lg:absolute lg:inset-0 lg:-z-10"
    />
  );
}
