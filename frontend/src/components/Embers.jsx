import { useEffect, useRef } from 'react';

export default function Embers() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    const embers = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 200,
      size: Math.random() * 2.5 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 1.2 - 0.4,
      life: Math.random() * 0.6 + 0.4,
      hue: 15 + Math.random() * 25,
    }));

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      embers.forEach((e) => {
        e.x += e.vx;
        e.y += e.vy;
        e.life -= 0.0025;
        if (e.y < -20 || e.life <= 0) {
          e.x = Math.random() * canvas.width;
          e.y = canvas.height + 10;
          e.life = 0.6 + Math.random() * 0.4;
          e.vy = -Math.random() * 1.2 - 0.4;
          e.vx = (Math.random() - 0.5) * 0.4;
        }
        const alpha = Math.max(0, e.life) * 0.75;
        const r = e.size * 3;
        const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, r);
        grad.addColorStop(0, `hsla(${e.hue}, 100%, 70%, ${alpha})`);
        grad.addColorStop(0.5, `hsla(${e.hue}, 100%, 55%, ${alpha * 0.5})`);
        grad.addColorStop(1, `hsla(${e.hue}, 100%, 45%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        mixBlendMode: 'screen',
      }}
    />
  );
}