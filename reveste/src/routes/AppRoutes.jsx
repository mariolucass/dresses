import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import MyGarage from '../pages/MyGarage';
import AdDetails from '../pages/AdDetails';
import Wallet from '../pages/Wallet';
import MinhasNegociacoes from '../pages/MinhasNegociacoes';
import ProtectedRoute from '../components/ProtectedRoute';

// Placeholder para rotas ainda não mapeadas fisicamente em arquivos dedicados
const CadastroPlaceholder = () => <div style={{ padding: 40 }}><h2>Tela de Cadastro (Em breve)</h2></div>;

export default function AppRoutes() {
  return (
    <Routes>
      {/* MainLayout entrega o Navbar e Footer para todas as rotas de dentro */}
      <Route element={<MainLayout />}>
        
        {/* ROTAS PÚBLICAS */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroPlaceholder />} />
        <Route path="/anuncio/:id" element={<AdDetails />} />

        {/* ROTAS PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
          <Route path="/perfil" element={<Profile />} />
          <Route path="/garagem" element={<MyGarage />} />
          <Route path="/minhas-negociacoes" element={<MinhasNegociacoes />} />
          <Route path="/carteira" element={<Wallet />} />
        </Route>

      </Route>
    </Routes>
  );
}