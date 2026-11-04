import { useEffect, useState } from 'react';
import { getAchievements } from '../api';

export default function AchievementsScreen({ userName }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userName) return;
    setLoading(true);
    getAchievements(userName).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [userName]);

  if (!userName) {
    return (
      <div className="card fade-in">
        <div className="badge">Logros</div>
        <h2>Necesitas un nombre</h2>
        <p className="subtitle">Configura un nombre en tu perfil para empezar a desbloquear logros.</p>
      </div>
    );
  }

  if (loading) return <div className="card">Cargando logros…</div>;
  if (!data) return <div className="card">Sin datos.</div>;

  const unlocked = data.achievements.filter((a) => a.unlocked).length;
  const total = data.achievements.length;

  return (
    <div className="fade-in">
      <div className="card">
        <div className="badge">Logros</div>
        <h1 style={{ marginBottom: '.4rem' }}>Tu progreso</h1>
        <p className="subtitle">
          {unlocked} de {total} logros desbloqueados
          {data.streak > 0 && (
            <> · <strong style={{ color: 'var(--accent)' }}>🔥 Racha de {data.streak} {data.streak === 1 ? 'día' : 'días'}</strong></>
          )}
        </p>
        <div className="meta">
          <span><strong>{data.metrics.sessions || 0}</strong> partidas</span>
          <span><strong>{data.metrics.distinct_roles || 0}</strong>/8 roles</span>
          <span><strong>{data.metrics.cards || 0}</strong> cartas</span>
          <span><strong>{data.metrics.decisions || 0}</strong> decisiones</span>
        </div>
      </div>

      <div className="grid-cards">
        {data.achievements.map((a) => (
          <div key={a.key} className={`kcard ${a.unlocked ? '' : 'locked'}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="kcard-emoji" style={{ fontSize: '2rem' }}>{a.emoji}</div>
              {a.unlocked && (
                <span style={{
                  background: 'var(--accent)',
                  color: '#1a1a1a',
                  fontSize: '.7rem',
                  fontWeight: 700,
                  padding: '.15rem .5rem',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                }}>
                  ✓
                </span>
              )}
            </div>
            <div className="kcard-title">{a.title}</div>
            <div className="kcard-body">{a.desc}</div>
            <div className="achievement-progress">
              <div className="achievement-bar">
                <div className="achievement-fill" style={{ width: `${a.pct}%` }} />
              </div>
              <div className="achievement-count">{a.current} / {a.target}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}