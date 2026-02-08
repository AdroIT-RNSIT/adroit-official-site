import React, { useEffect, useRef } from 'react';

const ThreeScene = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize scene state
    const scene = {
      particles: [],
      orbitals: [],
      waves: [],
      mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
      animationId: null,
      time: 0
    };
    sceneRef.current = scene;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Reinitialize on resize
      initScene();
    };

    // Flowing Aurora Wave
    class Wave {
      constructor(canvas, index, total) {
        this.canvas = canvas;
        this.index = index;
        this.total = total;
        this.points = [];
        this.numPoints = 50;
        this.amplitude = 60 + index * 15;
        this.frequency = 0.004 + index * 0.0008;
        this.speed = 0.015 + index * 0.008;
        this.offset = (index / total) * Math.PI * 2;
        this.baseY = canvas.height * (0.5 + index * 0.12);
        this.hue = 180 + index * 25;
        this.opacity = 0.12 - index * 0.025;
      }

      update(time) {
        this.points = [];
        for (let i = 0; i <= this.numPoints; i++) {
          const x = (i / this.numPoints) * this.canvas.width;
          const wave1 = Math.sin(x * this.frequency + time * this.speed + this.offset) * this.amplitude;
          const wave2 = Math.sin(x * this.frequency * 1.5 - time * this.speed * 0.5) * (this.amplitude * 0.4);
          const y = this.baseY + wave1 + wave2;
          this.points.push({ x, y });
        }
      }

      draw(ctx, time) {
        if (this.points.length === 0) return;
        
        const gradient = ctx.createLinearGradient(0, this.baseY - this.amplitude, 0, this.baseY + this.amplitude);
        const hueShift = Math.sin(time * 0.0008 + this.offset) * 20;
        gradient.addColorStop(0, `hsla(${this.hue + hueShift}, 75%, 55%, 0)`);
        gradient.addColorStop(0.5, `hsla(${this.hue + hueShift}, 75%, 55%, ${this.opacity})`);
        gradient.addColorStop(1, `hsla(${this.hue + hueShift}, 75%, 55%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 0; i < this.points.length - 1; i++) {
          const xc = (this.points[i].x + this.points[i + 1].x) / 2;
          const yc = (this.points[i].y + this.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
        }
        
        ctx.lineTo(this.canvas.width, this.canvas.height);
        ctx.lineTo(0, this.canvas.height);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Orbital Particle
    class OrbitalParticle {
      constructor(canvas, index, ring) {
        this.canvas = canvas;
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        this.orbitRadius = 80 + ring * 50;
        this.angle = (index / 6) * Math.PI * 2;
        this.speed = 0.008 + Math.random() * 0.012;
        this.size = 1.5 + Math.random() * 2;
        this.trail = [];
        this.maxTrailLength = 15;
      }

      update(time, mouse) {
        this.angle += this.speed;
        
        const targetX = this.centerX + Math.cos(this.angle) * this.orbitRadius;
        const targetY = this.centerY + Math.sin(this.angle) * this.orbitRadius;
        
        const dx = mouse.x - targetX;
        const dy = mouse.y - targetY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let x = targetX;
        let y = targetY;
        
        if (distance < 150 && distance > 0) {
          const force = (150 - distance) / 150 * 40;
          x += (dx / distance) * force;
          y += (dy / distance) * force;
        }
        
        this.trail.unshift({ x, y });
        if (this.trail.length > this.maxTrailLength) {
          this.trail.pop();
        }
      }

      draw(ctx, time) {
        if (this.trail.length === 0) return;
        
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
          const alpha = (1 - i / this.trail.length) * 0.25;
          const size = this.size * (1 - i / this.trail.length);
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(this.trail[i].x, this.trail[i].y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Main particle with glow
        const gradient = ctx.createRadialGradient(
          this.trail[0].x, this.trail[0].y, 0,
          this.trail[0].x, this.trail[0].y, this.size * 2.5
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(0.4, 'rgba(0, 240, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.trail[0].x, this.trail[0].y, this.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Floating Particle
    class FloatingParticle {
      constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -20;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = Math.random() * 0.8 + 0.4;
        this.size = Math.random() * 2.5 + 0.8;
        this.hue = 180 + Math.random() * 70;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.wobble = Math.random() * 0.04;
      }

      update(time) {
        this.x += this.vx + Math.sin(time * this.wobble) * 0.3;
        this.y += this.vy;
        
        if (this.y > this.canvas.height + 20 || 
            this.x < -20 || 
            this.x > this.canvas.width + 20) {
          this.reset();
        }
      }

      draw(ctx) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, `hsla(${this.hue}, 75%, 55%, ${this.opacity})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 75%, 55%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize scene
    const initScene = () => {
      // Create waves
      scene.waves = [];
      for (let i = 0; i < 3; i++) {
        scene.waves.push(new Wave(canvas, i, 3));
      }

      // Create orbital particles
      scene.orbitals = [];
      for (let ring = 0; ring < 3; ring++) {
        for (let i = 0; i < 6; i++) {
          scene.orbitals.push(new OrbitalParticle(canvas, i, ring));
        }
      }

      // Create floating particles
      const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 12000));
      scene.particles = [];
      for (let i = 0; i < count; i++) {
        scene.particles.push(new FloatingParticle(canvas));
      }
      
      // Initialize mouse position
      scene.mouse.x = canvas.width / 2;
      scene.mouse.y = canvas.height / 2;
      scene.mouse.targetX = canvas.width / 2;
      scene.mouse.targetY = canvas.height / 2;
    };

    // Mouse handlers
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      scene.mouse.targetX = e.clientX - rect.left;
      scene.mouse.targetY = e.clientY - rect.top;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        scene.mouse.targetX = e.touches[0].clientX - rect.left;
        scene.mouse.targetY = e.touches[0].clientY - rect.top;
      }
    };

    // Animation loop
    const animate = () => {
      scene.time += 1;
      
      // Smooth mouse following
      scene.mouse.x += (scene.mouse.targetX - scene.mouse.x) * 0.08;
      scene.mouse.y += (scene.mouse.targetY - scene.mouse.y) * 0.08;
      
      // Clear and fade
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(10, 10, 15, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw waves
      scene.waves.forEach(wave => {
        wave.update(scene.time);
        wave.draw(ctx, scene.time);
      });
      
      // Draw floating particles
      scene.particles.forEach(particle => {
        particle.update(scene.time);
        particle.draw(ctx);
      });
      
      // Draw connections
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < scene.particles.length; i++) {
        for (let j = i + 1; j < scene.particles.length; j++) {
          const dx = scene.particles[i].x - scene.particles[j].x;
          const dy = scene.particles[i].y - scene.particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.globalAlpha = (1 - distance / 100) * 0.12;
            ctx.beginPath();
            ctx.moveTo(scene.particles[i].x, scene.particles[i].y);
            ctx.lineTo(scene.particles[j].x, scene.particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      
      // Draw orbitals
      scene.orbitals.forEach(orbital => {
        orbital.update(scene.time, scene.mouse);
        orbital.draw(ctx, scene.time);
      });
      
      // Central core
      const coreX = canvas.width / 2;
      const coreY = canvas.height / 2;
      const corePulse = Math.sin(scene.time * 0.025) * 8 + 25;
      
      // Glow rings
      for (let i = 3; i > 0; i--) {
        const gradient = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, corePulse * i);
        gradient.addColorStop(0, `rgba(139, 92, 246, ${0.12 / i})`);
        gradient.addColorStop(0.5, `rgba(0, 240, 255, ${0.08 / i})`);
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(coreX, coreY, corePulse * i, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Core center
      const coreGradient = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, corePulse);
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      coreGradient.addColorStop(0.3, 'rgba(0, 240, 255, 0.5)');
      coreGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(coreX, coreY, corePulse, 0, Math.PI * 2);
      ctx.fill();

      scene.animationId = requestAnimationFrame(animate);
    };

    // Initialize and start
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      if (scene.animationId) {
        cancelAnimationFrame(scene.animationId);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full block bg-transparent"
      ></canvas>
    </div>
  );
};

export default ThreeScene;



// Over design
/* 
import React, { useEffect, useRef } from 'react';

const ThreeScene = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize scene state
    const scene = {
      particles: [],
      orbitals: [],
      waves: [],
      sparkles: [],
      mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
      animationId: null,
      time: 0,
      mouseActive: false
    };
    sceneRef.current = scene;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initScene();
    };

    // Flowing Aurora Wave - MORE DRAMATIC
    class Wave {
      constructor(canvas, index, total) {
        this.canvas = canvas;
        this.index = index;
        this.total = total;
        this.points = [];
        this.numPoints = 80;
        this.amplitude = 100 + index * 25; // BIGGER waves
        this.frequency = 0.003 + index * 0.0006;
        this.speed = 0.025 + index * 0.012; // FASTER
        this.offset = (index / total) * Math.PI * 2;
        this.baseY = canvas.height * (0.45 + index * 0.13);
        this.hue = 180 + index * 30;
        this.opacity = 0.2 - index * 0.035; // MORE VISIBLE
      }

      update(time) {
        this.points = [];
        for (let i = 0; i <= this.numPoints; i++) {
          const x = (i / this.numPoints) * this.canvas.width;
          const wave1 = Math.sin(x * this.frequency + time * this.speed + this.offset) * this.amplitude;
          const wave2 = Math.sin(x * this.frequency * 1.5 - time * this.speed * 0.5) * (this.amplitude * 0.5);
          const wave3 = Math.sin(x * this.frequency * 0.5 + time * this.speed * 0.3) * (this.amplitude * 0.3); // EXTRA WAVE
          const y = this.baseY + wave1 + wave2 + wave3;
          this.points.push({ x, y });
        }
      }

      draw(ctx, time) {
        if (this.points.length === 0) return;
        
        const gradient = ctx.createLinearGradient(0, this.baseY - this.amplitude, 0, this.baseY + this.amplitude);
        const hueShift = Math.sin(time * 0.001 + this.offset) * 40; // MORE color shift
        gradient.addColorStop(0, `hsla(${this.hue + hueShift}, 85%, 60%, 0)`);
        gradient.addColorStop(0.5, `hsla(${this.hue + hueShift}, 85%, 60%, ${this.opacity})`);
        gradient.addColorStop(1, `hsla(${this.hue + hueShift}, 85%, 60%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 0; i < this.points.length - 1; i++) {
          const xc = (this.points[i].x + this.points[i + 1].x) / 2;
          const yc = (this.points[i].y + this.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
        }
        
        ctx.lineTo(this.canvas.width, this.canvas.height);
        ctx.lineTo(0, this.canvas.height);
        ctx.closePath();
        ctx.fill();
        
        // GLOWING EDGE - more prominent
        ctx.strokeStyle = `hsla(${this.hue + hueShift}, 85%, 70%, ${this.opacity * 3})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 0; i < this.points.length - 1; i++) {
          const xc = (this.points[i].x + this.points[i + 1].x) / 2;
          const yc = (this.points[i].y + this.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
        }
        ctx.stroke();
      }
    }

    // Orbital Particle - MORE RINGS, BIGGER TRAILS
    class OrbitalParticle {
      constructor(canvas, index, ring) {
        this.canvas = canvas;
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        this.orbitRadius = 70 + ring * 55;
        this.angle = (index / 8) * Math.PI * 2;
        this.speed = 0.012 + Math.random() * 0.018; // FASTER
        this.size = 2.5 + Math.random() * 2.5; // BIGGER
        this.trail = [];
        this.maxTrailLength = 30; // LONGER trails
        this.pulseSpeed = 0.03 + Math.random() * 0.04;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update(time, mouse, mouseActive) {
        this.angle += this.speed;
        
        const targetX = this.centerX + Math.cos(this.angle) * this.orbitRadius;
        const targetY = this.centerY + Math.sin(this.angle) * this.orbitRadius;
        
        const dx = mouse.x - targetX;
        const dy = mouse.y - targetY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let x = targetX;
        let y = targetY;
        
        // STRONGER mouse attraction
        if (distance < 250 && distance > 0 && mouseActive) {
          const force = (250 - distance) / 250 * 80;
          x += (dx / distance) * force;
          y += (dy / distance) * force;
        }
        
        this.trail.unshift({ x, y });
        if (this.trail.length > this.maxTrailLength) {
          this.trail.pop();
        }
      }

      draw(ctx, time) {
        if (this.trail.length === 0) return;
        
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
          const alpha = (1 - i / this.trail.length) * 0.4; // MORE VISIBLE trail
          const size = this.size * (1 - i / this.trail.length);
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(this.trail[i].x, this.trail[i].y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Main particle with pulsing
        const pulse = Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.5 + 0.5;
        const currentSize = this.size * (1 + pulse * 0.8);
        
        const gradient = ctx.createRadialGradient(
          this.trail[0].x, this.trail[0].y, 0,
          this.trail[0].x, this.trail[0].y, currentSize * 4
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(0, 240, 255, 0.8)');
        gradient.addColorStop(0.6, 'rgba(139, 92, 246, 0.5)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.trail[0].x, this.trail[0].y, currentSize * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Floating Particle - MORE PARTICLES
    class FloatingParticle {
      constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -20;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = Math.random() * 1.2 + 0.6; // FASTER
        this.size = Math.random() * 3 + 1; // BIGGER
        this.hue = 170 + Math.random() * 80;
        this.opacity = Math.random() * 0.7 + 0.3; // MORE VISIBLE
        this.wobble = Math.random() * 0.05;
      }

      update(time) {
        this.x += this.vx + Math.sin(time * this.wobble) * 0.5;
        this.y += this.vy;
        
        if (this.y > this.canvas.height + 20 || 
            this.x < -20 || 
            this.x > this.canvas.width + 20) {
          this.reset();
        }
      }

      draw(ctx) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, ${this.opacity})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 80%, 60%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // NEW: Mouse Sparkle Effect
    class Sparkle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1;
        this.decay = 0.02;
        this.size = Math.random() * 3 + 2;
        this.hue = 180 + Math.random() * 80;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.vx *= 0.95;
        this.vy *= 0.95;
      }

      draw(ctx) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `hsla(${this.hue}, 90%, 70%, ${this.life})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 90%, 70%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      isDead() {
        return this.life <= 0;
      }
    }

    // Initialize scene
    const initScene = () => {
      // Create waves - MORE!
      scene.waves = [];
      for (let i = 0; i < 5; i++) {
        scene.waves.push(new Wave(canvas, i, 5));
      }

      // Create orbital particles - MORE RINGS
      scene.orbitals = [];
      for (let ring = 0; ring < 4; ring++) {
        for (let i = 0; i < 8; i++) {
          scene.orbitals.push(new OrbitalParticle(canvas, i, ring));
        }
      }

      // Create floating particles - MANY MORE
      const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 8000));
      scene.particles = [];
      for (let i = 0; i < count; i++) {
        scene.particles.push(new FloatingParticle(canvas));
      }
      
      scene.sparkles = [];
      
      scene.mouse.x = canvas.width / 2;
      scene.mouse.y = canvas.height / 2;
      scene.mouse.targetX = canvas.width / 2;
      scene.mouse.targetY = canvas.height / 2;
    };

    // Mouse handlers
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      scene.mouse.targetX = e.clientX - rect.left;
      scene.mouse.targetY = e.clientY - rect.top;
      scene.mouseActive = true;
      
      // Create sparkles on mouse move
      if (Math.random() > 0.7) {
        scene.sparkles.push(new Sparkle(scene.mouse.x, scene.mouse.y));
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        scene.mouse.targetX = e.touches[0].clientX - rect.left;
        scene.mouse.targetY = e.touches[0].clientY - rect.top;
        scene.mouseActive = true;
        
        if (Math.random() > 0.7) {
          scene.sparkles.push(new Sparkle(scene.mouse.x, scene.mouse.y));
        }
      }
    };

    const handleMouseEnter = () => {
      scene.mouseActive = true;
    };

    const handleMouseLeave = () => {
      scene.mouseActive = false;
    };

    // Animation loop
    const animate = () => {
      scene.time += 1;
      
      // Smooth mouse following
      scene.mouse.x += (scene.mouse.targetX - scene.mouse.x) * 0.1;
      scene.mouse.y += (scene.mouse.targetY - scene.mouse.y) * 0.1;
      
      // Clear and fade - LIGHTER fade for more vibrant effect
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(10, 10, 15, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw waves
      scene.waves.forEach(wave => {
        wave.update(scene.time);
        wave.draw(ctx, scene.time);
      });
      
      // Draw floating particles
      scene.particles.forEach(particle => {
        particle.update(scene.time);
        particle.draw(ctx);
      });
      
      // Draw connections - MORE VISIBLE
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < scene.particles.length; i++) {
        for (let j = i + 1; j < scene.particles.length; j++) {
          const dx = scene.particles[i].x - scene.particles[j].x;
          const dy = scene.particles[i].y - scene.particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 130) {
            ctx.globalAlpha = (1 - distance / 130) * 0.2;
            ctx.beginPath();
            ctx.moveTo(scene.particles[i].x, scene.particles[i].y);
            ctx.lineTo(scene.particles[j].x, scene.particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      
      // Draw orbitals
      scene.orbitals.forEach(orbital => {
        orbital.update(scene.time, scene.mouse, scene.mouseActive);
        orbital.draw(ctx, scene.time);
      });
      
      // Update and draw sparkles
      scene.sparkles = scene.sparkles.filter(sparkle => {
        sparkle.update();
        sparkle.draw(ctx);
        return !sparkle.isDead();
      });
      
      // Central core - BIGGER AND MORE DRAMATIC
      const coreX = canvas.width / 2;
      const coreY = canvas.height / 2;
      const corePulse = Math.sin(scene.time * 0.03) * 15 + 40; // BIGGER
      
      // Glow rings - MORE LAYERS
      for (let i = 5; i > 0; i--) {
        const gradient = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, corePulse * i * 1.5);
        gradient.addColorStop(0, `rgba(139, 92, 246, ${0.15 / i})`);
        gradient.addColorStop(0.4, `rgba(0, 240, 255, ${0.12 / i})`);
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(coreX, coreY, corePulse * i * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Core center - BRIGHTER
      const coreGradient = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, corePulse);
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      coreGradient.addColorStop(0.2, 'rgba(0, 240, 255, 0.8)');
      coreGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.5)');
      coreGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(coreX, coreY, corePulse, 0, Math.PI * 2);
      ctx.fill();

      scene.animationId = requestAnimationFrame(animate);
    };

    // Initialize and start
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (scene.animationId) {
        cancelAnimationFrame(scene.animationId);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full block bg-transparent"
        style={{ cursor: 'crosshair' }}
      ></canvas>
    </div>
  );
};

export default ThreeScene;
*/