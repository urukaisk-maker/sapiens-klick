export function SkeletonCard() {
  return (
    <div className="card skeleton-card">
      <div className="skeleton-line skeleton-line-lg" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-line-sm" />
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid-cards">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="kcard skeleton-card">
          <div className="skeleton-line skeleton-line-sm" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line-lg" />
        </div>
      ))}
    </div>
  );
}