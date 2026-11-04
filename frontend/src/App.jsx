import { useEffect, useState } from 'react';
import {
  getRoles, getGlobalStats, getRoleStats, getLeaderboard, createSession,
  getScenario, postDecision, getProfile, getComparison, getUserByName,
  getAllCards, getCardsBatch, getHistory,
} from './api';

const LS_NAME = 'sapiens_klick_name';
const LS_ONBOARDED = 'sapiens_klick_onboarded';
const LS_LAST_USER = 'sapiens_klick_last_user';
const LS_HISTORY = 'sapiens_klick_history';

const loadHistory = () => {
  try { return JSON.parse(localStorage.getItem(LS_HISTORY) || '[]'); }
  catch { return []; }
};

/* ---------- Shared ---------- */
function TopBar({ onHome, name, onProfile }) {
  return (
    <div className="topbar">
      <div className="brand" onClick={onHome}>
        <div className="brand-mark" />
        <div className="brand-name">Sapiens Klick</div>
      </div>
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        {name && <span className="user-chip" onClick={onProfile}>👤 {name}</span>}
      </div>
    </div>
  );
}

function ProgressBar({ current, total }) {
  return (
    <div className="progress">
      <div className="progress-fill" style={{ width: `${(current / total) * 100}%` }} />
    </div>
  );
}

/* ---------- Onboarding ---------- */
function OnboardingScreen({ onContinue }) {
  const [name, setName] = useState('');
  return (
    <div className="card fade-in">
      <div className="badge">Bienvenido</div>
      <h1 style={{ marginBottom: '.6rem' }}>Sapiens Klick</h1>
      <p className="subtitle">Simulador de las ficciones colectivas que nos gobiernan.</p>
      <p style={{ color: 'var(--muted)', marginBottom: '1.2rem', lineHeight: 1.6 }}>
        Tu nombre agrupará todas tus partidas, desbloquea el leaderboard y
        guarda tu perfil. Si prefieres el anonimato, deja vacío.
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

/* ---------- Home ---------- */
function HomeScreen({ roles, globalStats, leaderboard, history, onStart, onProfile }) {
  return (
    <div className="fade-in">
      <h1>Elige un arquetipo</h1>
      <p className="subtitle">
        Cada rol te sumerge en una "ficción colectiva" distinta. Tus decisiones
        se registran de forma anónima.
      </p>

      {globalStats && (
        <div className="meta">
          <span><strong>{globalStats.total_users}</strong> personas han jugado</span>
          <span><strong>{globalStats.total_decisions}</strong> decisiones registradas</span>
          <span><strong>{globalStats.total_cards}</strong> cartas desbloqueadas</span>
        </div>
      )}

      {history.length > 0 && (
        <div className="banner">
          <span>Has jugado <strong>{history.length}</strong> {history.length === 1 ? 'partida' : 'partidas'}.</span>
          <button className="btn ghost small" onClick={onProfile}>Mi perfil</button>
        </div>
      )}

      <div className="roles-grid">
        {roles.map((r) => (
          <button key={r.key} className="role-card" onClick={() => onStart(r)}>
            <div className="role-emoji">{r.emoji}</div>
            <div className="role-title">{r.role}</div>
            <div className="role-tagline">{r.tagline}</div>
          </button>
        ))}
      </div>

      {leaderboard.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3>🏆 Leaderboard</h3>
          <p className="subtitle">Top jugadores por decisiones totales.</p>
          {leaderboard.slice(0, 5).map((l, i) => (
            <div key={l.name} className="leaderboard-row">
              <span className="leaderboard-pos">#{i + 1}</span>
              <span className="leaderboard-name">{l.name}</span>
              <span className="leaderboard-meta">{l.decisions} decisiones · {l.sessions} partidas</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Playing ---------- */
function ScenarioScreen({ scenario, currentStep, submitting, onChoose }) {
  const step = scenario.steps[currentStep];
  const total = scenario.steps.length;
  return (
    <div className="card fade-in" key={currentStep}>
      <ProgressBar current={currentStep} total={total} />
      <div className="step-label">
        <span>Paso {currentStep + 1} de {total}</span>
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

/* ---------- Result ---------- */
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
        {profile.insight && (
          <div className="insight-box"><p>{profile.insight}</p></div>
        )}
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

/* ---------- Collection ---------- */
function CollectionScreen({ allCards, unlockedCards, onBack }) {
  return (
    <div className="card fade-in">
      <h2>Mi colección</h2>
      <p className="subtitle">{unlockedCards.length} de {allCards.length} cartas desbloqueadas</p>
      <div className="grid-cards">
        {allCards.map((c) => {
          const unlocked = unlockedCards.includes(c.key);
          return (
            <div key={c.key} className={`kcard ${unlocked ? '' : 'locked'}`}>
              <div className="kcard-emoji">{c.emoji}</div>
              <div className="kcard-title">{c.title}</div>
              <div className="kcard-body">
                {unlocked ? c.body : 'Sigue explorando arquetipos para desbloquear esta carta.'}
              </div>
            </div>
          );
        })}
      </div>
      <div className="actions">
        <button className="btn" onClick={onBack}>Volver al inicio</button>
      </div>
    </div>
  );
}

/* ---------- Profile ---------- */
function ProfileScreen({ name, roleStats, leaderboard, onBack, onEditName }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    setError('');
    getUserByName(name)
      .then(setData)
      .catch((e) => setError(e.message.includes('404') ? 'Todavía no hay sesiones con este nombre.' : e.message))
      .finally(() => setLoading(false));
  }, [name]);

  const myPosition = leaderboard.findIndex((l) => l.name === name) + 1;

  return (
    <div className="fade-in">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge">Perfil</div>
            <h2 style={{ marginBottom: '.2rem' }}>{name || 'Anónimo'}</h2>
            {myPosition > 0 && (
              <p className="subtitle" style={{ marginBottom: 0 }}>🏆 Posición #{myPosition} en el leaderboard</p>
            )}
          </div>
          <button className="btn ghost small" onClick={onEditName}>Cambiar nombre</button>
        </div>

        {loading && <p style={{ marginTop: '1rem' }}>Cargando…</p>}
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

      <div className="actions">
        <button className="btn" onClick={onBack}>Volver al inicio</button>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [phase, setPhase] = useState('home');
  const [onboarded, setOnboarded] = useState(false);
  const [userName, setUserName] = useState('');
  const [roles, setRoles] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [roleStats, setRoleStats] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [scenario, setScenario] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [unlockedCard, setUnlockedCard] = useState(null);
  const [allCards, setAllCards] = useState([]);
  const [userCards, setUserCards] = useState([]);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const n = localStorage.getItem(LS_NAME) || '';
    const ob = localStorage.getItem(LS_ONBOARDED) === '1';
    setUserName(n);
    setOnboarded(ob);
    const last = localStorage.getItem(LS_LAST_USER);
    if (last) setUserId(Number(last));
    setHistory(loadHistory());

    getRoles().then(setRoles).catch(() => {});
    getGlobalStats().then(setGlobalStats).catch(() => {});
    getRoleStats().then(setRoleStats).catch(() => {});
    getLeaderboard().then(setLeaderboard).catch(() => {});
  }, []);

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
    setUserId(s.user_id);
    localStorage.setItem(LS_LAST_USER, String(s.user_id));
    setCurrentStep(0);
    setProfile(null);
    setComparison(null);
    setUnlockedCard(null);
    setPhase('playing');
  }

  async function choose(option) {
    if (submitting) return;
    setSubmitting(true);
    try {
      await postDecision({
        user_id: userId,
        step: scenario.steps[currentStep].step,
        choice: option.value,
        category: option.category,
      });
      const next = currentStep + 1;
      if (next >= scenario.steps.length) {
        const [p, comp] = await Promise.all([getProfile(userId), getComparison(userId)]);
        setProfile(p);
        setComparison(comp);
        if (p.card_unlocked) {
          const cards = await getAllCards();
          setUnlockedCard(cards.find((c) => c.key === p.card_unlocked) || null);
        }
        // Persistir en historial local
        const current = loadHistory();
        if (!current.find((h) => h.user_id === userId)) {
          const nextHist = [...current, { user_id: userId, role: scenario.role, date: new Date().toISOString() }];
          localStorage.setItem(LS_HISTORY, JSON.stringify(nextHist));
          setHistory(nextHist);
        }
        setPhase('done');
        getGlobalStats().then(setGlobalStats).catch(() => {});
        getRoleStats().then(setRoleStats).catch(() => {});
        getLeaderboard().then(setLeaderboard).catch(() => {});
      } else {
        setCurrentStep(next);
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
    const text = `He jugado Sapiens Klick como ${profile.role}. Mi categoría dominante: ${profile.dominant}. ¿Y tú cómo decides?`;
    navigator.clipboard.writeText(text)
      .then(() => { setToast('Resultado copiado'); setTimeout(() => setToast(''), 2200); })
      .catch(() => { setToast('No se pudo copiar'); setTimeout(() => setToast(''), 2200); });
  }

  function goHome() {
    setPhase('home');
    setScenario(null);
    setCurrentStep(0);
    setProfile(null);
    setComparison(null);
    setUnlockedCard(null);
  }

  if (!onboarded) {
    return (
      <div className="app">
        <div className="topbar"><div className="brand"><div className="brand-mark" /><div className="brand-name">Sapiens Klick</div></div></div>
        <OnboardingScreen onContinue={handleOnboarding} />
      </div>
    );
  }

  return (
    <div className="app">
      <TopBar onHome={goHome} name={userName} onProfile={() => setPhase('profile')} />

      {phase === 'home' && (
        <HomeScreen
          roles={roles} globalStats={globalStats} leaderboard={leaderboard}
          history={history} onStart={startRole}
          onProfile={() => setPhase('profile')}
        />
      )}

      {phase === 'playing' && scenario && (
        <ScenarioScreen
          scenario={scenario} currentStep={currentStep}
          submitting={submitting} onChoose={choose}
        />
      )}

      {phase === 'done' && profile && (
        <ResultScreen
          profile={profile} comparison={comparison} unlockedCard={unlockedCard}
          onRestart={goHome} onCollection={openCollection} onShare={shareResult}
        />
      )}

      {phase === 'collection' && (
        <CollectionScreen allCards={allCards} unlockedCards={userCards} onBack={goHome} />
      )}

      {phase === 'profile' && (
        <ProfileScreen
          name={userName} roleStats={roleStats} leaderboard={leaderboard}
          onBack={goHome} onEditName={editName}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}