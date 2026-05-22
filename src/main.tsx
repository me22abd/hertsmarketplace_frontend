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
    {/* App shell uses full width; pages control their own max-width */}
    <div className="min-h-screen w-full safe-area-top safe-area-bottom">
      <App />
    </div>
  </React.StrictMode>
);
