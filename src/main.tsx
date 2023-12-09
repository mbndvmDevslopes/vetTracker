import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { ToastContainer } from 'react-toastify';
import { CurrentUserProvider } from './providers/CurrentUserProvider.tsx';
import { ConditionsProvider } from './providers/ConditionsProvider.tsx';
 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CurrentUserProvider>
      <ConditionsProvider>
        <App />
        <ToastContainer position="top-center" />
      </ConditionsProvider>
    </CurrentUserProvider>
  </React.StrictMode>
);
