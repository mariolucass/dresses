import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { CustomThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { StoreProvider } from './context/StoreContext.jsx';
import { NegotiationProvider } from './context/NegotiationContext.jsx';
import { storageService } from './services/storageService.js';

storageService.init();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomThemeProvider>
        <AuthProvider>
          <StoreProvider>
            <NegotiationProvider>
              <App />
            </NegotiationProvider>
          </StoreProvider>
        </AuthProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);