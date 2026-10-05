import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";

const SEEN_KEY = "adroit-intro-seen";
const TOTAL = 4.6;
const LOAD_DONE = 3.7;
const LOGO_W = 7.4;
const LAYERS = 36;
const DEPTH = 1.25;

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) =>
  t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

const VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uSweep;
  uniform float uReveal;
  uniform float uLayer;
  uniform float uPulse;
  varying vec2 vUv;
  varying vec3 vPos;

  float softBand(float x, float c, float w) {
    return exp(-pow((x - c) / w, 2.0));
  }

  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float front = smoothstep(0.90, 1.0, uLayer);

    vec3 deepA = vec3(0.01, 0.10, 0.28);
    vec3 deepB = vec3(0.05, 0.24, 0.45);
    vec3 deep = mix(deepA, deepB, 0.45 + 0.55 * uLayer);
    vec3 body = mix(deep, tex.rgb, 0.25 + 0.2 * uLayer) * (0.52 + 0.48 * uLayer);
    vec3 col = mix(body, tex.rgb, front);

    vec2 sweepDir = normalize(vec2(1.0, 0.32));
    float axis = dot(vUv - 0.5, sweepDir);
    float bandWide = softBand(axis, uSweep, 0.085);
    float bandTight = softBand(axis, uSweep, 0.03);
    col += vec3(0.35, 0.70, 1.0) * bandWide * (0.25 + 0.9 * front);
    col += vec3(0.75, 0.96, 1.0) * bandTight * (0.35 + 1.15 * front);

    float edge = 1.0 - smoothstep(0.18, 0.58, length(vUv - 0.5));
    col += vec3(0.09, 0.20, 0.45) * edge * (0.28 + 0.72 * front) * uPulse;

    float reveal = 1.0 - smoothstep(uReveal * 1.35 - 0.35, uReveal * 1.35, vUv.x);
    gl_FragColor = vec4(col, tex.a * reveal);
  }
`;

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

function streakTexture() {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 56;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(320, 28, 0, 320, 28, 320);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.22, "rgba(125,211,252,0.72)");
  g.addColorStop(1, "rgba(56,189,248,0)");
  x.save();
  x.scale(1, 0.0875);
  x.fillStyle = g;
  x.fillRect(0, 0, 640, 640);
  x.restore();
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
  return { points: new THREE.Points(geo, mat), geo, mat };
}

export default function IntroSplash({
  onDone,
  logoSrc = "/adroit-ctf-logo-white-blue.png",
}) {
  const [show, setShow] = useState(() => {
    try {
      if (
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      ) {
        return false;
      }
      return !sessionStorage.getItem(SEEN_KEY);
    } catch {
      return true;
    }
  });
  const hostRef = useRef(null);
  const barRef = useRef(null);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
    onDone?.();
  }, [onDone]);

  useEffect(() => {
    if (!show) onDone?.();
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
    let renderer;
    let removeResize = () => {};
    const disposables = [];
    const track = (o) => {
      disposables.push(o);
      return o;
    };

    const img = new Image();
    img.onerror = finish;
    img.onload = () => {
      if (cancelled) return;
      const phone = window.innerWidth < 640;

      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: !phone,
          powerPreference: "high-performance",
        });
      } catch {
        finish();
        return;
      }

      const pr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pr);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.06;
      renderer.domElement.style.cssText =
        "position:absolute;inset:0;display:block;width:100%;height:100%";
      host.insertBefore(renderer.domElement, host.firstChild);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        36,
        1,
        0.1,
        100
      );
      const group = new THREE.Group();
      scene.add(group);

      const aspect = img.naturalHeight / img.naturalWidth;
      const tex = track(new THREE.Texture(img));
      tex.needsUpdate = true;
      tex.colorSpace = THREE.SRGBColorSpace;

      const shared = {
        uMap: { value: tex },
        uSweep: { value: -1 },
        uReveal: { value: 0 },
        uPulse: { value: 0 },
      };

      const planeGeo = track(
        new THREE.PlaneGeometry(LOGO_W, LOGO_W * aspect)
      );
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

      const glowMat = track(
        new THREE.SpriteMaterial({
          map: track(
            radialTexture(
              "rgba(117,214,255,0.95)",
              "rgba(59,130,246,0.45)"
            )
          ),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      const glow = new THREE.Sprite(glowMat);
      glow.scale.set(24, 13, 1);
      glow.position.z = -2.1;
      scene.add(glow);

      const haloMat = track(
        new THREE.SpriteMaterial({
          map: track(
            radialTexture(
              "rgba(255,255,255,0.9)",
              "rgba(96,165,250,0.2)"
            )
          ),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      const halo = new THREE.Sprite(haloMat);
      halo.scale.set(12, 7.6, 1);
      halo.position.z = 0.2;
      scene.add(halo);

      const streakMat = track(
        new THREE.SpriteMaterial({
          map: track(streakTexture()),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      const streak = new THREE.Sprite(streakMat);
      streak.scale.set(23, 1.05, 1);
      streak.position.z = 0.8;
      scene.add(streak);

      const ringGeo = track(
        new THREE.TorusGeometry(4.2, 0.025, 12, 180)
      );
      const ringA = new THREE.Mesh(
        ringGeo,
        track(
          new THREE.MeshBasicMaterial({
            color: 0x69d1ff,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
          })
        )
      );
      ringA.rotation.x = 1.13;
      ringA.rotation.y = 0.23;
      ringA.position.z = -0.35;
      scene.add(ringA);

      const ringB = new THREE.Mesh(
        ringGeo,
        track(
          new THREE.MeshBasicMaterial({
            color: 0x7f8cff,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
          })
        )
      );
      ringB.scale.set(1.24, 1.24, 1.24);
      ringB.rotation.x = 0.95;
      ringB.rotation.y = -0.38;
      ringB.position.z = -0.55;
      scene.add(ringB);

      const dotTex = track(dotTexture());
      const far = dust(
        phone ? 280 : 460,
        [44, 24],
        -11,
        3,
        0.13,
        0.45,
        dotTex
      );
      const near = dust(
        phone ? 14 : 28,
        [28, 15],
        2.8,
        6.8,
        0.85,
        0.18,
        dotTex
      );
      [far, near].forEach((d) => {
        scene.add(d.points);
        track(d.geo);
        track(d.mat);
      });

      let fit = 1;
      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const visW =
          2 *
          10.8 *
          Math.tan(THREE.MathUtils.degToRad(18)) *
          camera.aspect;
        fit = Math.min(1, (visW * 0.76) / LOGO_W);
        group.scale.setScalar(fit);
      };
      resize();
      window.addEventListener("resize", resize);
      removeResize = () =>
        window.removeEventListener("resize", resize);

      const t0 = performance.now();
      const tick = () => {
        raf = requestAnimationFrame(tick);
        const t = (performance.now() - t0) / 1000;

        shared.uReveal.value = easeOutCubic(clamp01(t / 1.05));
        const depth = easeOutCubic(clamp01((t - 0.38) / 1.25));
        layers.forEach((m, i) => {
          m.position.z =
            (i / (LAYERS - 1) - 0.5) * DEPTH * depth;
        });

        shared.uSweep.value =
          -0.82 +
          1.64 * easeInOut(clamp01((t - 1.2) / 1.35));
        shared.uPulse.value =
          0.6 +
          0.4 *
            Math.sin(t * 2.4 + shared.uSweep.value * 4.2);

        const push = clamp01((t - 3.05) / 0.95);
        const yaw =
          THREE.MathUtils.lerp(
            -0.62,
            0.17,
            easeInOut(clamp01(t / 2.55))
          ) *
          (1 - push);
        group.rotation.y = yaw;
        group.rotation.x =
          0.07 * Math.sin(t * 1.15) * (1 - push);
        group.scale.setScalar(
          fit * (0.9 + 0.1 * shared.uReveal.value)
        );

        camera.position.z =
          10.8 -
          1.0 * easeOutCubic(clamp01(t / 2.8)) -
          8.2 * Math.pow(push, 2.8);

        const ringOn = smooth(0.9, 2.7, t) * (1 - smooth(3.4, TOTAL, t));
        ringA.rotation.z += 0.008;
        ringA.rotation.y += 0.002;
        ringA.material.opacity = 0.35 * ringOn;
        ringB.rotation.z -= 0.007;
        ringB.rotation.y -= 0.0015;
        ringB.material.opacity = 0.22 * ringOn;

        far.points.rotation.y = t * 0.035;
        far.points.position.x = Math.sin(t * 0.18) * 0.4;
        near.points.position.x = -t * 0.24;
        near.points.position.y = Math.sin(t * 0.8) * 0.15;

        glowMat.opacity =
          0.85 *
          smooth(0.15, 1.4, t) *
          (1 - smooth(3.2, TOTAL, t));
        haloMat.opacity =
          0.58 *
          smooth(0.8, 2.3, t) *
          (1 - smooth(3.3, TOTAL, t));

        const flare = Math.exp(
          -Math.pow((t - 1.95) / 0.23, 2)
        );
        streakMat.opacity = flare * 0.95;
        streak.scale.x = 23 * (0.38 + 0.62 * flare);
        streak.position.x =
          (shared.uSweep.value - 0.1) * 2.35;

        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${easeInOut(
            clamp01(t / LOAD_DONE)
          )})`;
        }

        host.style.opacity = String(
          1 - smooth(3.85, TOTAL, t)
        );
        if (t > 3.8) host.style.pointerEvents = "none";

        renderer.render(scene, camera);
        if (t >= TOTAL + 0.04) finish();
      };
      tick();
    };
    img.src = logoSrc;

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      removeResize();
      document.body.style.overflow = prevOverflow;
      disposables.forEach((d) => d.dispose?.());
      if (renderer) {
        renderer.dispose();
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
      aria-label="AdroIT intro"
      className="fixed inset-0 z-[9999] h-dvh w-screen overflow-hidden bg-[#02040a]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(88%_66%_at_50%_44%,rgba(56,189,248,0.10)_0%,rgba(9,14,32,0.60)_56%,rgba(1,2,6,0.95)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_32%,transparent_72%,rgba(255,255,255,0.02))]" />

      <div className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 text-center">
        <p className="font-mono text-[11px] tracking-[0.34em] text-sky-200/70 uppercase">
          AdroIT Systems
        </p>
        <p className="mt-2 text-xs text-slate-300/70">
          Initializing domains and project grid
        </p>
      </div>

      <div className="absolute bottom-11 left-1/2 h-[2px] w-[min(64vw,24rem)] -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
        <div
          ref={barRef}
          className="h-full w-full origin-left rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-5 right-5 z-10 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white"
      >
        Skip
      </button>
    </div>,
    document.body
  );
}
