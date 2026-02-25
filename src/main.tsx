import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.debug('[MC-Check] App starting. Env: VITE_SUPABASE_URL set =', !!import.meta.env.VITE_SUPABASE_URL, ', VITE_SUPABASE_ANON_KEY set =', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
