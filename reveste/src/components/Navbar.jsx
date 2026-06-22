import { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, IconButton, 
  Drawer, List, ListItem, ListItemButton, ListItemText, Divider 
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  const { usuarioLogado, logout, isAuthenticated } = useAuth();
  const { mode, toggleTheme } = useAppTheme();
  const navigate = useNavigate();
  
  // Estado para controlar a abertura do menu lateral no celular
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false); // Fecha o menu lateral se estiver aberto
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Gerencia os links dinamicamente com base na autenticação
  const menuItems = [
    { label: 'Explorar', path: '/explore' },
    ...(isAuthenticated ? [
      { label: 'Minha Garagem', path: '/garage' },
      { label: 'Meu Perfil', path: '/profile' }
    ] : [])
  ];

  // CONTEÚDO DO MENU LATERAL (MOBILE)
  const drawerContent = (
    <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%', pt: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ px: 2, mb: 1, color: 'primary.main' }}>
        ReVeste ♻️
      </Typography>
      
      {/* Se estiver logado, mostra o saldo de VATs dentro do menu do celular */}
      {isAuthenticated && (
        <Box sx={{ px: 2, mb: 2 }}>
          <Box sx={{ bgcolor: 'secondary.main', color: 'white', px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 'bold', fontSize: '0.85rem', display: 'inline-block' }}>
            {usuarioLogado?.vats} VATs
          </Box>
        </Box>
      )}

      <Divider />

      {/* Lista de Links no Celular */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton onClick={() => { navigate(item.path); handleDrawerToggle(); }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Botão de Sair ou Entrar na parte inferior do menu do celular */}
      <Box sx={{ p: 2 }}>
        {isAuthenticated ? (
          <Button 
            fullWidth 
            variant="outlined" 
            color="error" 
            startIcon={<LogoutIcon />} 
            onClick={handleLogout}
          >
            Sair
          </Button>
        ) : (
          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            onClick={() => { navigate('/login'); handleDrawerToggle(); }}
          >
            Entrar
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1} color="default">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          
          {/* LADO ESQUERDO: Logo e Links de Navegação (Desktop) */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              sx={{ textDecoration: 'none', fontWeight: 'bold', color: 'primary.main', mr: 4 }}
            >
              ReVeste ♻️
            </Typography>

            {/* Links visíveis apenas no Computador (sm em diante) */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
              {menuItems.map((item) => (
                <Button key={item.label} component={Link} to={item.path} color="inherit">
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* LADO DIREITO: Tema, VATs e Autenticação (Desktop) / Hambúrguer (Mobile) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            
            {/* O botão de alternar tema fica sempre visível no topo, tanto celular quanto PC */}
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {/* Ações visíveis apenas no Computador (sm em diante) */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              {isAuthenticated ? (
                <>
                  <Box sx={{ bgcolor: 'secondary.main', color: 'white', px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {usuarioLogado?.vats} VATs
                  </Box>
                  <IconButton onClick={handleLogout} color="error" title="Sair">
                    <LogoutIcon />
                  </IconButton>
                </>
              ) : (
                <Button component={Link} to="/login" variant="contained" color="primary">
                  Entrar
                </Button>
              )}
            </Box>

            {/* Botão Hambúrguer visível apenas no Celular (xs) */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu Lateral que desliza no celular */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}