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

  // LÊ O SALDO
  const saldoExibido = usuarioLogado?.saldoVats ?? usuarioLogado?.vats ?? 0;

  const menuItems = [
    { label: 'Home', path: '/', action: 'topo' },
    { label: 'Explorar anúncios', path: '/', action: 'catalogo' },
    ...(isAuthenticated ? [
        { label: 'Minhas negociações', path: '/minhas-negociacoes' },
        { label: 'Meu perfil', path: '/perfil' },
        { label: 'Garagem virtual', path: '/garagem' },
        { label: 'Carteira VAT', path: '/carteira' }
    ] : [])
  ];

  const handleMenuClick = (item) => {
    setMobileOpen(false);

    if (item.action === 'catalogo') {
      if (window.location.pathname === '/') {
        const el = document.getElementById('catalogo-vitrine');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        sessionStorage.setItem('scroll_to_catalogo', 'true');
        navigate('/');
      }
    } else if (item.action === 'topo' && window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
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
            sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: 'success.main', 
              fontSize: '1.5rem', 
              mb: 1.5,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' }
            }}
          >
            {usuarioLogado?.nome?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1" fontWeight="bold" align="center" sx={{ mb: 1 }}>
            {usuarioLogado?.nome}
          </Typography>
          
          <Box 
            component={Link}
            to="/carteira"
            onClick={() => setMobileOpen(false)}
            sx={{ 
              bgcolor: 'secondary.main', 
              color: 'white', 
              px: 2, 
              py: 0.5, 
              borderRadius: 5, 
              fontWeight: 'bold', 
              fontSize: '0.85rem',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: 'secondary.dark', transform: 'scale(1.05)' },
              '&:active': { transform: 'scale(0.98)' }
            }}
          >
            {saldoExibido} VATs
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
            <ListItemButton 
              onClick={() => handleMenuClick(item)}
              sx={{
                transition: 'padding-left 0.2s ease',
                '&:hover': {
                  paddingLeft: 3,
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2 }}>
        {isAuthenticated ? (
          <Button 
            fullWidth 
            variant="outlined" 
            color="error" 
            startIcon={<LogoutIcon />} 
            onClick={handleLogout}
            sx={{ transition: 'all 0.2s', '&:active': { transform: 'scale(0.98)' } }}
          >
            Sair
          </Button>
        ) : (
          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            onClick={() => { navigate('/login'); setMobileOpen(false); }}
            sx={{ transition: 'all 0.2s', '&:active': { transform: 'scale(0.98)' } }}
          >
            Entrar
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={1} 
        color="default"
        sx={{
          backdropFilter: 'blur(8px)',
          backgroundColor: (theme) => theme.palette.mode === 'light' ? 'rgba(252, 252, 252, 0.9)' : 'rgba(18, 18, 18, 0.9)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              sx={{ 
                textDecoration: 'none', 
                fontWeight: 'bold', 
                color: 'primary.main', 
                mr: 4,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                },
                '&:hover span': {
                  transform: 'rotate(20deg) scale(1.15)',
                }
              }}
            >
              ReVeste <Box component="span" sx={{ display: 'inline-block', transition: 'transform 0.3s ease' }}>♻️</Box>
            </Typography>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.label} 
                  color="inherit" 
                  onClick={() => handleMenuClick(item)} 
                  sx={{ 
                    textTransform: 'none',
                    position: 'relative',
                    fontWeight: 500,
                    transition: 'color 0.2s ease',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '0%',
                      height: '2px',
                      bottom: '6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'primary.main',
                      transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                    },
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'transparent'
                    },
                    '&:hover::after': {
                      width: '70%'
                    },
                    '&:active': {
                      transform: 'scale(0.96)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={toggleTheme} 
              color="inherit" 
              sx={{ 
                p: 1,
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'rotate(180deg)',
                  color: mode === 'dark' ? 'warning.main' : 'primary.main'
                }
              }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {isAuthenticated && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                    '&:hover': { opacity: 0.85 }
                  }}
                  onClick={() => navigate('/perfil')}
                >
                  <Avatar 
                    src={usuarioLogado?.avatar} 
                    alt={usuarioLogado?.nome}
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: 'success.main',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  >
                    {usuarioLogado?.nome?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body1" color="text.primary" fontWeight="medium">
                    {usuarioLogado?.nome}
                  </Typography>
                </Box>

                {/* pÍLULA DE VATS */}
                <Box 
                  component={Link}
                  to="/carteira"
                  sx={{ 
                    bgcolor: 'secondary.main', 
                    color: 'white', 
                    px: 2, 
                    py: 0.6, 
                    borderRadius: '50px', 
                    fontWeight: 'bold', 
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(156, 39, 176, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      bgcolor: 'secondary.dark',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(156, 39, 176, 0.4)'
                    },
                    '&:active': {
                      transform: 'translateY(0) scale(0.97)'
                    }
                  }}
                >
                  {saldoExibido} VATs
                </Box>

                {/* ICONE DE LOGOUT COM DESLOCAMENTO */}
                <IconButton 
                  onClick={handleLogout} 
                  color="error" 
                  title="Sair" 
                  sx={{ 
                    p: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'error.lighter',
                      transform: 'translateX(3px)'
                    }
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}

            {!isAuthenticated && (
              <Button 
                component={Link} 
                to="/login" 
                variant="contained" 
                color="primary" 
                sx={{ 
                  display: { xs: 'none', md: 'block' },
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-1px)', boxShadow: 2 }
                }}
              >
                Entrar
              </Button>
            )}

            <IconButton 
              color="inherit" 
              edge="start" 
              onClick={handleDrawerToggle} 
              sx={{ 
                display: { md: 'none' },
                transition: 'transform 0.2s',
                '&:active': { transform: 'scale(0.9)' }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer 
        anchor="right" 
        open={mobileOpen} 
        onClose={handleDrawerToggle} 
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            backdropFilter: 'blur(5px)',
            backgroundColor: (theme) => theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 30, 30, 0.95)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}