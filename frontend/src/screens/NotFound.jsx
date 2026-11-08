export default function NotFound({ onHome }) {
  return (
    <div className="fade-in notfound">
      <div className="notfound-code">404</div>
      <h1>Esta senda no existe</h1>
<p className="subtitle">
  La página que buscas se ha perdido en las Tierras Oscuras.
</p>
      <div className="actions">
        <button className="btn" onClick={onHome}>Volver al inicio</button>
      </div>
    </div>
  );
}