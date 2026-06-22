import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useLocalStorage('usuarioLogado', null);
  const [usuarios, setUsuarios] = useLocalStorage('usuarios', []);

  // Lógica de Login
  const login = (email, senha) => {
    const usuarioEncontrado = usuarios.find((u) => u.email === email);

    if (!usuarioEncontrado) {
      throw new Error('E-mail não cadastrado.');
    }

    if (usuarioEncontrado.senha !== senha) {
      throw new Error('Senha incorreta.');
    }

    setUsuarioLogado(usuarioEncontrado);
    return true;
  };

  // Lógica de Cadastro
  const register = (dadosNovos) => {
    const emailExiste = usuarios.some((u) => u.email === dadosNovos.email);

    if (emailExiste) {
      throw new Error('Este e-mail já está em uso.');
    }

    const novoUsuario = {
      id: `user${uuidv4()}`,
      ...dadosNovos,
      avatar: dadosNovos.avatar || '',
      vats: 0, // Inicia com 0 moedas virtuais conforme regra de negócio
      mediaAvaliacoes: 5.0, // Nota inicial neutra/máxima
      totalNegociacoes: 0,
      criadoEm: new Date().toISOString(),
    };

    setUsuarios([...usuarios, novoUsuario]);
    setUsuarioLogado(novoUsuario); // Loga automaticamente após cadastrar
    return true;
  };

  // Lógica de Logout
  const logout = () => {
    setUsuarioLogado(null);
  };

  return (
    <AuthContext.Provider value={{ usuarioLogado, login, register, logout, isAuthenticated: !!usuarioLogado }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);