import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  // Se estiver autenticado, renderiza as páginas filhas. Se não, manda para o login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}