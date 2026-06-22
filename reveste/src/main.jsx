import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CustomThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { StoreProvider } from './context/StoreContext.jsx'; // Importado
import { storageService } from './services/storageService.js';

storageService.init();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </AuthProvider>
    </CustomThemeProvider>
  </React.StrictMode>
);