import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useNegotiation } from '../context/NegotiationContext';
import {
  Container, Box, Typography, Button, Chip, Divider, Stack, Card, CardMedia, Paper, Alert,
  FormGroup, FormControlLabel, Checkbox, TextField, Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ChatIcon from '@mui/icons-material/Chat';

const FALLBACK_IMAGE = 'https://www.ype.ind.br/assets-NS/roupas-de-malha_ypedia-scaled.jpg?w=500';

export default function AdDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { anuncios, excluirAnuncio } = useStore(); 
  const { usuarioLogado, usuarios } = useAuth();
  
  // Lista de negociacoes global do contexto
  const { negociacoes = [], enviarPropostaInicial, calcularEquivalencia } = useNegotiation();

  const [mostrarPainelOferta, setMostrarPainelOferta] = useState(null);
  const [valorVendaOfertado, setValorVendaOfertado] = useState('');
  const [pecasSelecionadas, setPecasSelecionadas] = useState([]);
  const [complementoTrocaVats, setComplementoTrocaVats] = useState('');
  const [erroNegociacao, setErroNegociacao] = useState('');

  const anuncio = anuncios?.find((a) => String(a.id) === String(id));

  if (!anuncio) {
    return (
      <Container maxWidth="sm" sx={{ pt: 10, textAlign: 'center' }}>
        <Button variant="contained" onClick={() => navigate('/')}>Voltar ao Início</Button>
      </Container>
    );
  }

  const isDono = usuarioLogado && String(usuarioLogado.id) === String(anuncio.usuarioId);
  const donoDoAnuncio = usuarios?.find((u) => String(u.id) === String(anuncio.usuarioId));
  const saldoUsuarioLogado = usuarioLogado?.saldoVats ?? usuarioLogado?.vats ?? 0;

  const minhasPecasParaOferecer = anuncios.filter(a => String(a.usuarioId) === String(usuarioLogado?.id) && a.status === 'disponivel');

  const valorTotalPecasForm = pecasSelecionadas.reduce((acc, pId) => acc + (anuncios.find(a => a.id === pId)?.vats || 0), 0);
  const validacaoTroca = calcularEquivalencia(anuncio.vats, valorTotalPecasForm, complementoTrocaVats);

  // Verifica se o usuário atual faz parte de uma negociação ACEITA para o anúncio
  const negociacaoComChatAtivo = negociacoes.find(
    (n) => String(n.anuncioId) === String(anuncio.id) && 
           n.status === 'aceita' &&
           (String(n.compradorId) === String(usuarioLogado?.id) || String(n.vendedorId) === String(usuarioLogado?.id))
  );

  const handleExecutarOfertaInicial = (e) => {
    e.preventDefault();
    setErroNegociacao('');

    if (mostrarPainelOferta === 'venda') {
      const valor = parseFloat(valorVendaOfertado);
      if (isNaN(valor) || valor <= 0) return setErroNegociacao('Insira um valor válido.');
      if (valor > saldoUsuarioLogado) return setErroNegociacao('Saldo VAT insuficiente.');

      const res = enviarPropostaInicial(anuncio, { tipo: 'venda', valorVats: valor });
      if (res?.imediata) {
        alert('Compra concluída! O saldo foi transferido e o anúncio foi retirado da vitrine.');
        navigate('/minhas-negociacoes');
      } else {
        alert('Proposta em análise enviada ao vendedor!');
        setMostrarPainelOferta(null);
      }
    } else {
      if (pecasSelecionadas.length < 1) return setErroNegociacao('Selecione ao menos 1 peça.');
      const comp = parseFloat(complementoTrocaVats) || 0;
      if (comp > saldoUsuarioLogado) return setErroNegociacao('Saldo insuficiente para o complemento.');

      enviarPropostaInicial(anuncio, { tipo: 'troca', pecasOferecidas: pecasSelecionadas, complementoVats: comp });
      alert('Proposta de troca enviada com sucesso!');
      setMostrarPainelOferta(null);
    }
  };

  const handleExcluir = () => {
    if (window.confirm('Excluir anúncio permanentemente?')) {
      excluirAnuncio(anuncio.id, usuarioLogado.id);
      navigate('/');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }} color="inherit">Voltar</Button>

      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <CardMedia component="img" image={anuncio.foto} alt={anuncio.titulo} onError={(e) => { e.target.src = FALLBACK_IMAGE; }} sx={{ width: '100%', height: 500, objectFit: 'cover' }} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>{anuncio.titulo}</Typography>
            <Typography variant="h3" color="primary.main" fontWeight="900" sx={{ mb: 3 }}>{anuncio.vats} <Typography variant="h6" component="span" color="text.secondary">VATs</Typography></Typography>

            <Divider />
            <Typography variant="body1" color="text.secondary" sx={{ my: 3 }}>{anuncio.descricao}</Typography>

            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, border: '1px solid rgba(255,255,255,0.08)', mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>Aceita:</strong> {anuncio.modalidade}</Typography>
              <Typography variant="body2"><strong>Anunciante:</strong> {isDono ? "Você" : (donoDoAnuncio?.nome || 'Usuário')}</Typography>
            </Box>

            {/* SESSÃO DE BOTÕES DO CHAT */}
            <Box>
              {negociacaoComChatAtivo ? (
                // Se o chat está liberado, dá o atalho direto para a página de negociações/chat
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary" 
                  startIcon={<ChatIcon />} 
                  onClick={() => navigate('/minhas-negociacoes')}
                  sx={{ fontWeight: 'bold', py: 1.5, borderRadius: 2 }}
                >
                  Proposta Aceita! Ir para o Chat
                </Button>
              ) : anuncio.status !== 'disponivel' ? (
                <Alert severity="error" variant="filled" sx={{ fontWeight: 'bold', borderRadius: 2 }}>
                  ANÚNCIO ENCERRADO ({anuncio.status.toUpperCase()})
                </Alert>
              ) : isDono ? (
                <Button fullWidth variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleExcluir}>Excluir Anúncio</Button>
              ) : (
                <Stack spacing={2}>
                  {['venda', 'ambos'].includes(anuncio.modalidade.toLowerCase()) && (
                    <Button fullWidth variant="contained" color="success" startIcon={<ShoppingBagIcon />} onClick={() => setMostrarPainelOferta('venda')}>Propor Compra (VATs)</Button>
                  )}
                  {['troca', 'ambos'].includes(anuncio.modalidade.toLowerCase()) && (
                    <Button fullWidth variant="outlined" color="secondary" startIcon={<SwapHorizIcon />} onClick={() => setMostrarPainelOferta('troca')}>Propor Troca</Button>
                  )}
                </Stack>
              )}
            </Box>

            {mostrarPainelOferta && anuncio.status === 'disponivel' && !negociacaoComChatAtivo && (
              <Paper variant="outlined" sx={{ p: 3, mt: 3, borderRadius: 3, bgcolor: 'background.neutral' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Enviar Oferta</Typography>
                {erroNegociacao && <Alert severity="error" sx={{ mb: 2 }}>{erroNegociacao}</Alert>}
                
                <Box component="form" onSubmit={handleExecutarOfertaInicial}>
                  {mostrarPainelOferta === 'venda' ? (
                    <TextField fullWidth type="number" label="Quantidade de VATs" value={valorVendaOfertado} onChange={(e) => setValorVendaOfertado(e.target.value)} sx={{ mb: 2 }} />
                  ) : (
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Suas peças livres (Mín 1 - Máx 5):</Typography>
                      <FormGroup sx={{ maxHeight: 150, overflowY: 'auto', mb: 2 }}>
                        {minhasPecasParaOferecer.map(p => (
                          <FormControlLabel key={p.id} control={<Checkbox checked={pecasSelecionadas.includes(p.id)} onChange={() => setPecasSelecionadas(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} />} label={`${p.titulo} (${p.vats} VATs)`} />
                        ))}
                      </FormGroup>
                      <TextField fullWidth type="number" label="VAT Complementar" value={complementoTrocaVats} onChange={(e) => setComplementoTrocaVats(e.target.value)} sx={{ mb: 2 }} />
                      
                      {pecasSelecionadas.length > 0 && !validacaoTroca.equilibrada && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255, 152, 0, 0.1)', p: 1.5, borderRadius: 1, border: '1px solid #ff9800', mb: 2 }}>
                          <WarningAmberIcon color="warning" size="small" />
                          <Typography variant="caption" color="#ff9800" fontWeight="bold">Troca desequilibrada (&gt;20%). Adicione VAT complementar.</Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                  <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" color="success" fullWidth>Enviar</Button>
                    <Button variant="outlined" color="inherit" onClick={() => setMostrarPainelOferta(null)}>Cancelar</Button>
                  </Stack>
                </Box>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}