export function fireBlood() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#8b0000', '#a01f1f', '#5c0000', '#c43131', '#6e0f0f'];
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const drops = [];

  for (let i = 0; i < 70; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 12;
    drops.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 3 + Math.random() * 9,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
    });
  }

  let frame = 0;
  function anim() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drops.forEach((d) => {
      d.x += d.vx;
      d.y += d.vy;
      d.vy += 0.4;
      d.vx *= 0.985;
      d.rotation += d.vr;
      d.life -= 0.012;
      if (d.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, d.life);
      ctx.fillStyle = d.color;
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, d.size, d.size * 1.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(d.size * 0.6, d.size * 0.5, d.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    if (frame < 150) requestAnimationFrame(anim);
    else canvas.remove();
  }
  anim();
}