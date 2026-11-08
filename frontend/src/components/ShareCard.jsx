import { useEffect, useRef } from 'react';

export default function ShareCard({ profile, unlockedCard, league, userName, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 1080, H = 1350;
    canvas.width = W;
    canvas.height = H;

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#1a0f0a');
    bg.addColorStop(1, '#0e0604');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 80; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const r = Math.random() * 3 + 1;
      const alpha = Math.random() * 0.4;
      ctx.fillStyle = `rgba(212, 169, 90, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = '#d4a95a';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    ctx.fillStyle = '#d4a95a';
    ctx.font = 'bold 42px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('URUKAIS KLICK', W / 2, 140);

    ctx.fillStyle = '#eae9f0';
    ctx.font = 'bold 78px Georgia, serif';
    ctx.fillText(profile.role, W / 2, 300);

    ctx.fillStyle = '#a08560';
    ctx.font = '36px system-ui, sans-serif';
    ctx.fillText('Categoría dominante', W / 2, 400);

    ctx.fillStyle = '#d4a95a';
    ctx.font = 'bold 66px system-ui, sans-serif';
    ctx.fillText((profile.dominant || '').toUpperCase(), W / 2, 480);

    ctx.fillStyle = 'rgba(212, 169, 90, 0.08)';
    ctx.fillRect(120, 560, W - 240, 280);
    ctx.strokeStyle = 'rgba(212, 169, 90, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(120, 560, W - 240, 280);

    ctx.fillStyle = '#e6dfd0';
    ctx.font = 'italic 28px Georgia, serif';
    ctx.textAlign = 'left';
    const insight = profile.insight || '';
    const maxWidth = W - 280;
    const words = insight.split(' ');
    let line = '';
    let y = 620;
    for (const word of words) {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, 140, y);
        line = word + ' ';
        y += 40;
        if (y > 800) break;
      } else {
        line = test;
      }
    }
    if (line && y <= 800) ctx.fillText(line, 140, y);

    if (unlockedCard) {
      ctx.fillStyle = '#d4a95a';
      ctx.font = 'bold 32px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦ CARTA DESBLOQUEADA', W / 2, 920);

      ctx.font = '80px system-ui, sans-serif';
      ctx.fillText(unlockedCard.emoji, W / 2, 1010);

      ctx.fillStyle = '#eae9f0';
      ctx.font = 'bold 38px Georgia, serif';
      ctx.fillText(unlockedCard.title, W / 2, 1070);
    }

    if (league) {
      ctx.fillStyle = league.current.color;
      ctx.font = 'bold 34px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${league.current.emoji} ${league.current.name}`, W / 2, 1180);
    }

    ctx.fillStyle = '#6b5544';
    ctx.font = '24px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(userName ? `— ${userName} —` : 'La horda que te define', W / 2, 1270);
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText('silly-boba-dc057e.netlify.app', W / 2, 1305);
  }, [profile, unlockedCard, league, userName]);

  function download() {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `urukais-${(profile.role || 'orco').replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  async function copyToClipboard() {
    const canvas = canvasRef.current;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        alert('Imagen copiada al portapapeles');
      } catch {
        alert('Tu navegador no permite copiar imágenes. Usa "Descargar PNG".');
      }
    });
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.88)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflow: 'auto',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', maxWidth: '100%' }}
      >
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: '100%',
            maxHeight: '68vh',
            border: '1px solid var(--border)',
            borderRadius: 8,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
          }}
        />
        <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn" onClick={download}>⬇ Descargar PNG</button>
          <button className="btn ghost" onClick={copyToClipboard}>📋 Copiar imagen</button>
          <button className="btn ghost" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}