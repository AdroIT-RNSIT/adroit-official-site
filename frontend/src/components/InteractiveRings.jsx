import React, { useState, useEffect, useRef } from 'react';

const InteractiveBall = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0.5, y: 0.5 });
  const [color, setColor] = useState('from-sky-500 to-sky-600');
  const [hitColor, setHitColor] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ballRef = useRef(null);
  const [containerSize, setContainerSize] = useState(325);
  const animationRef = useRef(null);
  const timeoutRef = useRef(null);

  const colors = [
    'from-sky-500 to-sky-600',
    'from-sky-600 to-blue-700',
    'from-blue-600 to-sky-700',
  ];

  const hitEffectColors = [
    'bg-gradient-to-r from-sky-500 to-sky-600',
    'bg-gradient-to-r from-sky-600 to-blue-700',
    'bg-gradient-to-r from-blue-600 to-sky-700',
  ];

  useEffect(() => {
    const updateSize = () => {
      const container = document.querySelector('.hero-ring-container');
      if (container) {
        const width = container.clientWidth;
        setContainerSize(width / 2);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = document.querySelector('.home-root');
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let lastTime = 0;
    const FPS = 60;
    const interval = 1000 / FPS;

    const moveBall = (time) => {
      if (time - lastTime >= interval) {
        setPosition(prev => {
          let newX = prev.x + velocity.x;
          let newY = prev.y + velocity.y;
          let newVx = velocity.x;
          let newVy = velocity.y;

          if (newX > containerSize - 15 || newX < -containerSize + 15) {
            newVx = -newVx * (0.9 + Math.random() * 0.2);
            newX = newX > 0 ? containerSize - 15 : -containerSize + 15;
          }
          if (newY > containerSize - 15 || newY < -containerSize + 15) {
            newVy = -newVy * (0.9 + Math.random() * 0.2);
            newY = newY > 0 ? containerSize - 15 : -containerSize + 15;
          }

          if (Math.random() < 0.01) {
            newVx += (Math.random() - 0.5) * 0.5;
            newVy += (Math.random() - 0.5) * 0.5;
          }

          const speed = Math.sqrt(newVx * newVx + newVy * newVy);
          if (speed > 2) {
            newVx = (newVx / speed) * 2;
            newVy = (newVy / speed) * 2;
          }

          const ballX = newX + containerSize;
          const ballY = newY + containerSize;
          const cursorX = mousePosition.x + containerSize;
          const cursorY = mousePosition.y + containerSize;
          
          const distance = Math.sqrt(
            Math.pow(ballX - cursorX, 2) + Math.pow(ballY - cursorY, 2)
          );

          if (distance < 50 && !hitColor) {
            const newColor = colors[Math.floor(Math.random() * colors.length)];
            setColor(newColor);
            
            const effectColor = hitEffectColors[Math.floor(Math.random() * hitEffectColors.length)];
            setHitColor(effectColor);
            
            newVx = -newVx * 1.5;
            newVy = -newVy * 1.5;
            
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
              setHitColor(null);
            }, 2000 + Math.random() * 1000);
          }

          setVelocity({ x: newVx, y: newVy });
          return { x: newX, y: newY };
        });
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(moveBall);
    };

    animationRef.current = requestAnimationFrame(moveBall);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [velocity, mousePosition, hitColor, containerSize]);

  const trailSizes = ['w-2 h-2', 'w-1.5 h-1.5', 'w-1 h-1'];
  const trailOpacities = ['opacity-30', 'opacity-20', 'opacity-10'];

  return (
    <>
      <div 
        ref={ballRef}
        className={`absolute w-6 h-6 rounded-full bg-gradient-to-r ${color} shadow-[0_0_20px_8px_rgba(34,211,238,0.4)] transition-all duration-300 pointer-events-auto cursor-pointer`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: '50%',
          top: '50%',
          zIndex: 20,
        }}
      >
        <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-60"></div>
        <div className="absolute -inset-3 rounded-full bg-current opacity-20 blur-md"></div>
      </div>

      {hitColor && (
        <>
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * (Math.PI / 180);
            const distance = 30 + Math.random() * 20;
            return (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${hitColor} animate-hit-particle`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(${position.x + Math.cos(angle) * distance}px, ${position.y + Math.sin(angle) * distance}px)`,
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0.7,
                }}
              />
            );
          })}
          <div 
            className={`absolute rounded-full border-2 ${hitColor.replace('bg-gradient-to-r', 'border-gradient-to-r')} animate-ripple`}
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(${position.x}px, ${position.y}px)`,
              width: '0px',
              height: '0px',
            }}
          />
        </>
      )}

      {[...Array(3)].map((_, i) => (
        <div
          key={`trail-${i}`}
          className={`absolute ${trailSizes[i]} rounded-full bg-gradient-to-r ${color} ${trailOpacities[i]} animate-trail`}
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(${position.x - velocity.x * (i + 1) * 10}px, ${position.y - velocity.y * (i + 1) * 10}px)`,
            animationDelay: `${i * 0.05}s`,
            zIndex: 19 - i,
          }}
        />
      ))}

      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <path
          d="M325,325 Q200,200 400,100 Q500,200 250,400 Q100,500 300,300"
          fill="none"
          stroke="url(#spiralGradient)"
          strokeWidth="0.5"
          strokeDasharray="2 3"
        />
      </svg>
    </>
  );
};

export default function InteractiveRings({ className = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100%,70vmin)] max-w-[650px]" }) {
  return (
    <div className={`hero-ring-container aspect-square pointer-events-none z-0 px-4 ${className}`}>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 w-full h-full rounded-full bg-sky-600/5 blur-[20px] animate-pulse-glow"></div>
        <div className="absolute w-full h-full border border-sky-600/20 rounded-full animate-spin-slow shadow-[0_0_30px_5px_rgba(2,132,199,0.08)]"></div>
        <div className="absolute w-[70%] h-[70%] top-[15%] left-[15%] border border-slate-400/25 rounded-full animate-spin-slower-reverse"></div>
        <div className="absolute w-[40%] h-[40%] top-[30%] left-[30%] border border-sky-600/15 rounded-full animate-spin-slowest"></div>

        <div className="absolute inset-0 animate-move-spiral">
          <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-600 shadow-[0_0_15px_5px_rgba(2,132,199,0.25)]">
            <div className="absolute inset-0 rounded-full bg-white animate-ping"></div>
          </div>
        </div>

        <div className="absolute inset-0 animate-move-spiral-trail-1">
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/50"></div>
        </div>
        <div className="absolute inset-0 animate-move-spiral-trail-2">
          <div className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-500/40"></div>
        </div>
        <div className="absolute inset-0 animate-move-spiral-trail-3">
          <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-600/30"></div>
        </div>

        <InteractiveBall />
      </div>
    </div>
  );
}
