import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Barra de navegação global */}
      <Navbar />
      
      {/* Conteúdo principal da página atual */}
      <Box component="main" sx={{ flexGrow: 1, py: 4, bgcolor: 'background.default' }}>
        <Outlet />
      </Box>

      {/* Rodapé global */}
      <Footer />
    </Box>
  );
}