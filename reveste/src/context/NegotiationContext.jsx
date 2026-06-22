import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';
import { useStore } from './StoreContext';
import { v4 as uuidv4 } from 'uuid';

const NegotiationContext = createContext();

export function NegotiationProvider({ children }) {
  const [negociacoes, setNegociacoes] = useLocalStorage('negociacoes', []);
  const [propostas, setPropostas] = useLocalStorage('propostas', []);
  
  // Mensagens e avaliações
  const [mensagens, setMensagens] = useLocalStorage('mensagens', []);
  const [avaliacoes, setAvaliacoes] = useLocalStorage('avaliacoes', []);

  const { usuarioLogado, transferirVats } = useAuth();
  const { anuncios, atualizarAnuncio } = useStore();

  const calcularEquivalencia = (valorAnuncio, valorPecas, complemento) => {
    const valorTotalProposta = Number(valorPecas) + (parseFloat(complemento) || 0);
    if (valorTotalProposta >= Number(valorAnuncio)) {
      return { valorTotalProposta, percentualDiferenca: 0, equilibrada: true };
    }
    const diferencaAbsoluta = Number(valorAnuncio) - valorTotalProposta;
    const percentualDiferenca = (diferencaAbsoluta / Number(valorAnuncio)) * 100;
    return { valorTotalProposta, percentualDiferenca, equilibrada: percentualDiferenca <= 20 };
  };

  const enviarPropostaInicial = (anuncio, dados) => {
    if (!usuarioLogado) return { imediata: false };

    if (dados.tipo === 'venda' && parseFloat(dados.valorVats) >= Number(anuncio.vats)) {
      const valorFinal = parseFloat(dados.valorVats);
      const negociacaoId = `neg_${uuidv4()}`;

      const novaNegociacao = {
        id: negociacaoId,
        anuncioId: anuncio.id,
        compradorId: usuarioLogado.id,
        vendedorId: anuncio.usuarioId,
        tipo: 'venda',
        status: 'concluida',
        criadoEm: new Date().toISOString(),
        encerradoEm: new Date().toISOString() // Compras diretas
      };

      const novaProposta = {
        id: `prop_${uuidv4()}`,
        negociacaoId,
        autorId: usuarioLogado.id,
        valorVats: valorFinal,
        pecasOferecidas: [],
        complementoVats: null,
        status: 'aceita',
        criadoEm: new Date().toISOString()
      };

      setNegociacoes((prev) => [...prev, novaNegociacao]);
      setPropostas((prev) => [...prev, novaProposta]);
      transferirVats(usuarioLogado.id, anuncio.usuarioId, valorFinal);
      atualizarAnuncio(anuncio.id, { ...anuncio, status: 'vendido' });
      return { imediata: true };
    }

    let negAtiva = negociacoes.find(n => 
      String(n.anuncioId) === String(anuncio.id) && 
      String(n.compradorId) === String(usuarioLogado.id) &&
      n.status === 'em_andamento'
    );

    let negociacaoId = negAtiva?.id;

    if (!negAtiva) {
      negociacaoId = `neg_${uuidv4()}`;
      const novaNegociacao = {
        id: negociacaoId,
        anuncioId: anuncio.id,
        compradorId: usuarioLogado.id,
        vendedorId: anuncio.usuarioId,
        tipo: dados.tipo,
        status: 'em_andamento',
        criadoEm: new Date().toISOString()
      };
      setNegociacoes((prev) => [...prev, novaNegociacao]);
    }

    const novaProposta = {
      id: `prop_${uuidv4()}`,
      negociacaoId,
      autorId: usuarioLogado.id,
      valorVats: dados.tipo === 'venda' ? parseFloat(dados.valorVats) : null,
      pecasOferecidas: dados.tipo === 'troca' ? dados.pecasOferecidas : [],
      complementoVats: dados.tipo === 'troca' ? (parseFloat(dados.complementoVats) || 0) : null,
      status: 'pendente',
      criadoEm: new Date().toISOString()
    };

    setPropostas((prev) => [...prev, novaProposta]);
    return { imediata: false };
  };

  const enviarContraproposta = (negociacaoId, dados) => {
    setPropostas((prev) =>
      prev.map((p) => 
        p.negociacaoId === negociacaoId && p.status === 'pendente' ? { ...p, status: 'substituida' } : p
      )
    );

    const novaProposta = {
      id: `prop_${uuidv4()}`,
      negociacaoId,
      autorId: usuarioLogado.id,
      valorVats: dados.tipo === 'venda' ? parseFloat(dados.valorVats) : null,
      pecasOferecidas: dados.tipo === 'troca' ? dados.pecasOferecidas : [],
      complementoVats: dados.tipo === 'troca' ? (parseFloat(dados.complementoVats) || 0) : null,
      status: 'pendente',
      criadoEm: new Date().toISOString()
    };

    setPropostas((prev) => [...prev, novaProposta]);
  };

  const cancelarProposta = (propostaId, negociacaoId) => {
    setPropostas((prev) => prev.map((p) => (p.id === propostaId ? { ...p, status: 'cancelada' } : p)));
    const outrasPropostas = propostas.filter(p => p.negociacaoId === negociacaoId && p.id !== propostaId);
    const possuiAtivas = outrasPropostas.some(p => p.status === 'pendente' || p.status === 'aceita');
    
    if (!possuiAtivas) {
      setNegociacoes((prev) => prev.map((n) => (n.id === negociacaoId ? { ...n, status: 'cancelada', encerradoEm: new Date().toISOString() } : n)));
    }
  };

  const aceitarProposta = (proposta, negociacao) => {
    setPropostas((prev) => prev.map((p) => (p.id === proposta.id ? { ...p, status: 'aceita' } : p)));
    setNegociacoes((prev) => prev.map((n) => (n.id === negociacao.id ? { ...n, status: 'aceita' } : n)));
    
    const ad = anuncios.find(a => String(a.id) === String(negociacao.anuncioId));
    if (ad) atualizarAnuncio(negociacao.anuncioId, { ...ad, status: 'em_negociacao' });
  };

  const recusarProposta = (propostaId) => {
    setPropostas((prev) => prev.map((p) => (p.id === propostaId ? { ...p, status: 'recusada' } : p)));
  };

  const concluirNegociacao = (negociacao, proposta, anuncio) => {
    const custoVats = Number(proposta?.valorVats || proposta?.complementoVats || 0);

    transferirVats(negociacao.compradorId, negociacao.vendedorId, custoVats);

    setNegociacoes((prev) => prev.map((n) => 
      n.id === negociacao.id ? { ...n, status: 'concluida', encerradoEm: new Date().toISOString() } : n
    ));
    
    const proximoStatus = negociacao.tipo === 'venda' ? 'vendido' : 'trocado';
    atualizarAnuncio(anuncio.id, { ...anuncio, status: proximoStatus });

    if (negociacao.tipo === 'troca' && proposta?.pecasOferecidas) {
      proposta.pecasOferecidas.forEach((pecaId) => {
        const pecaCompleta = anuncios.find(a => String(a.id) === String(pecaId));
        if (pecaCompleta) atualizarAnuncio(pecaId, { ...pecaCompleta, status: 'trocado' });
      });
    }
  };

  // Cancelamento manual pelo Chat/Painel do Vendedor
  const cancelarNegociacaoManual = (negociacao, anuncio) => {
    setNegociacoes((prev) => prev.map((n) => 
      n.id === negociacao.id ? { ...n, status: 'cancelada', encerradoEm: new Date().toISOString() } : n
    ));
    atualizarAnuncio(anuncio.id, { ...anuncio, status: 'disponivel' });
  };

  // Envio de mensagens e bloqueio pós-conclusão
  const enviarMensagem = (negociacaoId, texto) => {
    if (!usuarioLogado) return;
    const neg = negociacoes.find(n => n.id === negociacaoId);
    if (!neg) return;
    
    if (['concluida', 'cancelada'].includes(neg.status)) {
      alert('Não é permitido enviar novas mensagens após o encerramento do negócio!');
      return;
    }

    const novaMsg = {
      id: `msg_${uuidv4()}`,
      negociacaoId,
      autorId: usuarioLogado.id,
      texto,
      criadoEm: new Date().toISOString()
    };
    setMensagens(prev => [...prev, novaMsg]);
  };

  // Avaliação pós-conclusão
  const submeterAvaliacao = (negociacaoId, avaliadoId, estrelas, comentario) => {
    if (!usuarioLogado) return;

    const jaAvaliou = avaliacoes.some(a => a.negociacaoId === negociacaoId && a.autorId === usuarioLogado.id);
    if (jaAvaliou) {
      alert('Você já registrou sua avaliação para esta negociação!');
      return;
    }

    const novaAvaliacao = {
      id: `avl_${uuidv4()}`,
      negociacaoId,
      autorId: usuarioLogado.id,
      avaliadoId,
      estrelas: Number(estrelas),
      comentario: comentario || null,
      criadoEm: new Date().toISOString()
    };

    setAvaliacoes(prev => [...prev, novaAvaliacao]);
    alert('Avaliação registrada com sucesso!');
  };

  return (
    <NegotiationContext.Provider value={{
      negociacoes, propostas, mensagens, avaliacoes, enviarPropostaInicial, enviarContraproposta,
      cancelarProposta, aceitarProposta, recusarProposta, concluirNegociacao, cancelarNegociacaoManual,
      enviarMensagem, submeterAvaliacao, calcularEquivalencia
    }}>
      {children}
    </NegotiationContext.Provider>
  );
}

export const useNegotiation = () => useContext(NegotiationContext);