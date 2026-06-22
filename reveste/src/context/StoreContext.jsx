import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { storageService } from '../services/storageService'; // 🌟 Importação do serviço
import { v4 as uuidv4 } from 'uuid';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  storageService.init();

  // O hook busca direto do localStorage preenchido pelo init()
  const [anuncios, setAnuncios] = useLocalStorage('anuncios', []);

  // Criar Anúncio
  const adicionarAnuncio = (dadosAnuncio, usuarioId) => {
    const novoAnuncio = {
      id: `anc_${uuidv4()}`,
      usuarioId,
      ...dadosAnuncio,
      status: 'disponivel', // Status inicial
      criadoEm: new Date().toISOString(),
    };
    setAnuncios([...anuncios, novoAnuncio]);
  };

  // Editar Anúncio
  const editarAnuncio = (anuncioId, dadosEditados, usuarioId) => {
    setAnuncios((prevAnuncios) =>
      prevAnuncios.map((anuncio) => {
        if (anuncio.id === anuncioId) {
          if (anuncio.usuarioId !== usuarioId) {
            throw new Error('Você não tem permissão para editar este anúncio.');
          }
          if (anuncio.status === 'vendido' || anuncio.status === 'trocado') {
            throw new Error('Anúncios finalizados não podem ser editados.');
          }
          return { ...anuncio, ...dadosEditados };
        }
        return anuncio;
      })
    );
  };

  // Excluir Anúncio
  const excluirAnuncio = (anuncioId, usuarioId) => {
    const anuncio = anuncios.find((a) => a.id === anuncioId);
    if (!anuncio) throw new Error('Anúncio não encontrado.');
    if (anuncio.usuarioId !== usuarioId) {
      throw new Error('Você não tem permissão para excluir este anúncio.');
    }

    setAnuncios((prevAnuncios) => prevAnuncios.filter((a) => a.id !== anuncioId));
  };

  return (
    <StoreContext.Provider value={{ anuncios, adicionarAnuncio, editarAnuncio, excluirAnuncio }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);