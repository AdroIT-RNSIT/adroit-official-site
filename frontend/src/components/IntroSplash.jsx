import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const SEEN_KEY = "adroit-intro-seen";

// Timeline (seconds)
const TOTAL = 5.0; // splash fully gone
const LOAD_DONE = 3.9; // progress bar reaches 100%
const GATHER_START = 0.15; // particles start flying in
const GATHER_LEN = 2.5; // ...and have all arrived by GATHER_START + GATHER_LEN
const FACE_START = 1.95; // solid logo face fades in under the particles
const FACE_END = 2.95;
const BODY_START = 2.3; // 3D extrusion appears
const BODY_END = 3.5;
const SHOCK_START = 2.5; // soft ring when the logo locks in
const SHOCK_LEN = 1.2;
const SWEEP_START = 3.0; // light sweep across the finished logo
const SWEEP_LEN = 1.1;
const PUSH_START = 3.8; // slow exit push-in
const FADE_START = 4.25; // fade to the page

// Scene
const LOGO_W = 7.4; // logo width in world units (before `fit` scaling)
const DEPTH = 1.25; // extrusion depth of the solid logo
const FOV = 36;
const CAM_START = 11.6;
const CAM_REST = 9.8; // camera distance used for responsive fitting
const CAM_END = 4.2; // exit push (stays in front of the near dust fade)
const BG_HEX = 0x02040a;
const MAX_PIXELS = 8.5e6; // cap on drawing-buffer size (retina / 4K guard)

const SWEEP_DIR = new THREE.Vector2(1, 0.32).normalize();

/* ------------------------------------------------------------------ */
/*  Math helpers                                                       */
/* ------------------------------------------------------------------ */

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* ------------------------------------------------------------------ */
/*  Shaders                                                            */
/* ------------------------------------------------------------------ */

// Full-screen background drawn inside WebGL so the vignette sits BEHIND the
// logo (a CSS overlay would dim it).
const BG_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const BG_FRAG = /* glsl */ `
  uniform float uShock;   // 0..1 ring progress (0 = hidden)
  uniform float uAspect;  // canvas width / height
  varying vec2 vUv;

  void main() {
    // ellipse centred at 50% / 44% from top, radii 88% x 66%
    vec2 q = (vUv - vec2(0.5, 0.56)) / vec2(0.88, 0.66);
    float r = clamp(length(q), 0.0, 1.0);

    vec3 c0 = vec3(56.0, 189.0, 248.0) / 255.0;
    vec3 c1 = vec3(9.0, 14.0, 32.0) / 255.0;
    vec3 c2 = vec3(1.0, 2.0, 6.0) / 255.0;

    vec3 c;
    float a;
    if (r < 0.56) {
      float k = r / 0.56;
      c = mix(c0, c1, k);
      a = mix(0.10, 0.60, k);
    } else {
      float k = (r - 0.56) / 0.44;
      c = mix(c1, c2, k);
      a = mix(0.60, 0.95, k);
    }

    vec3 base = vec3(2.0, 4.0, 10.0) / 255.0;
    vec3 col = mix(base, c, a);

    // faint top / bottom light wash
    col += vec3(0.03) * (1.0 - clamp((1.0 - vUv.y) / 0.32, 0.0, 1.0));
    col += vec3(0.02) * clamp((0.28 - vUv.y) / 0.28, 0.0, 1.0);

    // lock-in ring: expands from the logo centre, aspect-corrected
    vec2 p = (vUv - vec2(0.5, 0.53)) * vec2(uAspect, 1.0);
    float R = uShock * 1.15;
    float d = abs(length(p) - R);
    float ring = exp(-pow(d / 0.028, 2.0));
    float life = (1.0 - uShock) * (1.0 - uShock) * smoothstep(0.0, 0.05, uShock);
    col += vec3(0.10, 0.30, 0.52) * ring * life * 0.9;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// Particles: each one flies from a scattered start to its pixel of the logo
// along a curved path, with a per-particle delay so the arrival is staggered.
const PARTICLE_VERT = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aColor;
  attribute vec4 aRand;

  uniform float uProgress;   // 0..1 across the whole gather window
  uniform float uTime;
  uniform float uPx;         // pixels per world unit at distance 1
  uniform float uWorldScale; // stage scale, so point size follows the logo
  uniform float uSpacing;    // distance between neighbouring logo samples
  uniform float uOpacity;
  uniform float uShimmer;
  uniform vec3  uExtent;     // how far the cloud starts from the logo

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 target = position;
    vec3 start = aStart * uExtent;

    float delay = aRand.x * 0.38;
    float k = clamp((uProgress - delay) / (1.0 - 0.38), 0.0, 1.0);
    float sm = k * k * (3.0 - 2.0 * k);
    float oc = 1.0 - pow(1.0 - k, 3.0);
    float e = mix(sm, oc, 0.55);

    // curved path (quadratic bezier), sign and size random per particle
    vec3 dir = target - start;
    vec3 perp = vec3(-dir.y, dir.x, 0.0);
    perp /= max(length(perp), 0.0001);
    float arc = (aRand.y - 0.5) * 2.0 * length(dir.xy) * 0.35;
    vec3 mid = (start + target) * 0.5 + perp * arc
             + vec3(0.0, 0.0, (aRand.z - 0.5) * 3.0);
    float ie = 1.0 - e;
    vec3 pos = ie * ie * start + 2.0 * ie * e * mid + e * e * target;

    // tiny shimmer once settled
    vec3 wob = vec3(
      sin(uTime * 1.7 + aRand.z * 40.0),
      cos(uTime * 1.3 + aRand.y * 37.0),
      sin(uTime * 1.1 + aRand.x * 29.0)
    );
    pos += wob * uSpacing * 0.35 * uShimmer * smoothstep(0.8, 1.0, e);

    // colour: cool glow in flight -> the logo's own colour on arrival
    vec3 hot = vec3(0.45, 0.82, 1.0);
    vec3 col = mix(hot, aColor, smoothstep(0.5, 1.0, e));
    float flash = exp(-pow((e - 0.92) / 0.06, 2.0));
    float bright = 0.95 - 0.30 * e + 0.55 * flash;
    vColor = col * bright;
    vAlpha = uOpacity * (0.35 + 0.65 * e);

    float size = uSpacing * (1.8 + 1.4 * aRand.w) * mix(1.5, 0.95, e);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(size * uWorldScale * uPx / -mv.z, 1.5, 64.0);
  }
`;

const PARTICLE_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a = pow(1.0 - r, 1.6);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Solid logo. Colours are authored in display space (texture is NOT
// sRGB-decoded and the shader writes straight to the framebuffer).
const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uSweep;   // band position along the sweep axis (logo-height units)
  uniform float uFace;    // front face opacity
  uniform float uBody;    // extrusion opacity
  uniform float uLayer;
  uniform float uPulse;
  uniform float uAspect;  // plane width / height
  uniform vec2  uDir;     // sweep direction (normalised)
  varying vec2 vUv;

  float band(float x, float c, float w) {
    float d = (x - c) / w;
    return exp(-d * d);
  }

  void main() {
    vec4 tex = texture2D(uMap, vUv);

    float front = smoothstep(0.90, 1.0, uLayer);
    float alpha = tex.a * mix(uBody, uFace, front);
    if (alpha < 0.004) discard; // skips empty pixels on every layer

    vec3 deepA = vec3(0.01, 0.10, 0.28);
    vec3 deepB = vec3(0.05, 0.24, 0.45);
    vec3 deep = mix(deepA, deepB, 0.45 + 0.55 * uLayer);
    vec3 body = mix(deep, tex.rgb, 0.25 + 0.2 * uLayer) * (0.52 + 0.48 * uLayer);

    // slightly dimmed front face so the highlight has headroom on white
    vec3 face = tex.rgb * 0.90;
    vec3 col = mix(body, face, front);

    // shine: aspect-corrected diagonal band living entirely in the logo
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float axis = dot(p, uDir);
    float wide = band(axis, uSweep, 0.20);
    float tight = band(axis, uSweep, 0.055);
    col += vec3(0.30, 0.62, 1.00) * wide * (0.22 + 0.80 * front);
    col += vec3(0.80, 0.96, 1.00) * tight * (0.30 + 1.00 * front);

    float edge = 1.0 - smoothstep(0.18, 0.58, length(vUv - 0.5));
    col += vec3(0.09, 0.20, 0.45) * edge * (0.28 + 0.72 * front) * uPulse;

    gl_FragColor = vec4(col, alpha);
  }
`;

/* ------------------------------------------------------------------ */
/*  Procedural textures / dust                                         */
/* ------------------------------------------------------------------ */

function radialTexture(inner, outer) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(0.38, outer);
  g.addColorStop(1, "rgba(5,7,13,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function dust(count, spread, zMin, zMax, size, opacity, tex) {
  const p = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    p[i * 3] = (Math.random() - 0.5) * spread[0];
    p[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
    p[i * 3 + 2] = zMin + Math.random() * (zMax - zMin);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
  const mat = new THREE.PointsMaterial({
    map: tex,
    size,
    color: 0x9bd8ff,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return { points: new THREE.Points(geo, mat), geo, mat, baseOpacity: opacity };
}

/* ------------------------------------------------------------------ */
/*  Logo sampling                                                      */
/* ------------------------------------------------------------------ */

// Reads the logo's opaque pixels into a flat list [x, y, r, g, b, ...].
// If the logo has too many pixels for the particle budget, the grid is
// coarsened so the density stays even instead of cropping part of the logo.
function sampleLogo(img, maxCount, startCols) {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) return null;

  let cols = startCols;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const rows = Math.max(1, Math.round((cols * h) / w));
    const c = document.createElement("canvas");
    c.width = cols;
    c.height = rows;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, cols, rows);

    let data;
    try {
      data = ctx.getImageData(0, 0, cols, rows).data;
    } catch {
      return null; // tainted canvas (cross-origin logo without CORS)
    }

    const pts = [];
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const i = (y * cols + x) * 4;
        if (data[i + 3] > 40) {
          pts.push(x, y, data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
        }
      }
    }

    const count = pts.length / 5;
    if (count === 0) return null;
    if (count > maxCount && cols > 48) {
      cols = Math.max(48, Math.floor(cols * Math.sqrt(maxCount / count) * 0.97));
      continue;
    }
    return { pts, cols, rows, count };
  }
  return null;
}

function shouldShow() {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
    return !sessionStorage.getItem(SEEN_KEY);
  } catch {
    return true;
  }
}

const STATUS = [
  [0, "Initializing domains"],
  [40, "Building the project grid"],
  [80, "Syncing systems"],
  [100, "Ready"],
];
const statusFor = (pct) => {
  let s = STATUS[0][1];
  for (let i = 0; i < STATUS.length; i += 1) {
    if (pct >= STATUS[i][0]) s = STATUS[i][1];
  }
  return s;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function IntroSplash({
  onDone,
  logoSrc = "/adroit-ctf-logo-white-blue.png",
}) {
  const [show, setShow] = useState(shouldShow);
  const hostRef = useRef(null);
  const barRef = useRef(null);
  const pctRef = useRef(null);
  const statusRef = useRef(null);
  const doneRef = useRef(false);

  // Latest onDone lives in a ref so an inline callback from the parent can
  // never change `finish` and restart the animation on re-render.
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
    onDoneRef.current?.();
  }, []);

  // Splash is being skipped entirely (already seen / reduced motion)
  useEffect(() => {
    if (!show && !doneRef.current) {
      doneRef.current = true;
      onDoneRef.current?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!show) return undefined;
    const host = hostRef.current;
    if (!host) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let raf = 0;
    let cancelled = false;
    let renderer = null;
    let observer = null;
    let removeResize = () => {};
    const disposables = [];
    const track = (o) => {
      disposables.push(o);
      return o;
    };

    const onKey = (e) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    // Never leave people staring at a splash that is stuck loading
    const loadTimer = window.setTimeout(() => {
      if (!cancelled) finish();
    }, 6000);

    img.onerror = () => {
      if (!cancelled) finish();
    };

    img.onload = () => {
      if (cancelled) return;
      window.clearTimeout(loadTimer);

      const phone = window.innerWidth < 640;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let pr = dpr;
      const LAYERS = phone ? 18 : 28;

      try {
        renderer = new THREE.WebGLRenderer({
          alpha: false, // opaque canvas => additive glows composite correctly
          antialias: !phone && dpr < 2,
          powerPreference: "high-performance",
        });
      } catch {
        finish();
        return;
      }

      renderer.setClearColor(BG_HEX, 1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.domElement.style.cssText =
        "position:absolute;inset:0;display:block;width:100%;height:100%";
      host.insertBefore(renderer.domElement, host.firstChild);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
      camera.position.z = CAM_START;

      /* ---------- background ---------- */
      const bgMat = track(
        new THREE.ShaderMaterial({
          vertexShader: BG_VERT,
          fragmentShader: BG_FRAG,
          uniforms: { uShock: { value: 0 }, uAspect: { value: 1.78 } },
          depthTest: false,
          depthWrite: false,
        })
      );
      const bg = new THREE.Mesh(track(new THREE.PlaneGeometry(2, 2)), bgMat);
      bg.frustumCulled = false;
      bg.renderOrder = -10;
      scene.add(bg);

      /* ---------- stage (scaled to fit the viewport) ---------- */
      const stage = new THREE.Group();
      scene.add(stage);

      const group = new THREE.Group(); // logo layers + particles, gets the yaw
      stage.add(group);

      /* ---------- solid logo layers ---------- */
      const imgAspect =
        img.naturalWidth > 0 ? img.naturalHeight / img.naturalWidth : 0.3;
      const aspectWH = 1 / imgAspect;

      const tex = track(new THREE.Texture(img));
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      tex.needsUpdate = true;

      const shared = {
        uMap: { value: tex },
        uSweep: { value: -2 },
        uFace: { value: 0 },
        uBody: { value: 0 },
        uPulse: { value: 0 },
        uAspect: { value: aspectWH },
        uDir: { value: SWEEP_DIR },
      };

      const planeGeo = track(new THREE.PlaneGeometry(LOGO_W, LOGO_W * imgAspect));
      const layers = [];
      for (let i = 0; i < LAYERS; i += 1) {
        const mat = track(
          new THREE.ShaderMaterial({
            vertexShader: VERT,
            fragmentShader: FRAG,
            uniforms: {
              ...shared,
              uLayer: { value: i / (LAYERS - 1) },
            },
            transparent: true,
            depthWrite: false,
          })
        );
        const mesh = new THREE.Mesh(planeGeo, mat);
        mesh.renderOrder = i;
        group.add(mesh);
        layers.push(mesh);
      }

      // how far the sweep band travels so it starts/ends fully off the logo
      const halfExtent =
        0.5 * (aspectWH * Math.abs(SWEEP_DIR.x) + Math.abs(SWEEP_DIR.y));
      const sweepSpan = halfExtent + 0.45;

      /* ---------- particles that form the logo ---------- */
      const sample = sampleLogo(img, phone ? 6000 : 14000, phone ? 170 : 260);
      const hasParticles = !!sample;
      const faceStart = hasParticles ? FACE_START : 0.45;
      const faceEnd = hasParticles ? FACE_END : 1.45;
      const bodyStart = hasParticles ? BODY_START : 0.8;
      const bodyEnd = hasParticles ? BODY_END : 2.0;

      let particles = null;
      let pMat = null;
      let particleCount = 0;
      if (hasParticles) {
        const { pts, cols, rows, count } = sample;
        particleCount = count;

        const order = Array.from({ length: count }, (_, i) => i);
        for (let i = count - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [order[i], order[j]] = [order[j], order[i]];
        }

        const targets = new Float32Array(count * 3);
        const starts = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const rands = new Float32Array(count * 4);
        for (let k = 0; k < count; k += 1) {
          const s = order[k] * 5;
          const px = pts[s];
          const py = pts[s + 1];
          targets[k * 3] =
            ((px + 0.5 + (Math.random() - 0.5) * 0.9) / cols - 0.5) * LOGO_W;
          targets[k * 3 + 1] =
            (0.5 - (py + 0.5 + (Math.random() - 0.5) * 0.9) / rows) *
            LOGO_W *
            imgAspect;
          targets[k * 3 + 2] = 0;

          // start: a soft ring-ish cloud in unit coordinates (scaled in shader)
          const ang = Math.random() * Math.PI * 2;
          const rad = 0.5 + 0.9 * Math.pow(Math.random(), 0.7);
          starts[k * 3] = Math.cos(ang) * rad;
          starts[k * 3 + 1] = Math.sin(ang) * rad;
          starts[k * 3 + 2] = (Math.random() - 0.3) * 6 - 1;

          colors[k * 3] = pts[s + 2];
          colors[k * 3 + 1] = pts[s + 3];
          colors[k * 3 + 2] = pts[s + 4];

          rands[k * 4] = Math.random();
          rands[k * 4 + 1] = Math.random();
          rands[k * 4 + 2] = Math.random();
          rands[k * 4 + 3] = Math.random();
        }

        const pGeo = track(new THREE.BufferGeometry());
        pGeo.setAttribute("position", new THREE.BufferAttribute(targets, 3));
        pGeo.setAttribute("aStart", new THREE.BufferAttribute(starts, 3));
        pGeo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
        pGeo.setAttribute("aRand", new THREE.BufferAttribute(rands, 4));

        pMat = track(
          new THREE.ShaderMaterial({
            vertexShader: PARTICLE_VERT,
            fragmentShader: PARTICLE_FRAG,
            uniforms: {
              uProgress: { value: 0 },
              uTime: { value: 0 },
              uPx: { value: 800 },
              uWorldScale: { value: 1 },
              uSpacing: { value: LOGO_W / cols },
              uOpacity: { value: 0 },
              uShimmer: { value: 0 },
              uExtent: { value: new THREE.Vector3(6, 3.5, 1) },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        );
        particles = new THREE.Points(pGeo, pMat);
        particles.frustumCulled = false;
        particles.renderOrder = 100; // after the solid layers
        group.add(particles);
      }

      /* ---------- ambient glow (screen-sized, scene level) ---------- */
      const glowMat = track(
        new THREE.SpriteMaterial({
          map: track(
            radialTexture("rgba(117,214,255,0.95)", "rgba(59,130,246,0.45)")
          ),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      const glow = new THREE.Sprite(glowMat);
      glow.position.z = -2.1;
      glow.renderOrder = -3;
      scene.add(glow);

      /* ---------- halo behind the logo (follows the stage) ---------- */
      const haloMat = track(
        new THREE.SpriteMaterial({
          map: track(
            radialTexture("rgba(255,255,255,0.9)", "rgba(96,165,250,0.2)")
          ),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      const halo = new THREE.Sprite(haloMat);
      halo.scale.set(LOGO_W * 1.7, LOGO_W * imgAspect * 1.9 + 1.2, 1);
      halo.position.z = -0.9;
      halo.renderOrder = -1;
      stage.add(halo);

      /* ---------- dust ---------- */
      const dotTex = track(dotTexture());
      const far = dust(phone ? 280 : 460, [44, 24], -11, 1.5, 0.13, 0.45, dotTex);
      const near = dust(phone ? 14 : 28, [28, 15], 3.4, 6.2, 0.85, 0.18, dotTex);
      far.points.renderOrder = -2;
      near.points.renderOrder = 200;
      [far, near].forEach((d) => {
        scene.add(d.points);
        track(d.geo);
        track(d.mat);
      });

      /* ---------- responsive layout ---------- */
      let fit = 1;
      const layout = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;

        const cap = Math.sqrt(MAX_PIXELS / (w * h));
        const ratio = Math.min(pr, cap);
        renderer.setPixelRatio(ratio);
        renderer.setSize(w, h, false);

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        bgMat.uniforms.uAspect.value = camera.aspect;

        const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
        const visH = 2 * CAM_REST * tanHalf;
        const visW = visH * camera.aspect;

        // Fit by BOTH width and height so short / wide / ultra-wide windows
        // never crop or overflow the logo.
        const widthFrac =
          camera.aspect < 0.8 ? 0.8 : camera.aspect < 1.3 ? 0.7 : 0.6;
        const heightFrac = h < 520 ? 0.5 : 0.42;
        const logoH = LOGO_W * imgAspect;
        fit = Math.min(
          (visW * widthFrac) / LOGO_W,
          (visH * heightFrac) / logoH,
          1.6
        );

        // nudge up a touch so the loader at the bottom never collides
        stage.position.y = visH * (h < 520 ? 0 : 0.03);

        // glow always covers the screen, whatever the aspect
        const gDist = CAM_REST + 2.1;
        const gH = 2 * gDist * tanHalf;
        const gW = gH * camera.aspect;
        glow.scale.set(Math.max(gW * 1.5, gH * 1.1), gH * 1.5, 1);
        glow.position.y = stage.position.y;

        // keep dust density sensible on phones and ultra-wides
        const dx = Math.max(0.35, camera.aspect / 1.78);
        far.points.scale.x = dx;
        near.points.scale.x = dx;

        if (pMat) {
          pMat.uniforms.uPx.value = (h * ratio) / (2 * tanHalf);
          // particle cloud starts roughly one screen wide, in stage units
          pMat.uniforms.uExtent.value.set(
            ((visW / fit) * 0.5) * 0.8,
            ((visH / fit) * 0.5) * 0.8,
            1
          );
        }
      };
      layout();

      if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(layout);
        observer.observe(host);
      } else {
        window.addEventListener("resize", layout);
        removeResize = () => window.removeEventListener("resize", layout);
      }

      /* ---------- adaptive quality ---------- */
      let degraded = false;
      const degrade = () => {
        degraded = true;
        pr = 1;
        layout();
        layers.forEach((m, i) => {
          m.visible = i % 2 === 0 || i === LAYERS - 1;
        });
        if (particles) {
          particles.geometry.setDrawRange(0, Math.floor(particleCount * 0.6));
        }
      };

      /* ---------- animation ---------- */
      let last = performance.now();
      const t0 = last;
      let ema = 1 / 60;
      let frames = 0;
      let lastPct = -1;
      let lastStatus = "";

      const tick = () => {
        raf = requestAnimationFrame(tick);

        const now = performance.now();
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        frames += 1;
        if (frames > 20) ema += (dt - ema) * 0.08; // skip shader-compile hitches
        const t = (now - t0) / 1000;

        if (!degraded && t > 0.9 && ema > 0.04) degrade();

        // ---- solid logo: face fades in, then the extrusion grows ----
        shared.uFace.value = smooth(faceStart, faceEnd, t);
        const bodyP = smooth(bodyStart, bodyEnd, t);
        shared.uBody.value = bodyP * bodyP;
        const depth = easeInOut(clamp01((t - bodyStart) / (bodyEnd - bodyStart + 0.2)));
        layers.forEach((m, i) => {
          m.position.z = (i / (LAYERS - 1) - 0.5) * DEPTH * depth;
        });

        // ---- particles ----
        if (pMat) {
          pMat.uniforms.uProgress.value = clamp01(
            (t - GATHER_START) / GATHER_LEN
          );
          pMat.uniforms.uTime.value = t;
          pMat.uniforms.uWorldScale.value = stage.scale.x;
          pMat.uniforms.uOpacity.value =
            smooth(0, 0.6, t) * (1 - smooth(2.55, 3.4, t));
          pMat.uniforms.uShimmer.value =
            smooth(1.6, 2.6, t) * (1 - smooth(2.8, 3.4, t));
          // keep the particle plane on the front face as the extrusion grows
          particles.position.z = 0.5 * DEPTH * depth;
        }

        // ---- shine: lives entirely in the logo shader ----
        const sweepP = clamp01((t - SWEEP_START) / SWEEP_LEN);
        shared.uSweep.value = THREE.MathUtils.lerp(
          -sweepSpan,
          sweepSpan,
          easeInOut(sweepP)
        );
        const sweepEnergy = Math.sin(Math.PI * sweepP); // 0 -> 1 -> 0
        shared.uPulse.value =
          0.6 + 0.4 * Math.sin(t * 2.4 + shared.uSweep.value * 4.2);

        // ---- camera, yaw, exit push ----
        const push = clamp01((t - PUSH_START) / (TOTAL - PUSH_START));
        const easedPush = easeInOut(push);

        group.rotation.y =
          THREE.MathUtils.lerp(-0.5, 0.15, easeInOut(clamp01(t / 3.6))) *
          (1 - easedPush);
        group.rotation.x = 0.05 * Math.sin(t * 1.05) * (1 - easedPush);

        const pop = 1 + 0.05 * smooth(2.4, 3.2, t) * (1 - easedPush);
        stage.scale.setScalar(fit * (0.94 + 0.06 * smooth(0, 2.6, t)) * pop);

        camera.position.z =
          CAM_START -
          (CAM_START - CAM_REST) * easeOutCubic(clamp01(t / 3.6)) -
          (CAM_REST - CAM_END) * Math.pow(easedPush, 1.6);

        // ---- background ring when the logo locks in ----
        bgMat.uniforms.uShock.value = clamp01((t - SHOCK_START) / SHOCK_LEN);

        // ---- dust (near dust fades out before the camera flies through) ----
        far.points.rotation.y = t * 0.035;
        far.points.position.x = Math.sin(t * 0.18) * 0.4;
        near.points.position.x = -t * 0.24;
        near.points.position.y = Math.sin(t * 0.8) * 0.15;
        near.mat.opacity =
          near.baseOpacity * smooth(0, 0.8, t) * (1 - smooth(0, 0.3, push));
        far.mat.opacity = far.baseOpacity * smooth(0, 0.8, t);

        // ---- glow + halo ----
        const out = 1 - smooth(FADE_START - 0.6, TOTAL, t);
        const lock = Math.exp(-Math.pow((t - 2.7) / 0.25, 2));
        glowMat.opacity = 0.7 * smooth(0.1, 1.4, t) * out;
        haloMat.opacity =
          (0.3 * smooth(0.9, 2.8, t) + 0.1 * sweepEnergy + 0.12 * lock) * out;

        // ---- loader ----
        const prog = easeInOut(clamp01(t / LOAD_DONE));
        if (barRef.current) barRef.current.style.transform = `scaleX(${prog})`;
        const pct = Math.round(prog * 100);
        if (pct !== lastPct) {
          lastPct = pct;
          if (pctRef.current) pctRef.current.textContent = `${pct}%`;
          const s = statusFor(pct);
          if (s !== lastStatus) {
            lastStatus = s;
            if (statusRef.current) statusRef.current.textContent = s;
          }
        }

        // ---- fade out to the page ----
        host.style.opacity = String(1 - smooth(FADE_START, TOTAL, t));
        if (t > FADE_START - 0.2) host.style.pointerEvents = "none";

        renderer.render(scene, camera);
        if (t >= TOTAL + 0.04) finish();
      };
      tick();
    };
    img.src = logoSrc;

    return () => {
      cancelled = true;
      window.clearTimeout(loadTimer);
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
      img.onload = null;
      img.onerror = null;
      observer?.disconnect();
      removeResize();
      document.body.style.overflow = prevOverflow;
      disposables.forEach((d) => d.dispose?.());
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss?.();
        if (renderer.domElement.parentNode === host) {
          host.removeChild(renderer.domElement);
        }
      }
    };
  }, [show, logoSrc, finish]);

  if (!show) return null;

  return createPortal(
    <div
      ref={hostRef}
      role="dialog"
      aria-modal="true"
      aria-label="AdroIT intro"
      className="fixed inset-x-0 top-0 z-[9999] h-dvh overflow-hidden bg-[#02040a]"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-6 pb-9">
        <p
          ref={statusRef}
          aria-live="polite"
          className="text-sm text-slate-200/80 [@media(max-height:520px)]:hidden"
        >
          Initializing domains
        </p>
        <div className="flex w-[min(64vw,24rem)] items-center gap-3">
          <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              ref={barRef}
              className="h-full w-full origin-left rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <span
            ref={pctRef}
            className="w-9 text-right font-mono text-xs tabular-nums text-sky-200/60"
          >
            0%
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute right-5 top-5 z-10 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      >
        Skip
      </button>
    </div>,
    document.body
  );
}
