import { useEffect, useState } from 'react';
import { getGlobalCategoryStats, getRoleCategoryStats, getTopCards } from '../api';

export default function StatsScreen() {
  const [global, setGlobal] = useState([]);
  const [byRole, setByRole] = useState([]);
  const [topCards, setTopCards] = useState([]);

  useEffect(() => {
    getGlobalCategoryStats().then(setGlobal).catch(() => {});
    getRoleCategoryStats().then(setByRole).catch(() => {});
    getTopCards().then(setTopCards).catch(() => {});
  }, []);

  const maxGlobal = Math.max(1, ...global.map((g) => g.count));

  return (
    <div className="fade-in">
      <div className="card">
        <div className="badge">Estadísticas</div>
        <h1 style={{ marginBottom: '.4rem' }}>Lo que decidimos</h1>
        <p className="subtitle">
          Distribución agregada de todas las decisiones registradas en Sapiens Klick.
        </p>
      </div>

      <div className="card">
        <h3>Categorías más elegidas (global)</h3>
        {global.length === 0 && <p style={{ color: 'var(--muted)' }}>Sin datos todavía.</p>}
        {global.map((g) => (
          <div key={g.category}>
            <div className="stat-row">
              <span>{g.category}</span>
              <span><strong>{g.count}</strong> · {g.pct}%</span>
            </div>
            <div className="bar-wrap">
              <div className="bar-you" style={{ width: `${(g.count / maxGlobal) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Mapa de calor por arquetipo</h3>
        <p className="subtitle">Intensidad de cada categoría según el rol.</p>
        {byRole.length === 0 && <p style={{ color: 'var(--muted)' }}>Sin datos todavía.</p>}
        {byRole.map((r) => (
          <div key={r.role} style={{ marginBottom: '1.2rem' }}>
            <div className="stat-row"><span><strong>{r.role}</strong></span><span>{r.total} decisiones</span></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginTop: '.4rem' }}>
              {Object.entries(r.categories).sort((a, b) => b[1] - a[1]).map(([cat, pct]) => (
                <span
                  key={cat}
                  style={{
                    background: `rgba(212, 169, 90, ${0.1 + (pct / 100) * 0.7})`,
                    color: pct > 40 ? '#1a1a1a' : 'var(--text)',
                    padding: '.3rem .7rem',
                    borderRadius: 6,
                    fontSize: '.85rem',
                    fontWeight: 500,
                  }}
                >
                  {cat} · {pct}%
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Top 10 cartas desbloqueadas</h3>
        {topCards.length === 0 && <p style={{ color: 'var(--muted)' }}>Sin datos todavía.</p>}
        {topCards.map((c, i) => (
          <div key={c.card_key} className="leaderboard-row">
            <span className="leaderboard-pos">#{i + 1}</span>
            <span className="leaderboard-name">{c.emoji} {c.title}</span>
            <span className="leaderboard-meta">{c.count} desbloqueos</span>
          </div>
        ))}
      </div>
    </div>
  );
}