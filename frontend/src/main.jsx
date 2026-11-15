import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import i18n from './i18n/config';
import './styles/tokens.css';
import './styles/base.css';
import './styles/desk.css';
import './styles/paper.css';

function syncDocumentLanguage(lang) {
  const shortLang = (lang || 'en').split('-')[0];
  document.documentElement.lang = shortLang;
  const isIndic = shortLang === 'hi' || shortLang === 'mr';
  let link = document.getElementById('edunova-indic-fonts');
  if (isIndic && !link) {
    link = document.createElement('link');
    link.id = 'edunova-indic-fonts';
    link.rel = 'stylesheet';
    link.href = '/fonts/indic.css';
    document.head.appendChild(link);
  }
}

syncDocumentLanguage(i18n.language);
i18n.on('languageChanged', syncDocumentLanguage);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Register Service Worker for PWA & Offline Readiness (P2-12.2)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (reg) => console.log('⚡ StemEdu ServiceWorker registered: ', reg.scope),
      (err) => console.log('ServiceWorker registration failed: ', err)
    );
  });
}

