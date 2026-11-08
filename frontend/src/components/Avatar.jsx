const PALETTE = [
  '#d4a95a', '#e4bb72', '#6bcf7f', '#5b9bd5',
  '#c471ed', '#f77272', '#43c6ac', '#f6b93b',
  '#8e7cc3', '#e58e26',
];

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, size = 32, ring = false }) {
  const clean = (name || '').trim();
  const bg = clean ? PALETTE[hashCode(clean) % PALETTE.length] : '#4b4b57';
  const text = initials(clean);
  const fontSize = Math.round(size * 0.4);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${bg} 0%, ${bg}dd 100%)`,
        color: '#0e0e12',
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 700,
        fontSize,
        letterSpacing: 0,
        flexShrink: 0,
        boxShadow: ring ? `0 0 0 2px var(--surface), 0 0 0 3px ${bg}` : 'none',
        userSelect: 'none',
      }}
    >
      {text}
    </span>
  );
}