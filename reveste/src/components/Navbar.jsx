import { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, IconButton, 
  Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Avatar
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { label: 'Home', path: '/', action: 'topo' },
    { label: 'Explorar anúncios', path: '/', action: 'catalogo' },
    ...(isAuthenticated ? [
        { label: 'Minhas negociações', path: '/minhas-negociacoes' },
        { label: 'Meu perfil', path: '/perfil' },
        { label: 'Garagem virtual', path: '/garagem' }
    ] : [])
  ];

  // GERENCIADOR DE CLIQUE
  const handleMenuClick = (item) => {
    setMobileOpen(false);

    if (item.action === 'catalogo') {
      if (window.location.pathname === '/') {
        // Se já está na Home, rola direto para a vitrine
        const el = document.getElementById('catalogo-vitrine');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Se está em outra página, avisa a Home para rolar ao carregar
        sessionStorage.setItem('scroll_to_catalogo', 'true');
        navigate('/');
      }
    } else if (item.action === 'topo' && window.location.pathname === '/') {
      // Se clicou em Home e já está nela, rola para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navegação padrão para as outras rotas
      navigate(item.path);
    }
  };

  const drawerContent = (
    <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%', pt: 3 }}>
      {isAuthenticated ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2, pb: 3 }}>
          <Avatar 
            src={usuarioLogado?.avatar} 
            alt={usuarioLogado?.nome}
            sx={{ width: 64, height: 64, bgcolor: 'success.main', fontSize: '1.5rem', mb: 1.5 }}
          >
            {usuarioLogado?.nome?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1" fontWeight="bold" align="center" sx={{ mb: 1 }}>
            {usuarioLogado?.nome}
          </Typography>
          <Box sx={{ bgcolor: 'secondary.main', color: 'white', px: 2, py: 0.5, borderRadius: 5, fontWeight: 'bold', fontSize: '0.85rem' }}>
            {usuarioLogado?.vats || 0} VATs
          </Box>
        </Box>
      ) : (
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'primary.main' }}>
            ReVeste ♻️
          </Typography>
        </Box>
      )}

      <Divider />

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton onClick={() => handleMenuClick(item)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2 }}>
        {isAuthenticated ? (
          <Button fullWidth variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Sair
          </Button>
        ) : (
          <Button fullWidth variant="contained" color="primary" onClick={() => { navigate('/login'); setMobileOpen(false); }}>
            Entrar
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1} color="default">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              sx={{ textDecoration: 'none', fontWeight: 'bold', color: 'primary.main', mr: 4 }}
            >
              ReVeste ♻️
            </Typography>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.label} 
                  color="inherit" 
                  onClick={() => handleMenuClick(item)} 
                  sx={{ textTransform: 'none' }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={toggleTheme} color="inherit" sx={{ p: 1 }}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {isAuthenticated && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar 
                    src={usuarioLogado?.avatar} 
                    alt={usuarioLogado?.nome}
                    sx={{ width: 36, height: 36, bgcolor: 'success.main' }}
                  >
                    {usuarioLogado?.nome?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body1" color="text.primary" fontWeight="medium">
                    {usuarioLogado?.nome}
                  </Typography>
                </Box>

                <Box sx={{ bgcolor: 'secondary.main', color: 'white', px: 2, py: 0.6, borderRadius: '50px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  {usuarioLogado?.vats || 0} VATs
                </Box>

                <IconButton onClick={handleLogout} color="error" title="Sair" sx={{ p: 1 }}>
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}

            {!isAuthenticated && (
              <Button component={Link} to="/login" variant="contained" color="primary" sx={{ display: { xs: 'none', md: 'block' } }}>
                Entrar
              </Button>
            )}

            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}>
        {drawerContent}
      </Drawer>
    </>
  );
}