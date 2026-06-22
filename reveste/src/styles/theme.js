import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode) => createTheme({
  palette: {
    mode: mode, // 'light' ou 'dark'
    primary: {
      main: mode === 'light' ? '#2e7d32' : '#4caf50', // Verde
    },
    secondary: {
      main: '#9c27b0', // Roxo
    },
    background: {
      default: mode === 'light' ? '#fcfcfc' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    button: {
      textTransform: 'none', // Remove o caixa-alta obrigatório dos botões do MUI
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8, // Bordas suavemente arredondadas
  },
});