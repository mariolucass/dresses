import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNegotiation } from '../context/NegotiationContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import {
  Container, Typography, Box, Tabs, Tab, Card, CardContent, Grid,
  Button, Chip, Stack, Paper, Avatar, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, Divider, List, ListItem, Alert
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ForumIcon from '@mui/icons-material/Forum';
import StarIcon from '@mui/icons-material/Star';

export default function MinhasNegociacoes() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState(0); 

  // Estados de controle para o Chat e Avaliação
  const [negociacaoFoco, setNegociacaoFoco] = useState(null);
  const [textoChat, setTextoChat] = useState('');
  const [notaEstrelas, setNotaEstrelas] = useState(10);
  const [comentarioAvaliacao, setComentarioAvaliacao] = useState('');

  const { 
    negociacoes, propostas, mensagens, avaliacoes, aceitarProposta, 
    recusarProposta, concluirNegociacao, cancelarNegociacaoManual, 
    enviarMensagem, submeterAvaliacao 
  } = useNegotiation();
  
  const { anuncios } = useStore();
  const { usuarioLogado, usuarios } = useAuth();

  if (!usuarioLogado) {
    return (
      <Container maxWidth="sm" sx={{ pt: 10, textAlign: 'center' }}>
        <Paper sx={{ p: 5, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="text.secondary">🔒 Acesso Restrito</Typography>
        </Paper>
      </Container>
    );
  }

  const negociacoesComoComprador = negociacoes.filter(n => String(n.compradorId) === String(usuarioLogado.id));
  const negociacoesComoVendedor = negociacoes.filter(n => String(n.vendedorId) === String(usuarioLogado.id));
  const listaExibicao = abaAtiva === 0 ? negociacoesComoComprador : negociacoesComoVendedor;

  const obterConfigStatus = (status) => {
    if (status === 'concluida' || status === 'cancelada') {
      return { label: 'ENCERRADA', color: 'error' };
    }
    switch (status) {
      case 'aceita': return { label: 'ACEITA', color: 'info' };
      case 'em_andamento': return { label: 'EM ANDAMENTO', color: 'warning' };
      case 'recusada': return { label: 'RECUSADA', color: 'error' };
      default: return { label: status.toUpperCase(), color: 'default' };
    }
  };

  const verificarSeChatExpirou = (encerradoEm) => {
    if (!encerradoEm) return false;
    const seteDiasEmMs = 7 * 24 * 60 * 60 * 1000;
    return (Date.now() - new Date(encerradoEm).getTime()) > seteDiasEmMs;
  };

  // Processamentos da negociação
  const mensagensFiltradas = mensagens.filter(m => m.negociacaoId === negociacaoFoco?.id);
  const jaAvalieiFoco = avaliacoes.some(a => a.negociacaoId === negociacaoFoco?.id && String(a.autorId) === String(usuarioLogado.id));
  
  // Chat desaparece 7 dias após conclusão/cancelamento
  const chatExpirado = negociacaoFoco ? verificarSeChatExpirou(negociacaoFoco.encerradoEm) : false;

  // Chat só existe se a proposta foi aceita
  const chatExiste = negociacaoFoco && ['aceita', 'concluida', 'cancelada'].includes(negociacaoFoco.status) && !chatExpirado;

  const handleEnviarMensagemChat = (e) => {
    e.preventDefault();
    if (!textoChat.trim()) return;
    enviarMensagem(negociacaoFoco.id, textoChat);
    setTextoChat('');
  };

  const handleEnviarNotaFinal = (e) => {
    e.preventDefault();
    const outroId = String(usuarioLogado.id) === String(negociacaoFoco.compradorId) 
      ? negociacaoFoco.vendedorId 
      : negociacaoFoco.compradorId;

    submeterAvaliacao(negociacaoFoco.id, outroId, notaEstrelas, comentarioAvaliacao);
    setComentarioAvaliacao('');
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>Minhas Negociações</Typography>
        <Typography variant="body2" color="text.secondary">Acompanhe propostas enviadas e recebidas nos seus desapegos.</Typography>
      </Box>

      <Tabs value={abaAtiva} onChange={(_, v) => setAbaAtiva(v)} variant="fullWidth" sx={{ mb: 4 }}>
        <Tab icon={<ShoppingBagIcon />} label="Como Comprador (Iniciadas)" />
        <Tab icon={<StorefrontIcon />} label="Como Vendedor (Recebidas)" />
      </Tabs>

      {listaExibicao.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography color="text.secondary">Nenhuma negociação encontrada por aqui.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {listaExibicao.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)).map((neg) => {
            const anuncio = anuncios.find(a => String(a.id) === String(neg.anuncioId));
            const outroId = abaAtiva === 0 ? neg.vendedorId : neg.compradorId;
            const participante = usuarios.find(u => String(u.id) === String(outroId));
            
            const histPropostas = propostas.filter(p => p.negociacaoId === neg.id).sort((a, b) => new Date(a.criadoEm) - new Date(b.criadoEm));
            const ultimaProp = histPropostas[histPropostas.length - 1];

            if (!anuncio) return null;

            const estaEncerrado = neg.status === 'concluida' || neg.status === 'cancelada';
            const ultimaPropSouAutor = ultimaProp && String(ultimaProp.autorId) === String(usuarioLogado.id);

            const nomesPecas = ultimaProp?.pecasOferecidas?.map(pId => {
              return anuncios.find(a => String(a.id) === String(pId))?.titulo || 'Peça';
            }).join(', ');

            const statusConfig = obterConfigStatus(neg.status);
            const chatDesseNegocioExpirou = verificarSeChatExpirou(neg.encerradoEm);

            return (
              <Grid item xs={12} key={neg.id}>
                <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: 'background.paper', borderColor: 'divider', overflow: 'hidden' }}>
                  <Box sx={{ p: 1.5, px: 3, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
                      Parceiro: <Box component="span" sx={{ color: 'text.primary' }}>{participante?.nome || 'Usuário'}</Box>
                    </Typography>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'grid', gap: 3, alignItems: 'center', gridTemplateColumns: { xs: '1fr', md: '80px 1fr 260px 220px' }, width: '100%' }}>
                      
                      <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                        <Avatar src={anuncio.foto} variant="rounded" sx={{ width: 80, height: 80, objectFit: 'cover' }} />
                      </Box>

                      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                        <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ wordBreak: 'break-word' }}>
                          {anuncio.titulo}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ pt: 0.5, flexWrap: 'wrap', gap: 1 }}>
                          <Chip size="small" label={statusConfig.label} color={statusConfig.color} sx={{ fontWeight: 'bold' }} />
                          <Chip size="small" label={neg.tipo.toUpperCase()} icon={neg.tipo === 'troca' ? <SwapHorizIcon /> : <ShoppingBagIcon />} variant="outlined" />
                        </Stack>
                      </Stack>

                      <Paper variant="outlined" sx={{ p: 2, width: '100%', boxSizing: 'border-box', bgcolor: 'transparent', border: '1px solid', borderColor: ultimaPropSouAutor ? '#4caf50' : '#9c27b0', borderRadius: 2, minHeight: 85, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                          ÚLTIMA OFERTA ({ultimaPropSouAutor ? 'SUA' : 'DELES'}):
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color={ultimaPropSouAutor ? '#4caf50' : '#9c27b0'} sx={{ wordBreak: 'break-word' }}>
                          {ultimaProp?.valorVats 
                            ? `${ultimaProp.valorVats} VATs` 
                            : `[${nomesPecas || 'Sem peças'}] + ${ultimaProp?.complementoVats || 0} VATs`
                          }
                        </Typography>
                      </Paper>

                      <Stack spacing={1} sx={{ width: '100%' }}>
                        {/* Se o chat existe e não expirou, exibe o botão do Chat */}
                        {['aceita', 'concluida', 'cancelada'].includes(neg.status) && !chatDesseNegocioExpirou ? (
                          <Button fullWidth size="small" variant="contained" color="info" startIcon={<ForumIcon />} onClick={() => setNegociacaoFoco({ ...neg, anuncio, ultimaProp })}>
                            Abrir Chat / Detalhes
                          </Button>
                        ) : (
                          <Button fullWidth size="small" variant="outlined" onClick={() => navigate(`/anuncio/${anuncio.id}`)} color="inherit">
                            Ver Detalhes Item
                          </Button>
                        )}

                        {!estaEncerrado && abaAtiva === 1 && neg.status === 'em_andamento' && ultimaProp?.status === 'pendente' && !ultimaPropSouAutor && (
                          <Stack direction="row" spacing={1}>
                            <Button fullWidth size="small" variant="contained" color="success" startIcon={<CheckCircleOutlineIcon />} onClick={() => {
                              aceitarProposta(ultimaProp, neg);
                              alert('Proposta aceita! Chat liberado para alinhamento.');
                            }}>Aceitar</Button>
                            <Button fullWidth size="small" variant="contained" color="error" startIcon={<HighlightOffIcon />} onClick={() => {
                              recusarProposta(ultimaProp.id);
                              alert('Proposta recusada.');
                            }}>Recusar</Button>
                          </Stack>
                        )}

                        {!estaEncerrado && neg.status === 'aceita' && abaAtiva === 0 && (
                          <Alert severity="info" variant="outlined" sx={{ py: 0, px: 1, '& .MuiAlert-icon': { fontSize: 18 } }}>
                            Aguardando vendedor finalizar.
                          </Alert>
                        )}
                      </Stack>

                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* CHAT TEMPORÁRIO E AVALIAÇÃO DE 1 A 10 ESTRELAS */}
      <Dialog open={Boolean(negociacaoFoco)} onClose={() => setNegociacaoFoco(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Painel do Negócio: {negociacaoFoco?.anuncio?.titulo}
        </DialogTitle>
        
        <DialogContent dividers>
          {/* Exibe erro se o chat já passou de 7 dias */}
          {!chatExiste ? (
            <Alert severity="error">Este chat temporário expirou por atingir a regra limite de 7 dias após o encerramento.</Alert>
          ) : (
            <Stack spacing={3}>
              
              {/* Histórico de Mensagens */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ForumIcon fontSize="small"/> Chat Temporário de Alinhamento
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, height: 220, overflowY: 'auto', bgcolor: 'action.hover', borderRadius: 2 }}>
                  {mensagensFiltradas.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ pt: 10 }}>Nenhuma mensagem enviada. Combine o local e horário de troca!</Typography>
                  ) : (
                    <List disablePadding>
                      {mensagensFiltradas.map((m) => {
                        const souAutor = String(m.autorId) === String(usuarioLogado.id);
                        const nomeAutor = usuarios.find(u => String(u.id) === String(m.autorId))?.nome || 'Usuário';
                        
                        return (
                          <ListItem key={m.id} sx={{ display: 'flex', justifyContent: souAutor ? 'flex-end' : 'flex-start', pb: 1, px: 0 }}>
                            <Box sx={{ maxWidth: '80%', p: 1.2, borderRadius: 2, bgcolor: souAutor ? 'primary.main' : 'background.paper', border: '1px solid rgba(255,255,255,0.05)', color: souAutor ? '#fff' : 'text.primary' }}>
                              <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', fontSize: '0.7rem', opacity: 0.8, mb: 0.3 }}>
                                {souAutor ? 'Você' : nomeAutor}
                              </Typography>
                              <Typography variant="body2">{m.texto}</Typography>
                              <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', fontSize: '0.6rem', opacity: 0.6, mt: 0.3 }}>
                                {new Date(m.criadoEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                            </Box>
                          </ListItem>
                        );
                      })}
                    </List>
                  )}
                </Paper>

                {/* Bloquear novas mensagens após Conclusão ou Cancelamento */}
                {['concluida', 'cancelada'].includes(negociacaoFoco?.status) ? (
                  <Alert severity="warning" size="small" sx={{ mt: 1 }}>Negócio Encerrado. Mensagens desabilitadas (Modo Leitura).</Alert>
                ) : (
                  <Box component="form" onSubmit={handleEnviarMensagemChat} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <TextField fullWidth size="small" placeholder="Envie uma mensagem..." value={textoChat} onChange={(e) => setTextoChat(e.target.value)} />
                    <Button type="submit" variant="contained" color="primary">Enviar</Button>
                  </Box>
                )}
              </Box>

              <Divider />

              {/* Botões do Criador do Anúncio encerrar a negociação dentro do chat */}
              {negociacaoFoco?.status === 'aceita' && String(negociacaoFoco?.vendedorId) === String(usuarioLogado.id) && (
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>Encerrar Negociação (Criador do Anúncio)</Typography>
                  <Stack direction="row" spacing={2}>
                    <Button fullWidth size="small" variant="contained" color="success" onClick={() => {
                      concluirNegociacao(negociacaoFoco, negociacaoFoco.ultimaProp, negociacaoFoco.anuncio);
                      alert('Negociação concluída com sucesso!');
                      setNegociacaoFoco(null);
                    }}>Concluir</Button>
                    
                    <Button fullWidth size="small" variant="outlined" color="error" onClick={() => {
                      cancelarNegociacaoManual(negociacaoFoco, negociacaoFoco.anuncio);
                      alert('Negociação cancelada.');
                      setNegociacaoFoco(null);
                    }}>Cancelar</Button>
                  </Stack>
                </Box>
              )}

              {/* Formulário de Avaliação (apenas se concluída) */}
              {negociacaoFoco?.status === 'concluida' && (
                <Box sx={{ p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'warning.main' }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <StarIcon fontSize="small" /> Avaliação da Negociação
                  </Typography>

                  {jaAvalieiFoco ? (
                    <Alert severity="success" size="small">Você já enviou sua avaliação para este usuário.</Alert>
                  ) : (
                    <Box component="form" onSubmit={handleEnviarNotaFinal}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <TextField select fullWidth size="small" label="Nota (1 a 10)" value={notaEstrelas} onChange={(e) => setNotaEstrelas(e.target.value)}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => <MenuItem key={v} value={v}>{v} Estrelas</MenuItem>)}
                          </TextField>
                        </Grid>
                        <Grid item xs={8}>
                          <TextField fullWidth size="small" label="Comentário" placeholder="Opcional" value={comentarioAvaliacao} onChange={(e) => setComentarioAvaliacao(e.target.value)} />
                        </Grid>
                      </Grid>
                      <Button type="submit" size="small" variant="contained" color="warning" sx={{ mt: 1.5 }}>Submeter Avaliação</Button>
                    </Box>
                  )}
                </Box>
              )}

            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setNegociacaoFoco(null)} color="inherit">Fechar Painel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}