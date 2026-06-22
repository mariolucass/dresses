import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redireciona para o login mantendo o histórico limpo
    return <Navigate to="/login" replace />;
  }

  return children;
}