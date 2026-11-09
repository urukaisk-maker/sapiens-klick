import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const savedTheme = localStorage.getItem('sapiens_klick_theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Ocultar splash cuando React monta (con un pequeño delay mínimo para que se vea)
requestAnimationFrame(() => {
  const splash = document.getElementById('splash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('splash-hidden');
      setTimeout(() => {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
      }, 600);
    }, 300);
  }
});

// Registrar service worker solo en producción
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}