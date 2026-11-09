import { useEffect, useState } from 'react';
import {
  getRoles, getGlobalStats, getRoleStats, getLeaderboard, createSession,
  getScenario, postDecision, getProfile, getComparison, getUserByName,
  getAllCards, getCardsBatch, getAchievements, getLeague,
  getBio, saveBio, getFavorites, addFavorite, removeFavorite, exportMyData,
  checkLegendary, getDailyChallenge, getDailyStatus, getDailyLeaderboard,
} from './api';
import StatsScreen from './screens/Stats';
import ResearcherScreen from './screens/Researcher';
import AchievementsScreen from './screens/Achievements';
import NotFound from './screens/NotFound';
import { SkeletonCard } from './components/Skeleton';
import { fireConfetti } from './utils/confetti';
import Avatar from './components/Avatar';
import Embers from './components/Embers';
import ShareCard from './components/ShareCard';
import { fireBlood } from './utils/bloodSplash';
import {
  isSoundEnabled, setSoundEnabled,
  playClick, playSlash, playVictory, playBlood,
} from './utils/sounds';

const LS_NAME = 'sapiens_klick_name';
const LS_ONBOARDED = 'sapiens_klick_onboarded';
const LS_LAST_USER = 'sapiens_klick_last_user';
const LS_HISTORY = 'sapiens_klick_history';
const LS_IN_PROGRESS = 'sapiens_klick_in_progress';
const LS_ACHIEVED = 'sapiens_klick_achieved';
const LS_THEME = 'sapiens_klick_theme';

const AGGRESSIVE_CATS = ['agresivo', 'traicion', 'ambicion'];

const APP_LINKS = {
  netlify: 'https://silly-boba-dc057e.netlify.app/',
  github: 'https://github.com/urukaisk-maker',
  repo: 'https://github.com/urukaisk-maker/sapiens-klick',
  developer: 'Manuel Casimiro Carrasco',
  alias: 'Urukais Klick',
};

const NAV_ITEMS = [
  { key: 'home', label: 'Inicio' },
  { key: 'daily', label: '🔥 Desafío' },
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

function Navigation({ current, onNavigate, userName, theme, onToggleTheme, soundOn, onToggleSound, installPrompt, onInstall }) {
  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => onNavigate('home')}>
        <div className="brand-mark" />
        <div className="brand-name">Urukais Klick</div>
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
        {installPrompt && (
          <button
            className="install-btn"
            onClick={onInstall}
            title="Instalar Urukais Klick como app"
          >
            📱 Instalar
          </button>
        )}
        <button
          className="sound-toggle"
          onClick={onToggleSound}
          title={soundOn ? 'Silenciar efectos' : 'Activar efectos'}
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
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
            <span>Urukais Klick</span>
          </div>
          <p className="footer-desc">
            Simulador de decisiones en las Tierras Oscuras. Encarna a un orco del clan
            Urukais Klick y descubre qué tipo de guerrero habita en ti.
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
        <span>© {year} Urukais Klick</span>
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
      <div className="badge">Bienvenido a la horda</div>
      <h1 style={{ marginBottom: '.6rem' }}>Urukais Klick</h1>
      <p className="subtitle">Simulador de decisiones en las Tierras Oscuras.</p>
      <p style={{ color: 'var(--muted)', marginBottom: '1.2rem', lineHeight: 1.6 }}>
        Aquí no hay dioses que te salven. Solo el filo de tu espada, la fuerza de tu
        brazo y la mirada del capitán. Tu nombre agrupará todas tus partidas y
        aparecerá en el leaderboard de la horda.
      </p>
      <label style={{ display: 'block', marginBottom: '.5rem', color: 'var(--muted)', fontSize: '.9rem' }}>
        ¿Cómo te llamas, orco?
      </label>
      <input
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="tu nombre o apodo de guerra"
        maxLength={64}
        onKeyDown={(e) => e.key === 'Enter' && onContinue(name.trim())}
      />
      <div className="actions">
        <button className="btn" onClick={() => onContinue(name.trim())}>
          {name.trim() ? 'Entrar en la horda' : 'Continuar anónimo'}
        </button>
      </div>
    </div>
  );
}

function DailyBanner({ onNavigate }) {
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    getDailyChallenge().then(setChallenge).catch(() => {});
  }, []);

  if (!challenge) return null;

  return (
    <div className="daily-banner">
      <div className="daily-banner-content">
        <span className="daily-banner-emoji">{challenge.emoji}</span>
        <div>
          <div className="daily-banner-title">
            🔥 Desafío del día: <strong>{challenge.role}</strong>
          </div>
          <div className="daily-banner-sub">
            {challenge.participants} orcos lo intentaron · {challenge.completed_count} lo completaron
          </div>
        </div>
      </div>
      <button className="btn small" onClick={() => onNavigate('daily')}>
        Ir al desafío
      </button>
    </div>
  );
}

function HomeScreen({ roles, globalStats, history, resume, onStart, onNavigate, onResume, onDiscard }) {
  return (
    <div className="fade-in">
      <section className="hero">
        <Embers />
        <div className="badge">Urukais Klick</div>
        <h1 className="hero-title">La horda que te define</h1>
        <p className="hero-subtitle">
          Encarna a un orco del clan Urukais Klick. Cinco decisiones en las Tierras
          Oscuras revelarán qué tipo de guerrero eres: leal o traidor, brutal o
          calculador, líder o carroña.
        </p>
        {globalStats && (
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{globalStats.total_users}</span>
              <span className="hero-stat-label">orcos</span>
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

      <DailyBanner onNavigate={onNavigate} />

      {resume && (
        <div className="banner">
          <span>
            🪓 Tienes una partida sin terminar: <strong>{resume.scenario.role}</strong> · Paso {resume.currentStep.step}/{resume.scenario.steps.length}
          </span>
          <div style={{ display: 'flex', gap: '.4rem' }}>
            <button className="btn small" onClick={onResume}>Continuar</button>
            <button className="btn ghost small" onClick={onDiscard}>Descartar</button>
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: '0.4rem' }}>Elige tu arquetipo</h2>
      <p className="subtitle">Cada rol es una senda distinta dentro de la horda.</p>

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
            <div className="how-step-title">Elige un orco</div>
            <div className="how-step-desc">Diez arquetipos, cada uno con su propia senda en la horda.</div>
          </div>
          <div className="how-step">
            <div className="how-step-num">02</div>
            <div className="how-step-title">Decide 5 veces</div>
            <div className="how-step-desc">Cada elección forja tu reputación y condiciona lo que viene.</div>
          </div>
          <div className="how-step">
            <div className="how-step-num">03</div>
            <div className="how-step-title">Conoce tu huella</div>
            <div className="how-step-desc">Perfil, comparativa, insight narrativo y una carta desbloqueable.</div>
          </div>
        </div>
      </section>

      {history.length > 0 && (
        <div className="banner" style={{ marginTop: '2rem' }}>
          <span>Has librado <strong>{history.length}</strong> {history.length === 1 ? 'batalla' : 'batallas'}.</span>
          <button className="btn ghost small" onClick={() => onNavigate('profile')}>Mi perfil</button>
        </div>
      )}
    </div>
  );
}

function DailyScreen({ userName, onStartDaily }) {
  const [challenge, setChallenge] = useState(null);
  const [status, setStatus] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      getDailyChallenge().catch(() => null),
      userName ? getDailyStatus(userName).catch(() => null) : Promise.resolve(null),
      getDailyLeaderboard().catch(() => null),
    ]).then(([c, s, l]) => {
      if (!active) return;
      setChallenge(c);
      setStatus(s);
      setLeaderboard(l);
      setLoading(false);
    });
    return () => { active = false; };
  }, [userName]);

  if (loading) {
    return (
      <div className="fade-in">
        <SkeletonCard />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="card fade-in">
        <div className="badge">Desafío</div>
        <h2>No disponible</h2>
        <p className="subtitle">No se pudo cargar el desafío del día. Inténtalo de nuevo más tarde.</p>
      </div>
    );
  }

  const completed = status?.completed;

  return (
    <div className="fade-in">
      <div className="card daily-hero">
        <div className="badge">Desafío del día · {challenge.date}</div>
        <div className="daily-emoji">{challenge.emoji}</div>
        <h1 style={{ marginBottom: '.4rem' }}>{challenge.role}</h1>
        <p className="subtitle" style={{ marginBottom: '.8rem' }}>{challenge.tagline}</p>
        <p className="daily-intro">{challenge.intro}</p>

        <div className="daily-meta">
          <div className="daily-meta-item">
            <span className="daily-meta-num">{challenge.participants}</span>
            <span className="daily-meta-label">orcos lo intentaron</span>
          </div>
          <div className="daily-meta-item">
            <span className="daily-meta-num">{challenge.completed_count}</span>
            <span className="daily-meta-label">lo completaron</span>
          </div>
          <div className="daily-meta-item">
            <span className="daily-meta-num">{challenge.threshold}</span>
            <span className="daily-meta-label">decisiones</span>
          </div>
        </div>

        {userName && completed ? (
          <div className="daily-completed">
            ✅ Ya completaste el desafío de hoy ({status.decisions_today}/{challenge.threshold})
          </div>
        ) : (
          <div className="actions" style={{ marginTop: '1rem' }}>
            <button className="btn" onClick={() => onStartDaily(challenge.role_key)}>
              🔥 Aceptar el desafío
            </button>
            {userName && status && (
              <span className="daily-progress">
                Progreso: {status.decisions_today}/{challenge.threshold}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <h3>🏆 Ranking del desafío</h3>
        <p className="subtitle">Top 10 orcos que han jugado hoy este rol.</p>
        {(!leaderboard || leaderboard.entries.length === 0) && (
          <p style={{ color: 'var(--muted)' }}>Nadie ha participado todavía. ¡Sé el primero!</p>
        )}
        {leaderboard && leaderboard.entries.map((e, i) => {
          const isMe = userName && e.name === userName;
          const posClass = i === 0 ? 'lb-pos-1' : i === 1 ? 'lb-pos-2' : i === 2 ? 'lb-pos-3' : '';
          return (
            <div key={e.name} className="leaderboard-row" style={isMe ? { background: 'rgba(212,169,90,.08)' } : {}}>
              <span className={`leaderboard-pos ${posClass}`}>#{i + 1}</span>
              <Avatar name={e.name} size={28} />
              <span className="leaderboard-name">{e.name}{isMe ? ' (tú)' : ''}</span>
              <span className="leaderboard-meta">
                {e.decisions} decisiones
                {e.decisions >= challenge.threshold && ' ✅'}
              </span>
            </div>
          );
        })}
      </div>
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
  const isLegendaryCard = unlockedCard && unlockedCard.key && unlockedCard.key.startsWith('legendary_');
  return (
    <>
      <div className="card fade-in">
        <div className="badge">Perfil de guerra</div>
        <h2>Tu huella en la horda</h2>
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
        <div className={`card card-unlock ${isLegendaryCard ? 'legendary' : ''}`}>
          {isLegendaryCard && <span className="legendary-badge">✦ Legendaria</span>}
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
          const isLegendary = c.key.startsWith('legendary_');
          return (
            <div
              key={c.key}
              className={`kcard ${unlocked ? '' : 'locked'} ${isLegendary ? 'legendary' : ''}`}
            >
              {unlocked && userName && (
                <button
                  className={`fav-btn ${isFav ? 'active' : ''}`}
                  onClick={(e) => toggleFav(c.key, e)}
                  title={isFav ? 'Quitar de favoritas' : 'Marcar como favorita'}
                >
                  {isFav ? '⭐' : '☆'}
                </button>
              )}
              {isLegendary && unlocked && (
                <span className="legendary-badge">✦ Legendaria</span>
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
        <div className="badge">Ranking de la horda</div>
        <h1 style={{ marginBottom: '.4rem' }}>Leaderboard</h1>
        <p className="subtitle">Top 10 orcos por decisiones totales.</p>
        {leaderboard.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>Nadie ha luchado todavía con nombre. ¡Sé el primero!</p>
        )}
        {leaderboard.map((l, i) => {
          const isMe = userName && l.name === userName;
          const posClass = i === 0 ? 'lb-pos-1' : i === 1 ? 'lb-pos-2' : i === 2 ? 'lb-pos-3' : '';
          return (
            <div key={l.name} className="leaderboard-row" style={isMe ? { background: 'rgba(212,169,90,.08)' } : {}}>
              <span className={`leaderboard-pos ${posClass}`}>#{i + 1}</span>
              <Avatar name={l.name} size={28} />
              <span className="leaderboard-name">{l.name}{isMe ? ' (tú)' : ''}</span>
              <span className="leaderboard-meta">{l.decisions} decisiones · {l.sessions} batallas</span>
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
        ? 'Todavía no hay batallas con este nombre.' : e.message))
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

  async function downloadData() {
    if (!name) return;
    try {
      const payload = await exportMyData(name);
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `urukais-${name}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      alert('No se pudieron descargar tus datos');
    }
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
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            {name && (
              <button
                className="btn ghost small"
                onClick={downloadData}
                title="Descargar todos mis datos (RGPD)"
              >
                📥 Descargar datos
              </button>
            )}
            <button className="btn ghost small" onClick={onEditName}>Cambiar nombre</button>
          </div>
        </div>

        {name && (
          <>
            {editingBio ? (
              <div style={{ marginTop: '1rem' }}>
                <textarea
                  className="bio-textarea"
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value.slice(0, 280))}
                  placeholder="Escribe tu historia de guerra (máx. 280 caracteres)…"
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
                {bio || 'Sin historia todavía. Pulsa "Editar" para escribir la tuya.'}
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
              <span><strong>{data.sessions_count}</strong> batallas</span>
              <span><strong>{data.decisions_count}</strong> decisiones</span>
              <span><strong>{data.cards_unlocked.length}</strong> cartas</span>
            </div>
            <h3 style={{ marginTop: '1.5rem' }}>Tus batallas</h3>
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
        <h3>📊 Comparativa entre arquetipos</h3>
        <p className="subtitle">Cómo decide cada rol de la horda a nivel global.</p>
        {roleStats.map((r) => (
          <div key={r.role} className="stat-row">
            <span>{r.role}</span>
            <span><strong>{r.sessions}</strong> batallas · <strong>{r.decisions}</strong> decisiones</span>
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
        <h1>¿Qué es Urukais Klick?</h1>
        <p className="about-text">
          Un simulador de decisiones ambientado en las Tierras Oscuras de Mordor, inspirado
          en el universo de <em>El Señor de los Anillos</em> de J.R.R. Tolkien. Encarnas a un
          orco del clan <strong>Urukais Klick</strong> y debes sobrevivir en un mundo donde
          no hay dioses, no hay moral y no hay segundas oportunidades.
        </p>
        <p className="about-text">
          Cada partida son cinco decisiones. Cada decisión te define. Al final obtienes:
        </p>
        <ul className="about-list">
          <li>Un <strong>perfil de guerra</strong> con tu categoría dominante.</li>
          <li>Una <strong>comparativa</strong> con otros orcos de tu mismo arquetipo.</li>
          <li>Un <strong>insight narrativo</strong> conectado con tu senda en la horda.</li>
          <li>Una <strong>carta de conocimiento</strong> desbloqueable (40 en total, 5 legendarias).</li>
        </ul>

        <div className="quote-box">
          "Los orcos no temen a la muerte. Temen morir sin gloria, sin nombre y sin
          que nadie recuerde su hazaña junto al fuego."
          <span className="quote-author">— Dicho del clan Urukais Klick</span>
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
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [showShare, setShowShare] = useState(false);
  const [shareLeague, setShareLeague] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);

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

  useEffect(() => {
    function handleBeforeInstall(e) {
      e.preventDefault();
      setInstallPrompt(e);
    }
    function handleInstalled() {
      setInstallPrompt(null);
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setInstallPrompt(null);
    }
  }

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClick();
  }

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
    playClick();
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

    if (AGGRESSIVE_CATS.includes(option.category)) {
      playSlash();
      document.body.classList.add('shake');
      setTimeout(() => document.body.classList.remove('shake'), 500);
    } else {
      playClick();
    }

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
          if (found) {
            if (AGGRESSIVE_CATS.includes(p.dominant)) {
              fireBlood();
              playBlood();
            } else {
              fireConfetti();
              playVictory();
            }
          }
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

        if (userName) {
          try { await checkLegendary(userName); } catch {}
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

  async function shareResult() {
    if (!profile) return;
    if (userName) {
      try {
        const l = await getLeague(userName);
        setShareLeague(l);
      } catch {
        setShareLeague(null);
      }
    } else {
      setShareLeague(null);
    }
    setShowShare(true);
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
    } else if (key === 'daily') {
      setPhase('daily');
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
            <div className="brand-name">Urukais Klick</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            {installPrompt && (
              <button
                className="install-btn"
                onClick={handleInstall}
                title="Instalar Urukais Klick como app"
              >
                📱 Instalar
              </button>
            )}
            <button
              className="sound-toggle"
              onClick={toggleSound}
              title={soundOn ? 'Silenciar efectos' : 'Activar efectos'}
            >
              {soundOn ? '🔊' : '🔇'}
            </button>
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
        soundOn={soundOn}
        onToggleSound={toggleSound}
        installPrompt={installPrompt}
        onInstall={handleInstall}
      />
      <main className="app-main">
        <div className="screen" key={phase}>
        {phase === 'home' && (
          <HomeScreen roles={roles} globalStats={globalStats} history={history}
            resume={resume} onStart={startRole} onNavigate={navigateTo}
            onResume={resumeGame} onDiscard={discardResume} />
        )}
        {phase === 'daily' && (
          <DailyScreen
            userName={userName}
            onStartDaily={async (rKey) => {
              const r = roles.find(x => x.key === rKey);
              if (r) await startRole(r);
            }}
          />
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

      {showShare && profile && (
        <ShareCard
          profile={profile}
          unlockedCard={unlockedCard}
          league={shareLeague}
          userName={userName}
          onClose={() => setShowShare(false)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}