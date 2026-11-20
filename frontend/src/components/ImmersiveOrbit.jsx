import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Lightweight Three.js orbit for the 3D Immersive home stage.
 * Pauses under reduced motion, when offscreen, or on narrow/low-power devices.
 */
export default function ImmersiveOrbit({ className = "" }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    const saveData = navigator.connection?.saveData === true;
    const cores = navigator.hardwareConcurrency || 4;
    if (reduceMotion || narrow || saveData || cores <= 2) return undefined;

    let disposed = false;
    let frame = 0;
    let visible = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
    camera.position.set(0, 0.35, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    const key = new THREE.DirectionalLight(0x22d3ee, 1.1);
    key.position.set(3, 4, 5);
    const fill = new THREE.DirectionalLight(0xa78bfa, 0.55);
    fill.position.set(-4, -1, 2);
    scene.add(ambient, key, fill);

    const group = new THREE.Group();
    scene.add(group);

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.08, 16, 64),
      new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        metalness: 0.55,
        roughness: 0.28,
        emissive: 0x0e7490,
        emissiveIntensity: 0.25,
      }),
    );
    torus.rotation.x = Math.PI / 2.4;

    const ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.55, 0),
      new THREE.MeshStandardMaterial({
        color: 0xa78bfa,
        metalness: 0.4,
        roughness: 0.35,
        flatShading: true,
        emissive: 0x4c1d95,
        emissiveIntensity: 0.2,
      }),
    );

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.72, 0.045, 12, 48),
      new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        metalness: 0.5,
        roughness: 0.3,
        emissive: 0x9d174d,
        emissiveIntensity: 0.18,
      }),
    );
    ring.rotation.y = 0.6;

    const dots = new THREE.Points(
      (() => {
        const n = 48;
        const pos = new Float32Array(n * 3);
        for (let i = 0; i < n; i += 1) {
          const a = (i / n) * Math.PI * 2;
          const r = 1.55 + (i % 5) * 0.08;
          pos[i * 3] = Math.cos(a) * r;
          pos[i * 3 + 1] = Math.sin(a * 2) * 0.25;
          pos[i * 3 + 2] = Math.sin(a) * r;
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        return g;
      })(),
      new THREE.PointsMaterial({ color: 0x67e8f9, size: 0.04, transparent: true, opacity: 0.85 }),
    );

    group.add(torus, ico, ring, dots);

    const resize = () => {
      if (disposed) return;
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    io.observe(host);

    const t0 = performance.now();
    const tick = (now) => {
      if (disposed) return;
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      const t = (now - t0) / 1000;
      group.rotation.y = t * 0.28;
      torus.rotation.z = t * 0.35;
      ico.rotation.x = t * 0.5;
      ico.rotation.y = t * 0.35;
      ring.rotation.x = t * 0.22;
      ico.position.y = Math.sin(t * 1.2) * 0.12;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      group.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      data-part="im-canvas"
      className={`absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}
