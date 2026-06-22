import { createContext, useContext, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createAppTheme } from '../styles/theme';

const CustomThemeContext = createContext();

export function CustomThemeProvider({ children }) {
  // Salva a preferência do tema no localStorage
  const [mode, setMode] = useLocalStorage('reveste_theme_mode', 'light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Recalcula o tema do MUI apenas quando o modo mudar
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <CustomThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        {/* Reset de CSS padrão do Material Design e muda o fundo de acordo com o tema */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
}

// Hook para usar o tema facilmente em qualquer botão de switch
export const useAppTheme = () => useContext(CustomThemeContext);