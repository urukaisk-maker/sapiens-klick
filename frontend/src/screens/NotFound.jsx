export default function NotFound({ onHome }) {
  return (
    <div className="fade-in notfound">
      <div className="notfound-code">404</div>
      <h1>Esta ficción no existe</h1>
      <p className="subtitle">
        La página que buscas no forma parte de ningún orden imaginado.
      </p>
      <div className="actions">
        <button className="btn" onClick={onHome}>Volver al inicio</button>
      </div>
    </div>
  );
}