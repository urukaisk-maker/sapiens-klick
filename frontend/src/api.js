const API_BASE = '/api';

async function jsonOrThrow(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export const getRoles = () => fetch(`${API_BASE}/roles`).then(jsonOrThrow);
export const getGlobalStats = () => fetch(`${API_BASE}/stats/global`).then(jsonOrThrow);
export const getRoleStats = () => fetch(`${API_BASE}/stats/roles`).then(jsonOrThrow);
export const getLeaderboard = () => fetch(`${API_BASE}/leaderboard`).then(jsonOrThrow);

export const createSession = (role, name) => {
  const q = name ? `?name=${encodeURIComponent(name)}` : '';
  return fetch(`${API_BASE}/session/${role}${q}`, { method: 'POST' }).then(jsonOrThrow);
};

export const getScenario = (role) => fetch(`${API_BASE}/scenario/${role}`).then(jsonOrThrow);
export const postDecision = (payload) =>
  fetch(`${API_BASE}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(jsonOrThrow);
export const getProfile = (id) => fetch(`${API_BASE}/profile/${id}`).then(jsonOrThrow);
export const getComparison = (id) => fetch(`${API_BASE}/stats/compare/${id}`).then(jsonOrThrow);
export const getUserByName = (name) =>
  fetch(`${API_BASE}/user/${encodeURIComponent(name)}`).then(jsonOrThrow);
export const getAllCards = () => fetch(`${API_BASE}/cards`).then(jsonOrThrow);
export const getCardsBatch = (userIds) =>
  fetch(`${API_BASE}/cards/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_ids: userIds }),
  }).then(jsonOrThrow);
export const getHistory = (userIds) =>
  fetch(`${API_BASE}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_ids: userIds }),
  }).then(jsonOrThrow);
  export const getGlobalCategoryStats = () =>
  fetch(`${API_BASE}/stats/global-categories`).then(jsonOrThrow);

export const getRoleCategoryStats = () =>
  fetch(`${API_BASE}/stats/role-categories`).then(jsonOrThrow);

export const getTopCards = () =>
  fetch(`${API_BASE}/stats/top-cards`).then(jsonOrThrow);
export const getAchievements = (name) =>
  fetch(`${API_BASE}/achievements/${encodeURIComponent(name)}`).then(jsonOrThrow);
export const getLeague = (name) =>
  fetch(`${API_BASE}/league/${encodeURIComponent(name)}`).then(jsonOrThrow);