import { useEffect, useState } from 'react';
import {
  getRoles, getGlobalStats, getRoleStats, getLeaderboard, createSession,
  getScenario, postDecision, getProfile, getComparison, getUserByName,
  getAllCards, getCardsBatch, getAchievements, getLeague,
  getBio, saveBio, getFavorites, addFavorite, removeFavorite,
} from './api';
import StatsScreen from './screens/Stats';
import ResearcherScreen from './screens/Researcher';
import AchievementsScreen from './screens/Achievements';
import NotFound from './screens/NotFound';
import { SkeletonCard } from './components/Skeleton';
import { fireConfetti } from './utils/confetti';
import Avatar from './components/Avatar';

const LS_NAME = 'sapiens_klick_name';
const LS_ONBOARDED = 'sapiens_klick_onboarded';
const LS_LAST_USER = 'sapiens_klick_last_user';
const LS_HISTORY = 'sapiens_klick_history';
const LS_IN_PROGRESS = 'sapiens_klick_in_progress';
const LS_ACHIEVED = 'sapiens_klick_achieved';
const LS_THEME = 'sapiens_klick_theme';

const APP_LINKS = {
  netlify: 'https://silly-boba-dc057e.netlify.app/',
  github: 'https://github.com/urukaisk-maker',
  repo: 'https://github.com/urukaisk-maker/sapiens-klick',
  developer: 'Manuel Casimiro Carrasco',
  alias: 'Urukais Klick',
};

const NAV_ITEMS = [
  { key: 'home', label: 'Inicio' },
  { key: 'collection', label: 'Colección' },
  { key: 'leaderboard', label: 'Leaderboard' },
  { key: 'achievements', label: 'Logros' },
  { key: 'stats', label: 'Stats' },
  { key: 'profile', label: 'Perfil' },
  { key: 'about', label: 'Acerca' },
];

const loadHistory = () => {
  try { return JSON.parse(localStorage.getItem(LS_HISTORY) || '[]'); }
  catch { return []; }
};

const loadInProgress = () => {
  try {
    const raw = localStorage.getItem(LS_IN_PROGRESS);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const saveInProgress = (state) => {
  try { localStorage.setItem(LS_IN_PROGRESS, JSON.stringify(state)); } catch {}
};

const clearInProgress = () => {
  localStorage.removeItem(LS_IN_PROGRESS);
};

/* ============ Layout ============ */

function Navigation({ current, onNavigate, userName, theme, onToggleTheme }) {
  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => onNavigate('home')}>
        <div className="brand-mark" />
        <div className="brand-name">Sapiens Klick</div>
      </div>
      <div className="nav-links">
        {NAV_ITEMS.map((it) => (
          <button
            key={it.key}
            className={`nav-link ${current === it.key ? 'active' : ''}`}
            onClick={() => onNavigate(it.key)}
          >
            {it.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {userName && (
          <span
            className="user-chip"
            onClick={() => onNavigate('profile')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem' }}
          >
            <Avatar name={userName} size={24} />
            {userName}
          </span>
        )}
      </div>
    </nav>
  );
}

function Footer({ onNavigate }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="footer-brand">
            <div className="brand-mark small" />
            <span>Sapiens Klick</span>
          </div>
          <p className="footer-desc">
            Simulador interactivo de las ficciones colectivas que nos gobiernan.
            Inspirado en <em>Sapiens: De animales a dioses</em> de Yuval Noah Harari.
          </p>
        </div>
        <div className="footer-col">
          <h5>Navegar</h5>
          <ul>
            {NAV_ITEMS.map((it) => (
              <li key={it.key}>
                <a onClick={() => onNavigate(it.key)}>{it.label}</a>
              </li>
            ))}
            <li><a onClick={() => onNavigate('researcher')} style={{ opacity: 0.6 }}>Investigador</a></li>
            <li><a onClick={() => onNavigate('notfound')} style={{ opacity: 0.35, fontSize: '0.78rem' }}>404</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Proyecto</h5>
          <ul>
            <li><a href={APP_LINKS.netlify} target="_blank" rel="noopener noreferrer">Demo ↗</a></li>
            <li><a href={APP_LINKS.github} target="_blank" rel="noopener noreferrer">Autor ↗</a></li>
            <li><a href={APP_LINKS.repo} target="_blank" rel="noopener noreferrer">Repositorio ↗</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {year} Sapiens Klick</span>
        <span>Desarrollado por <strong>{APP_LINKS.developer}</strong></span>
        <span>{APP_LINKS.alias}</span>
      </div>
    </footer>
  );
}

function ProgressBar({ current, total }) {
  return (
    <div className="progress">
      <div className="progress-fill" style={{ width: `${(current / total) * 100}%` }} />
    </div>
  );
}

/* ============ Screens ============ */

function OnboardingScreen({ onContinue }) {
  const [name, setName] = useState('');
  return (
    <div className="card fade-in">
      <div className="badge">Bienvenido</div>
      <h1 style={{ marginBottom: '.6rem' }}>Sapiens Klick</h1>
      <p className="subtitle">Simulador de las ficciones colectivas que nos gobiernan.</p>
      <p style={{ color: 'var(--muted)', marginBottom: '1.2rem', lineHeight: 1.6 }}>
        Tu nombre agrupará todas tus partidas, desbloquea el leaderboard y guarda tu perfil.
        Si prefieres el anonimato, déjalo vacío.
      </p>
      <label style={{ display: 'block', marginBottom: '.5rem', color: 'var(--muted)', fontSize: '.9rem' }}>
        ¿Cómo te llamas?
      </label>
      <input
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="tu nombre o apodo"
        maxLength={64}
        onKeyDown={(e) => e.key === 'Enter' && onContinue(name.trim())}
      />
      <div className="actions">
        <button className="btn" onClick={() => onContinue(name.trim())}>
          {name.trim() ? 'Empezar' : 'Continuar anónimo'}
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ roles, globalStats, history, resume, onStart, onNavigate, onResume, onDiscard }) {
  return (
    <div className="fade-in">
      <section className="hero">
        <div className="badge">Sapiens Klick</div>
        <h1 className="hero-title">Las ficciones que nos gobiernan</h1>
        <p className="hero-subtitle">
          Elige un arquetipo, toma cinco decisiones y descubre cómo tu forma de
          decidir se conecta con las narrativas que sostienen la civilización.
        </p>
        {globalStats && (
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{globalStats.total_users}</span>
              <span className="hero-stat-label">jugadores</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{globalStats.total_decisions}</span>
              <span className="hero-stat-label">decisiones</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{globalStats.total_cards}</span>
              <span className="hero-stat-label">cartas</span>
            </div>
          </div>
        )}
      </section>

      {resume && (
        <div className="banner">
          <span>
            🎮 Tienes una partida sin terminar: <strong>{resume.scenario.role}</strong> · Paso {resume.currentStep.step}/{resume.scenario.steps.length}
          </span>
          <div style={{ display: 'flex', gap: '.4rem' }}>
            <button className="btn small" onClick={onResume}>Continuar</button>
            <button className="btn ghost small" onClick={onDiscard}>Descartar</button>
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: '0.4rem' }}>Elige un arquetipo</h2>
      <p className="subtitle">Cada rol es una "ficción colectiva" distinta.</p>

      <div className="roles-grid">
        {roles.map((r) => (
          <button key={r.key} className="role-card" onClick={() => onStart(r)}>
            <div className="role-emoji">{r.emoji}</div>
            <div className="role-title">{r.role}</div>
            <div className="role-tagline">{r.tagline}</div>
          </button>
        ))}
      </div>

      <section style={{ marginTop: '3rem' }}>
        <h2>Cómo funciona</h2>
        <div className="how-it-works">
          <div className="how-step">
            <div className="how-step-num">01</div>
            <div className="how-step-title">Elige un rol</div>
            <div className="how-step-desc">Ocho arquetipos, cada uno con su propia lógica de decisión.</div>
          </div>
          <div className="how-step">
            <div className="how-step-num">02</div>
            <div className="how-step-title">Decide 5 veces</div>
            <div className="how-step-desc">Tus elecciones condicionan lo que viene después.</div>
          </div>
          <div className="how-step">
            <div className="how-step-num">03</div>
            <div className="how-step-title">Descubre tu huella</div>
            <div className="how-step-desc">Perfil, comparativa, insight narrativo y una carta desbloqueable.</div>
          </div>
        </div>
      </section>

      {history.length > 0 && (
        <div className="banner" style={{ marginTop: '2rem' }}>
          <span>Has jugado <strong>{history.length}</strong> {history.length === 1 ? 'partida' : 'partidas'}.</span>
          <button className="btn ghost small" onClick={() => onNavigate('profile')}>Mi perfil</button>
        </div>
      )}
    </div>
  );
}

function ScenarioScreen({ scenario, step, submitting, onChoose }) {
  const total = scenario.steps.length;
  return (
    <div className="card fade-in" key={step.step}>
      <ProgressBar current={step.step - 1} total={total} />
      <div className="step-label">
        <span>Paso {step.step} de {total}</span>
        <span>{scenario.role}</span>
      </div>
      <p className="intro">{scenario.intro}</p>
      <p className="question">{step.question}</p>
      {step.options.map((o) => (
        <button key={o.value} className="option-btn" onClick={() => onChoose(o)} disabled={submitting}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ResultScreen({ profile, comparison, unlockedCard, onRestart, onCollection, onShare }) {
  return (
    <>
      <div className="card fade-in">
        <div className="badge">Perfil conductual</div>
        <h2>Tu huella</h2>
        <div className="meta">
          <span>Rol: <strong>{profile.role}</strong></span>
          <span>Decisiones: <strong>{profile.total_decisions}</strong></span>
          <span>Dominante: <strong>{profile.dominant}</strong></span>
        </div>
        {profile.insight && <div className="insight-box"><p>{profile.insight}</p></div>}
      </div>

      {comparison && (
        <div className="card fade-in">
          <h3>Tú vs. otros {comparison.role}s</h3>
          <p className="subtitle" style={{ marginBottom: '1rem' }}>Muestra: {comparison.sample_size} decisiones</p>
          {Object.keys(comparison.aggregate_pct).sort().map((cat) => (
            <div key={cat}>
              <div className="stat-row">
                <span>{cat}</span>
                <span>tú <strong>{comparison.your_pct[cat] || 0}%</strong> · media <strong>{comparison.aggregate_pct[cat]}%</strong></span>
              </div>
              <div className="bar-wrap">
                <div className="bar-agg" style={{ width: `${comparison.aggregate_pct[cat]}%` }} />
                <div className="bar-you" style={{ width: `${comparison.your_pct[cat] || 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {unlockedCard && (
        <div className="card card-unlock">
          <div className="badge">✦ Carta desbloqueada</div>
          <h3>{unlockedCard.emoji} {unlockedCard.title}</h3>
          <p style={{ color: 'var(--muted)', lineHeight: 1.65 }}>{unlockedCard.body}</p>
        </div>
      )}

      <div className="actions">
        <button className="btn" onClick={onRestart}>Volver a empezar</button>
        <button className="btn ghost" onClick={onCollection}>Mi colección</button>
        <button className="btn ghost" onClick={onShare}>Compartir</button>
      </div>
    </>
  );
}

function CollectionScreen({ allCards, unlockedCards, userName }) {
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!userName) return;
    getFavorites(userName)
      .then((d) => setFavorites(d.favorites || []))
      .catch(() => {});
  }, [userName]);

  async function toggleFav(cardKey, e) {
    e.stopPropagation();
    if (!userName) return;
    const isFav = favorites.includes(cardKey);
    setFavorites((prev) =>
      isFav ? prev.filter((k) => k !== cardKey) : [...prev, cardKey]
    );
    try {
      if (isFav) await removeFavorite(userName, cardKey);
      else await addFavorite(userName, cardKey);
    } catch {
      setFavorites((prev) =>
        isFav ? [...prev, cardKey] : prev.filter((k) => k !== cardKey)
      );
    }
  }

  const filtered = allCards.filter((c) => {
    const unlocked = unlockedCards.includes(c.key);
    const isFav = favorites.includes(c.key);
    if (filter === 'fav') return isFav;
    if (filter === 'unlocked') return unlocked;
    return true;
  });

  return (
    <div className="fade-in">
      <div className="card">
        <div className="badge">Colección</div>
        <h1 style={{ marginBottom: '.4rem' }}>Mis cartas</h1>
        <p className="subtitle">
          {unlockedCards.length} de {allCards.length} cartas desbloqueadas ·{' '}
          {favorites.length} favoritas
        </p>
        <div className="fav-header">
          <div className="fav-filter">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button
              className={filter === 'unlocked' ? 'active' : ''}
              onClick={() => setFilter('unlocked')}
            >
              Desbloqueadas
            </button>
            <button
              className={filter === 'fav' ? 'active' : ''}
              onClick={() => setFilter('fav')}
            >
              ⭐ Favoritas
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--muted)' }}>
          {filter === 'fav'
            ? 'Aún no has marcado ninguna carta como favorita. Pulsa ⭐ en cualquier carta.'
            : 'No hay cartas que coincidan con este filtro.'}
        </div>
      )}

      <div className="grid-cards">
        {filtered.map((c) => {
          const unlocked = unlockedCards.includes(c.key);
          const isFav = favorites.includes(c.key);
          return (
            <div key={c.key} className={`kcard ${unlocked ? '' : 'locked'}`}>
              {unlocked && userName && (
                <button
                  className={`fav-btn ${isFav ? 'active' : ''}`}
                  onClick={(e) => toggleFav(c.key, e)}
                  title={isFav ? 'Quitar de favoritas' : 'Marcar como favorita'}
                >
                  {isFav ? '⭐' : '☆'}
                </button>
              )}
              <div className="kcard-emoji">{c.emoji}</div>
              <div className="kcard-title">{c.title}</div>
              <div className="kcard-body">
                {unlocked ? c.body : 'Sigue explorando arquetipos para desbloquear esta carta.'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeaderboardScreen({ leaderboard, userName }) {
  return (
    <div className="fade-in">
      <div className="card">
        <div className="badge">Ranking</div>
        <h1 style={{ marginBottom: '.4rem' }}>Leaderboard</h1>
        <p className="subtitle">Top 10 jugadores por decisiones totales.</p>
        {leaderboard.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>Nadie ha jugado todavía con nombre. ¡Sé el primero!</p>
        )}
        {leaderboard.map((l, i) => {
          const isMe = userName && l.name === userName;
          const posClass = i === 0 ? 'lb-pos-1' : i === 1 ? 'lb-pos-2' : i === 2 ? 'lb-pos-3' : '';
          return (
            <div key={l.name} className="leaderboard-row" style={isMe ? { background: 'rgba(212,169,90,.08)' } : {}}>
              <span className={`leaderboard-pos ${posClass}`}>#{i + 1}</span>
              <Avatar name={l.name} size={28} />
              <span className="leaderboard-name">{l.name}{isMe ? ' (tú)' : ''}</span>
              <span className="leaderboard-meta">{l.decisions} decisiones · {l.sessions} partidas</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfileScreen({ name, roleStats, leaderboard, onEditName }) {
  const [data, setData] = useState(null);
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');
  const [savingBio, setSavingBio] = useState(false);

  useEffect(() => {
    if (!name) {
      setError('Estás jugando como anónimo. Configura un nombre para tener perfil persistente.');
      return;
    }
    setLoading(true);
    setError('');
    getUserByName(name)
      .then(setData)
      .catch((e) => setError(e.message.includes('404')
        ? 'Todavía no hay sesiones con este nombre.' : e.message))
      .finally(() => setLoading(false));
    getLeague(name).then(setLeague).catch(() => {});
    getBio(name).then((d) => setBio(d.bio || '')).catch(() => {});
  }, [name]);

  async function saveBioChanges() {
    if (!name) return;
    setSavingBio(true);
    try {
      const d = await saveBio(name, bioDraft);
      setBio(d.bio || '');
      setEditingBio(false);
    } catch {} finally {
      setSavingBio(false);
    }
  }

  function startEditBio() {
    setBioDraft(bio);
    setEditingBio(true);
  }

  const myPosition = name ? leaderboard.findIndex((l) => l.name === name) + 1 : 0;

  return (
    <div className="fade-in">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge">Perfil</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '.6rem', marginBottom: '.4rem' }}>
              <Avatar name={name} size={56} ring />
              <h1 style={{ marginBottom: '.2rem' }}>
                {name || 'Anónimo'}
                {league && (
                  <span className="league-badge" style={{ color: league.current.color }}>
                    {league.current.emoji} {league.current.name}
                  </span>
                )}
              </h1>
            </div>
            {myPosition > 0 && (
              <p className="subtitle" style={{ marginBottom: 0 }}>🏆 Posición #{myPosition} en el leaderboard</p>
            )}
          </div>
          <button className="btn ghost small" onClick={onEditName}>Cambiar nombre</button>
        </div>

        {name && (
          <>
            {editingBio ? (
              <div style={{ marginTop: '1rem' }}>
                <textarea
                  className="bio-textarea"
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value.slice(0, 280))}
                  placeholder="Escribe una bio breve (máx. 280 caracteres)…"
                  maxLength={280}
                />
                <div className="bio-counter">{bioDraft.length} / 280</div>
                <div className="actions" style={{ marginTop: '.5rem' }}>
                  <button
                    className="btn small"
                    onClick={saveBioChanges}
                    disabled={savingBio}
                  >
                    {savingBio ? 'Guardando…' : 'Guardar'}
                  </button>
                  <button
                    className="btn ghost small"
                    onClick={() => setEditingBio(false)}
                    disabled={savingBio}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className={`bio-box ${bio ? '' : 'empty'}`} style={{ marginTop: '1rem' }}>
                {bio || 'Sin bio todavía. Pulsa "Editar" para añadir una.'}
                <button className="bio-edit-btn" onClick={startEditBio}>Editar</button>
              </div>
            )}
          </>
        )}

        {loading && <div style={{ marginTop: '1rem' }}><SkeletonCard /></div>}
        {error && <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>{error}</p>}

        {data && (
          <>
            <div className="meta" style={{ marginTop: '1rem' }}>
              <span><strong>{data.sessions_count}</strong> partidas</span>
              <span><strong>{data.decisions_count}</strong> decisiones</span>
              <span><strong>{data.cards_unlocked.length}</strong> cartas</span>
            </div>
            <h3 style={{ marginTop: '1.5rem' }}>Tus partidas</h3>
            {data.sessions.length === 0 && <p style={{ color: 'var(--muted)' }}>Ninguna todavía.</p>}
            {data.sessions.map((s, i) => (
              <div key={s.user_id} className="history-item">
                <div>
                  <div className="history-role">{s.role}</div>
                  <div className="history-meta">
                    {new Date(s.created_at).toLocaleString('es-ES')} · {s.decisions} decisiones
                  </div>
                </div>
                <div className="history-num">#{data.sessions.length - i}</div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="card">
        <h3>📊 Comparativa entre roles</h3>
        <p className="subtitle">Cómo decide cada arquetipo a nivel global.</p>
        {roleStats.map((r) => (
          <div key={r.role} className="stat-row">
            <span>{r.role}</span>
            <span><strong>{r.sessions}</strong> partidas · <strong>{r.decisions}</strong> decisiones</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutScreen() {
  return (
    <div className="fade-in">
      <div className="card">
        <div className="badge">Acerca</div>
        <h1>¿Qué es Sapiens Klick?</h1>
        <p className="about-text">
          Un simulador interactivo inspirado en <em>Sapiens: De animales a dioses</em>, el libro
          de Yuval Noah Harari. La tesis central del libro es que los humanos dominamos el
          planeta porque podemos creer —y hacer creer a otros— en ficciones colectivas:
          dioses, naciones, dinero, empresas.
        </p>
        <p className="about-text">
          Sapiens Klick convierte esa tesis en experiencia: eliges un arquetipo y te enfrentas
          a cinco dilemas. Al final obtienes:
        </p>
        <ul className="about-list">
          <li>Un <strong>perfil conductual</strong> con tu categoría dominante.</li>
          <li>Una <strong>comparativa</strong> con otros jugadores del mismo rol.</li>
          <li>Un <strong>insight narrativo</strong> conectado con un tema de Sapiens.</li>
          <li>Una <strong>carta de conocimiento</strong> desbloqueable (35 en total).</li>
        </ul>

        <div className="quote-box">
          "Los sapiens pueden cooperar de manera muy flexible con un número ilimitado de
          extraños gracias a las historias que inventan y creen."
          <span className="quote-author">— Yuval Noah Harari, <em>Sapiens</em></span>
        </div>
      </div>

      <div className="card">
        <h3>Sobre el autor</h3>
        <p className="about-text">
          <strong>{APP_LINKS.developer}</strong>, también conocido como <strong>{APP_LINKS.alias}</strong>.
        </p>
        <div className="actions">
          <a className="btn" href={APP_LINKS.netlify} target="_blank" rel="noopener noreferrer">Ver demo ↗</a>
          <a className="btn ghost" href={APP_LINKS.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a className="btn ghost" href={APP_LINKS.repo} target="_blank" rel="noopener noreferrer">Repositorio ↗</a>
        </div>
      </div>

      <div className="card">
        <h3>Stack técnico</h3>
        <div className="tech-grid">
          <div className="tech-item"><span className="tech-label">Backend</span><span className="tech-value">Python + FastAPI</span></div>
          <div className="tech-item"><span className="tech-label">Frontend</span><span className="tech-value">React + Vite</span></div>
          <div className="tech-item"><span className="tech-label">Base de datos</span><span className="tech-value">PostgreSQL 16</span></div>
          <div className="tech-item"><span className="tech-label">Infraestructura</span><span className="tech-value">Docker Compose</span></div>
        </div>
      </div>
    </div>
  );
}

/* ============ App ============ */

export default function App() {
  const [phase, setPhase] = useState('home');
  const [onboarded, setOnboarded] = useState(false);
  const [userName, setUserName] = useState('');
  const [roles, setRoles] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [roleStats, setRoleStats] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [scenario, setScenario] = useState(null);
  const [roleKey, setRoleKey] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [unlockedCard, setUnlockedCard] = useState(null);
  const [allCards, setAllCards] = useState([]);
  const [userCards, setUserCards] = useState([]);
  const [history, setHistory] = useState([]);
  const [resume, setResume] = useState(null);
  const [toast, setToast] = useState('');
  const [theme, setTheme] = useState(() =>
    localStorage.getItem(LS_THEME) || 'dark'
  );

  useEffect(() => {
    const n = localStorage.getItem(LS_NAME) || '';
    const ob = localStorage.getItem(LS_ONBOARDED) === '1';
    setUserName(n);
    setOnboarded(ob);
    const last = localStorage.getItem(LS_LAST_USER);
    if (last) setUserId(Number(last));
    setHistory(loadHistory());
    setResume(loadInProgress());

    getRoles().then(setRoles).catch(() => {});
    getGlobalStats().then(setGlobalStats).catch(() => {});
    getRoleStats().then(setRoleStats).catch(() => {});
    getLeaderboard().then(setLeaderboard).catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(LS_THEME, theme);
  }, [theme]);

  function handleOnboarding(name) {
    localStorage.setItem(LS_ONBOARDED, '1');
    if (name) localStorage.setItem(LS_NAME, name);
    else localStorage.removeItem(LS_NAME);
    setUserName(name);
    setOnboarded(true);
    setPhase('home');
  }

  function editName() {
    localStorage.removeItem(LS_ONBOARDED);
    localStorage.removeItem(LS_NAME);
    setOnboarded(false);
    setUserName('');
    setPhase('home');
  }

  async function startRole(r) {
    const s = await createSession(r.key, userName || undefined);
    const sc = await getScenario(r.key);
    setScenario(sc);
    setRoleKey(r.key);
    setUserId(s.user_id);
    localStorage.setItem(LS_LAST_USER, String(s.user_id));
    setCurrentStep(sc.steps[0]);
    setProfile(null);
    setComparison(null);
    setUnlockedCard(null);
    clearInProgress();
    setResume(null);
    setPhase('playing');
  }

  async function choose(option) {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await postDecision({
        user_id: userId,
        step: currentStep.step,
        choice: option.value,
        category: option.category,
      });

      if (result.next_step) {
        setCurrentStep(result.next_step);
        saveInProgress({
          userId,
          roleKey,
          scenario,
          currentStep: result.next_step,
          savedAt: new Date().toISOString(),
        });
      } else {
        const [p, comp] = await Promise.all([getProfile(userId), getComparison(userId)]);
        setProfile(p);
        setComparison(comp);
        if (p.card_unlocked) {
          const cards = await getAllCards();
          const found = cards.find((c) => c.key === p.card_unlocked) || null;
          setUnlockedCard(found);
          if (found) fireConfetti();
        }
        const current = loadHistory();
        if (!current.find((h) => h.user_id === userId)) {
          const nextHist = [...current, { user_id: userId, role: scenario.role, date: new Date().toISOString() }];
          localStorage.setItem(LS_HISTORY, JSON.stringify(nextHist));
          setHistory(nextHist);
        }

        if (userName) {
          try {
            const aData = await getAchievements(userName);
            const nowUnlocked = aData.achievements.filter(x => x.unlocked).map(x => x.key);
            const previouslyUnlocked = JSON.parse(localStorage.getItem(LS_ACHIEVED) || '[]');
            const newOnes = nowUnlocked.filter(k => !previouslyUnlocked.includes(k));
            localStorage.setItem(LS_ACHIEVED, JSON.stringify(nowUnlocked));
            if (newOnes.length > 0) {
              const first = aData.achievements.find(a => a.key === newOnes[0]);
              setToast(`🏆 ¡Logro desbloqueado: ${first.emoji} ${first.title}!`);
              setTimeout(() => setToast(''), 3500);
            }
          } catch {}
        }

        clearInProgress();
        setResume(null);
        setPhase('done');
        getGlobalStats().then(setGlobalStats).catch(() => {});
        getRoleStats().then(setRoleStats).catch(() => {});
        getLeaderboard().then(setLeaderboard).catch(() => {});
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function openCollection() {
    const [all, mine] = await Promise.all([
      getAllCards(),
      getCardsBatch(loadHistory().map((h) => h.user_id)),
    ]);
    setAllCards(all);
    setUserCards(mine.unlocked);
    setPhase('collection');
  }

  function shareResult() {
    if (!profile) return;
    const text = `He jugado Sapiens Klick como ${profile.role}. Mi categoría dominante: ${profile.dominant}. ¿Y tú cómo decides? ${APP_LINKS.netlify}`;
    navigator.clipboard.writeText(text)
      .then(() => { setToast('Resultado copiado'); setTimeout(() => setToast(''), 2200); })
      .catch(() => { setToast('No se pudo copiar'); setTimeout(() => setToast(''), 2200); });
  }

  function resumeGame() {
    if (!resume) return;
    setUserId(resume.userId);
    setRoleKey(resume.roleKey);
    setScenario(resume.scenario);
    setCurrentStep(resume.currentStep);
    setProfile(null);
    setComparison(null);
    setUnlockedCard(null);
    setResume(null);
    setPhase('playing');
  }

  function discardResume() {
    clearInProgress();
    setResume(null);
  }

  function navigateTo(key) {
    if (key === 'home') {
      setPhase('home');
      setScenario(null);
      setCurrentStep(null);
      setProfile(null);
      setComparison(null);
      setUnlockedCard(null);
    } else if (key === 'collection') {
      openCollection();
    } else if (key === 'leaderboard') {
      setPhase('leaderboard');
    } else if (key === 'achievements') {
      setPhase('achievements');
    } else if (key === 'stats') {
      setPhase('stats');
    } else if (key === 'profile') {
      setPhase('profile');
    } else if (key === 'about') {
      setPhase('about');
    } else if (key === 'researcher') {
      setPhase('researcher');
    } else if (key === 'notfound') {
      setPhase('notfound');
    }
  }

  const goHome = () => navigateTo('home');

  if (!onboarded) {
    return (
      <div className="app">
        <nav className="nav">
          <div className="nav-brand">
            <div className="brand-mark" />
            <div className="brand-name">Sapiens Klick</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>
        <main className="app-main">
          <OnboardingScreen onContinue={handleOnboarding} />
        </main>
        <Footer onNavigate={() => {}} />
      </div>
    );
  }

  const navCurrent = ['playing', 'done'].includes(phase) ? 'home' : phase;

  return (
    <div className="app">
      <Navigation
        current={navCurrent}
        onNavigate={navigateTo}
        userName={userName}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <main className="app-main">
        <div className="screen" key={phase}>
        {phase === 'home' && (
          <HomeScreen roles={roles} globalStats={globalStats} history={history}
            resume={resume} onStart={startRole} onNavigate={navigateTo}
            onResume={resumeGame} onDiscard={discardResume} />
        )}
        {phase === 'playing' && scenario && currentStep && (
          <ScenarioScreen scenario={scenario} step={currentStep}
            submitting={submitting} onChoose={choose} />
        )}
        {phase === 'done' && profile && (
          <ResultScreen profile={profile} comparison={comparison} unlockedCard={unlockedCard}
            onRestart={goHome} onCollection={openCollection} onShare={shareResult} />
        )}
        {phase === 'collection' && (
          <CollectionScreen
            allCards={allCards}
            unlockedCards={userCards}
            userName={userName}
          />
        )}
        {phase === 'leaderboard' && (
          <LeaderboardScreen leaderboard={leaderboard} userName={userName} />
        )}
        {phase === 'achievements' && (
          <AchievementsScreen userName={userName} />
        )}
        {phase === 'stats' && <StatsScreen />}
        {phase === 'profile' && (
          <ProfileScreen name={userName} roleStats={roleStats}
            leaderboard={leaderboard} onEditName={editName} />
        )}
        {phase === 'about' && <AboutScreen />}
        {phase === 'researcher' && <ResearcherScreen />}
        {phase === 'notfound' && <NotFound onHome={goHome} />}
        </div>
      </main>
      <Footer onNavigate={navigateTo} />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}