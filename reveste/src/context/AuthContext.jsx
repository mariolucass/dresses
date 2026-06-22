import { createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useLocalStorage('usuarioLogado', null);
  const [usuarios, setUsuarios] = useLocalStorage('usuarios', []);

  const login = (email, senha) => {
    const usuarioEncontrado = usuarios.find((u) => u.email === email);
    if (!usuarioEncontrado) throw new Error('E-mail não cadastrado.');
    if (usuarioEncontrado.senha !== senha) throw new Error('Senha incorreta.');
    setUsuarioLogado(usuarioEncontrado);
    return true;
  };

  const register = (dadosNovos) => {
    const emailExiste = usuarios.some((u) => u.email === dadosNovos.email);
    if (emailExiste) throw new Error('Este e-mail já está em uso.');

    const novoUsuario = {
      id: `usr_${uuidv4()}`,
      ...dadosNovos,
      avatar: dadosNovos.avatar || '',
      vats: 0,
      saldoVats: 0,
      mediaAvaliacoes: 5.0,
      totalNegociacoes: 0,
      criadoEm: new Date().toISOString(),
    };

    setUsuarios([...usuarios, novoUsuario]);
    return true;
  };

  const logout = () => {
    setUsuarioLogado(null);
  };

  const atualizarPerfil = (dadosAtualizados) => {
    if (!usuarioLogado) return;
    const listaAtualizada = usuarios.map((u) =>
      u.id === usuarioLogado.id ? { ...u, ...dadosAtualizados } : u
    );
    setUsuarios(listaAtualizada);
    setUsuarioLogado({ ...usuarioLogado, ...dadosAtualizados });
  };

  // Transfere VATs entre dois usuários com segurança de estado
  const transferirVats = (pagadorId, recebedorId, quantidade) => {
    const valor = Number(quantidade);
    if (isNaN(valor) || valor <= 0) return;

    let logadoAtualizado = null;

    const listaAtualizada = usuarios.map((u) => {
      // Debita do Pagador (Comprador)
      if (String(u.id) === String(pagadorId)) {
        const saldoAtual = Number(u.saldoVats ?? u.vats ?? 0);
        const novoSaldo = Math.max(0, saldoAtual - valor);
        const usuarioEditado = { ...u, saldoVats: novoSaldo, vats: novoSaldo };
        
        if (usuarioLogado && String(u.id) === String(usuarioLogado.id)) {
          logadoAtualizado = usuarioEditado;
        }
        return usuarioEditado;
      }

      // Credita ao Recebedor
      if (String(u.id) === String(recebedorId)) {
        const saldoAtual = Number(u.saldoVats ?? u.vats ?? 0);
        const novoSaldo = saldoAtual + valor;
        const usuarioEditado = { ...u, saldoVats: novoSaldo, vats: novoSaldo };

        if (usuarioLogado && String(u.id) === String(usuarioLogado.id)) {
          logadoAtualizado = usuarioEditado;
        }
        return usuarioEditado;
      }

      return u;
    });

    // Atualiza a lista global de usuários
    setUsuarios(listaAtualizada);

    // Se o usuário envolvido na troca, atualiza a sessão dele
    if (logadoAtualizado) {
      setUsuarioLogado(logadoAtualizado);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuarios,
        usuarioLogado,
        login,
        register,
        logout,
        atualizarPerfil,
        transferirVats,
        isAuthenticated: !!usuarioLogado,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};