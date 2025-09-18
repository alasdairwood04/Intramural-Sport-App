// alasdairwood04/intramural-sport-app/Intramural-Sport-App-99e1da5415a846419501e81dab912798cc11b8c9/client/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/index.css'; // Assuming you move index.css to assets
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);