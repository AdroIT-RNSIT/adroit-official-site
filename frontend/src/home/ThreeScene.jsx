import React, { useEffect, useRef } from 'react';

const ThreeScene = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef({
    particles: [],
    mouse: { x: 0, y: 0 },
    animationId: null
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scene = sceneRef.current;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -10;
        this.speed = Math.random() * 0.5 + 0.3;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
      }

      update(mouse) {
        // Move particle
        this.y += this.speed;
        this.x += this.vx;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          this.x -= dx * force * 0.03;
          this.y -= dy * force * 0.03;
        }

        // Reset if out of bounds
        if (this.y > this.canvas.height + 10 || 
            this.x < -10 || 
            this.x > this.canvas.width + 10) {
          this.reset();
        }
      }

      draw(ctx) {
        ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 8000));
    scene.particles = Array.from({ length: particleCount }, () => new Particle(canvas));

    // Mouse move handler
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      scene.mouse.x = e.clientX - rect.left;
      scene.mouse.y = e.clientY - rect.top;
    };

    // Touch handler for mobile
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        scene.mouse.x = e.touches[0].clientX - rect.left;
        scene.mouse.y = e.touches[0].clientY - rect.top;
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    // Geometric shape (rotating wireframe)
    let rotation = 0;
    const drawGeometry = (ctx, centerX, centerY) => {
      const size = 120;
      const points = 6;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // Outer hexagon
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const x = Math.cos(angle) * size;
        const y = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Inner hexagon
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
      ctx.beginPath();
      const innerSize = size * 0.6;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const x = Math.cos(angle) * innerSize;
        const y = Math.sin(angle) * innerSize;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Connecting lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const x1 = Math.cos(angle) * size;
        const y1 = Math.sin(angle) * size;
        const x2 = Math.cos(angle) * innerSize;
        const y2 = Math.sin(angle) * innerSize;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(18, 18, 26, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      scene.particles.forEach(particle => {
        particle.update(scene.mouse);
        particle.draw(ctx);
      });

      // Draw connections between nearby particles
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < scene.particles.length; i++) {
        for (let j = i + 1; j < scene.particles.length; j++) {
          const dx = scene.particles[i].x - scene.particles[j].x;
          const dy = scene.particles[i].y - scene.particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(scene.particles[i].x, scene.particles[i].y);
            ctx.lineTo(scene.particles[j].x, scene.particles[j].y);
            ctx.globalAlpha = (1 - distance / 100) * 0.2;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Draw central geometry
      drawGeometry(ctx, canvas.width / 2, canvas.height / 2);
      rotation += 0.005;

      scene.animationId = requestAnimationFrame(animate);
    };

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
        className="w-full h-full block bg-[#12121a]"
      ></canvas>
    </div>
  );
};

export default ThreeScene;
