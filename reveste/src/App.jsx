import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import { Container, Typography, Button, Box, Avatar } from '@mui/material';
import { useAppTheme } from './context/ThemeContext';

function App() {
  const { usuarioLogado, logout, isAuthenticated } = useAuth();
  const { toggleTheme, mode } = useAppTheme();

  // 1. Se não estiver autenticado, mostra a tela de Login
  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', pt: 4, bgcolor: 'background.default' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 4 }}>
          <Button variant="outlined" onClick={toggleTheme}>
            Tema: {mode.toUpperCase()}
          </Button>
        </Box>
        <Login />
      </Box>
    );
  }

  // 2. Se estiver autenticado, mostra o painel do usuário logado
  return (
    <Container maxWidth="sm" style={{ marginTop: '4rem', textAlign: 'center' }}>
      <Box p={4} boxShadow={3} bgcolor="background.paper" borderRadius={2}>
        {usuarioLogado.avatar && (
          <Avatar src={usuarioLogado.avatar} sx={{ width: 64, height: 64, mx: 'auto', mb: 2 }} />
        )}
        <Typography variant="h4" color="primary" gutterBottom>
          Olá, {usuarioLogado.nome}! 👋
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Você entrou com o e-mail: <strong>{usuarioLogado.email}</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Seu saldo atual: <strong>{usuarioLogado.vats} VATs</strong>
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="error" onClick={logout}>
            Fazer Logout (Sair)
          </Button>
          <Button variant="outlined" onClick={toggleTheme}>
            Mudar Tema
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default App;