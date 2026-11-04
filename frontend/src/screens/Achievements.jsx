import { useEffect, useState } from 'react';
import { getAchievements, getLeague } from '../api';

export default function AchievementsScreen({ userName }) {
  const [data, setData] = useState(null);
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userName) return;
    setLoading(true);
    Promise.all([getAchievements(userName), getLeague(userName).catch(() => null)])
      .then(([a, l]) => { setData(a); setLeague(l); })
      .catch(() => {})
      .finally(() => setLoading(false));
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

  const visible = data.achievements.filter((a) => !a.secret);
  const secrets = data.achievements.filter((a) => a.secret);
  const unlockedVisible = visible.filter((a) => a.unlocked).length;
  const totalVisible = visible.length;

  return (
    <div className="fade-in">
      <div className="card">
        <div className="badge">Logros</div>
        <h1 style={{ marginBottom: '.4rem' }}>Tu progreso</h1>
        <p className="subtitle">
          {unlockedVisible} de {totalVisible} logros + {secrets.length} secretos descubiertos
          {data.streak > 0 && (
            <> · <strong style={{ color: 'var(--accent)' }}>🔥 Racha de {data.streak} {data.streak === 1 ? 'día' : 'días'}</strong></>
          )}
        </p>
      </div>

      {league && (
        <div className="league-card">
          <div className="league-emoji">{league.current.emoji}</div>
          <div className="league-info">
            <div className="league-name" style={{ color: league.current.color }}>
              Liga {league.current.name}
            </div>
            <div className="league-meta">
              {league.decisions_count} decisiones totales
              {league.next && <> · {league.to_next} para subir a {league.next.emoji} {league.next.name}</>}
            </div>
            <div className="league-progress">
              <div
                className="league-progress-fill"
                style={{
                  width: `${league.progress_pct}%`,
                  background: `linear-gradient(90deg, ${league.current.color}, ${league.next ? league.next.color : league.current.color})`,
                }}
              />
            </div>
            {league.next && (
              <div className="league-next">{league.progress_pct}% hacia {league.next.name}</div>
            )}
          </div>
        </div>
      )}

      <div className="grid-cards">
        {visible.map((a) => (
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
                }}>✓</span>
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

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3>🔮 Secretos ({secrets.length} / 10)</h3>
        <p className="subtitle">Logros ocultos que se revelan al desbloquearlos.</p>
        {secrets.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>Aún no has descubierto ninguno. Sigue explorando.</p>
        )}
      </div>

      {secrets.length > 0 && (
        <div className="grid-cards">
          {secrets.map((a) => (
            <div key={a.key} className="kcard secret-marker unlocked">
              <div className="kcard-emoji" style={{ fontSize: '2rem' }}>{a.emoji}</div>
              <div className="kcard-title">{a.title}</div>
              <div className="kcard-body">{a.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}