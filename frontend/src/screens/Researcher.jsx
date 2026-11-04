import { useState } from 'react';

const ADMIN_TOKEN = 'urukais';

export default function ResearcherScreen() {
  const [token, setToken] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    if (token.trim() === ADMIN_TOKEN) {
      setAuthed(true);
      setError('');
    } else {
      setError('Token incorrecto');
    }
  }

  if (!authed) {
    return (
      <div className="card fade-in">
        <div className="badge">Restringido</div>
        <h2>Modo investigador</h2>
        <p className="subtitle">Acceso reservado. Introduce el token para continuar.</p>
        <form onSubmit={submit}>
          <input
            type="password"
            className="input"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="token"
          />
          {error && <p style={{ color: 'var(--danger)', fontSize: '.9rem', marginBottom: '1rem' }}>{error}</p>}
          <button className="btn" type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card">
        <div className="badge">Investigador</div>
        <h2>Panel de datos</h2>
        <p className="subtitle">Exportaciones completas en formato CSV, listas para análisis.</p>
        <div className="actions">
          <a className="btn" href="/api/export/decisions.csv" download>Descargar decisiones (.csv)</a>
          <a className="btn ghost" href="/api/export/users.csv" download>Descargar usuarios (.csv)</a>
        </div>
      </div>

      <div className="card">
        <h3>Endpoints disponibles</h3>
        <ul className="about-list">
          <li><code>/api/export/decisions.csv</code> — todas las decisiones</li>
          <li><code>/api/export/users.csv</code> — todos los usuarios</li>
          <li><code>/api/stats/global-categories</code> — distribución global</li>
          <li><code>/api/stats/role-categories</code> — por arquetipo</li>
          <li><code>/api/stats/top-cards</code> — cartas más desbloqueadas</li>
        </ul>
      </div>
    </div>
  );
}