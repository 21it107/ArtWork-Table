import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'primereact/resources/themes/saga-blue/theme.css'; // Theme
import 'primereact/resources/primereact.min.css';         // Core CSS
import 'primeicons/primeicons.css';                      // Icons
import './styles/global.css';                            // Global styles

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);