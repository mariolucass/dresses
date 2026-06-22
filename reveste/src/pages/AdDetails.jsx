import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import {
  Container, Box, Typography, Button, Chip, Divider, Stack, Card, CardMedia, Grid, Paper, Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';

const FALLBACK_IMAGE = 'https://www.ype.ind.br/assets-NS/roupas-de-malha_ypedia-scaled.jpg?w=500';

export default function AdDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Pega a lista de anúncios e a lista de usuários do contexto
  const { anuncios, setAnuncios } = useStore(); 
  const { usuarioLogado, usuarios } = useAuth();

  // Encontra o anúncio correspondente pelo ID da URL
  const anuncio = anuncios?.find((a) => String(a.id) === String(id));

  // Anúncio inexistente
  if (!anuncio) {
    return (
      <Container maxWidth="sm" sx={{ pt: 10, textAlign: 'center' }}>
        <Paper elevation={2} sx={{ p: 5, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" color="text.secondary" gutterBottom>
            Anúncio não encontrado 🔍
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            O desapego que você está procurando não existe ou foi removido pelo dono.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/')}
          >
            Voltar para o Marketplace
          </Button>
        </Paper>
      </Container>
    );
  }

  // Verifica se o usuário atual é o criador do anúncio
  const isDono = usuarioLogado && String(usuarioLogado.id) === String(anuncio.usuarioId);

  // PROCURARA O DONO DO ANÚNCIO NA LISTA DE USUÁRIOS
  const donoDoAnuncio = usuarios?.find((u) => String(u.id) === String(anuncio.usuarioId));
  
  // Nome de exibição
  const nomeExibicaoDono = donoDoAnuncio 
    ? donoDoAnuncio.nome 
    : `Usuário #${anuncio.usuarioId.slice(0, 8)}...`;

  // Ações do Dono
  const handleExcluir = () => {
    if (window.confirm('Tem certeza que deseja excluir este anúncio permanentemente?')) {
      if (setAnuncios) {
        setAnuncios(anuncios.filter((a) => String(a.id) !== String(id)));
      }
      alert('Anúncio excluído com sucesso!');
      navigate('/');
    }
  };

  const handleEditar = () => {
    navigate(`/editar-anuncio/${anuncio.id}`);
  };

  // Ações de Visitantes
  const handleProporCompra = () => {
    alert(`Proposta de COMPRA enviada para o anúncio: ${anuncio.titulo}`);
  };

  const handleProporTroca = () => {
    alert(`Proposta de TROCA enviada para o anúncio: ${anuncio.titulo}`);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 3, textTransform: 'none' }}
        color="inherit"
      >
        Voltar
      </Button>

      <Grid container spacing={5}>
        
        {/* COLUNA ESQUERDA: Foto do Produto */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden', position: 'sticky', top: 100 }}>
            <CardMedia
              component="img"
              image={anuncio.foto}
              alt={anuncio.titulo}
              onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
              sx={{ 
                width: '100%', 
                height: { xs: '350px', sm: '500px' }, 
                objectFit: 'cover' 
              }}
            />
          </Card>
        </Grid>

        {/* COLUNA DIREITA: Detalhes Técnicos e Ações */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              <Chip label={anuncio.categoria.toUpperCase()} color="primary" variant="contained" size="small" />
              <Chip label={`Tamanho: ${anuncio.tamanho}`} variant="outlined" size="small" />
              <Chip label={`Condição: ${anuncio.conservacao}`} color="default" size="small" sx={{ bgcolor: 'action.selected' }} />
            </Stack>

            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {anuncio.titulo}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, my: 1 }}>
              <Typography variant="h3" component="span" fontWeight="900" color="primary.main">
                {anuncio.vats}
              </Typography>
              <Typography variant="h6" component="span" fontWeight="bold" color="text.secondary">
                VATs
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold" color="text.primary" gutterBottom>
              Descrição do Desapego
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {anuncio.descricao}
            </Typography>

            {/* Informações de Negociação */}
            <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2, mt: 2, mb: 4 }}>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalOfferIcon fontSize="small" color="secondary" />
                  <Typography variant="body2">
                    <strong>Modalidade aceita:</strong> {anuncio.modalidade}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <strong>Dono do anúncio:</strong> 
                    <Chip 
                      avatar={
                        <Avatar sx={{ bgcolor: isDono ? 'info.main' : 'success.main', fontSize: '0.75rem' }}>
                          {isDono ? "V" : nomeExibicaoDono.charAt(0).toUpperCase()}
                        </Avatar>
                      } 
                      label={isDono ? "Você (Dono)" : nomeExibicaoDono} 
                      size="small" 
                      variant="outlined"
                      color={isDono ? "info" : "default"}
                    />
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* SEÇÃO DE AÇÕES */}
            <Box sx={{ mt: 'auto' }}>
              {isDono ? (
                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    startIcon={<EditIcon />}
                    onClick={handleEditar}
                    sx={{ fontWeight: 'bold', py: 1.5 }}
                  >
                    Editar Anúncio
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleExcluir}
                    sx={{ fontWeight: 'bold', py: 1.5 }}
                  >
                    Excluir Peça
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={2}>
                  {(anuncio.modalidade.toLowerCase() === 'venda' || anuncio.modalidade.toLowerCase() === 'ambos') && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<ShoppingBagIcon />}
                      onClick={handleProporCompra}
                      sx={{ fontWeight: 'bold', py: 1.8 }}
                    >
                      Propor Compra (Usar VATs)
                    </Button>
                  )}

                  {(anuncio.modalidade.toLowerCase() === 'troca' || anuncio.modalidade.toLowerCase() === 'ambos') && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      size="large"
                      startIcon={<SwapHorizIcon />}
                      onClick={handleProporTroca}
                      sx={{ fontWeight: 'bold', py: 1.8, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                    >
                      Propor Troca de Peças
                    </Button>
                  )}
                </Stack>
              )}
            </Box>

          </Box>
        </Grid>

      </Grid>
    </Container>
  );
}