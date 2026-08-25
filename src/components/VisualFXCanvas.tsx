import React, { useEffect, useRef } from 'react';

interface VisualFXProps {
  isGlitching?: boolean;
  dangerLevel?: number; // 0 to 1
}

export const VisualFXCanvas: React.FC<VisualFXProps> = ({ isGlitching = false, dangerLevel = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle pool for subterranean dust / ash
    const particles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.4 + 0.1,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle particles
      particles.forEach(p => {
        p.y += p.speed;
        if (p.y > canvas.height) {
          p.y = -5;
          p.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = `rgba(180, 195, 230, ${p.opacity})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      // Glitch / static noise line
      if (Math.random() < 0.12 || isGlitching) {
        ctx.fillStyle = isGlitching ? 'rgba(255, 56, 56, 0.12)' : 'rgba(255, 56, 56, 0.03)';
        const y = Math.random() * canvas.height;
        const height = Math.random() * 6 + 1;
        ctx.fillRect(0, y, canvas.width, height);
      }

      // Vignette / danger edge tint
      if (dangerLevel > 0.3) {
        const grad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          canvas.width * 0.3,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width * 0.8
        );
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, `rgba(184, 35, 35, ${Math.min(0.45, dangerLevel * 0.4)})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [isGlitching, dangerLevel]);

  return (
    <canvas
      ref={canvasRef}
      id="fx"
      className="fixed inset-0 pointer-events-none z-1 w-full h-full"
    />
  );
};
