import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Register a very small service worker for PWA installability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .catch(() => {
        // Silent fail – app should work fine without SW
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* App shell centers content, caps width, and respects iOS safe areas */}
    <div className="w-full max-w-md flex-1 safe-area-top safe-area-bottom">
      <App />
    </div>
  </React.StrictMode>
);
