import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Importação das páginas
import Home from '../pages/Home';
import Login from '../pages/Login';
import Explore from '../pages/Explore';
import MyGarage from '../pages/MyGarage';
import Profile from '../pages/Profile';
import AdDetails from '../pages/AdDetails';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas que usam a Navbar e o Footer padrão */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/ad/:id" element={<AdDetails />} />
          
          {/* Rotas Protegidas (Sextante de segurança) */}
          <Route path="/garage" element={<ProtectedRoute><MyGarage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>

        {/* Rota de Login isolada */}
        <Route path="/login" element={<Login />} />

        {/* Rota de fuga: se digitar qualquer coisa errada, joga para a Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}