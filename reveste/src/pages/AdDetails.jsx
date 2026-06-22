import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adSchema } from '../validations/adValidation';
import {
  Container, Box, Typography, Button, Chip, Divider, Stack, Card, CardMedia, Grid, Paper, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';

const FALLBACK_IMAGE = 'https://www.ype.ind.br/assets-NS/roupas-de-malha_ypedia-scaled.jpg?w=500';

const CATEGORIAS_OPCOES = [
  { value: 'camisa', label: 'CAMISA' },
  { value: 'calca', label: 'CALÇA' },
  { value: 'casaco', label: 'CASACO' },
  { value: 'calcado', label: 'CALÇADO' },
  { value: 'acessorio', label: 'ACESSÓRIO' },
  { value: 'outro', label: 'OUTRO' }
];

export default function AdDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { anuncios, editarAnuncio, excluirAnuncio } = useStore(); 
  const { usuarioLogado, usuarios } = useAuth();

  const [openModal, setOpenModal] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(adSchema),
  });

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

  // Procura o dono do anúncio na lista de usuários
  const donoDoAnuncio = usuarios?.find((u) => String(u.id) === String(anuncio.usuarioId));
  
  // Nome de exibição
  const nomeExibicaoDono = donoDoAnuncio 
    ? donoDoAnuncio.nome 
    : `Usuário #${anuncio.usuarioId.slice(0, 8)}...`;

  const handleExcluir = () => {
    if (window.confirm('Tem certeza que deseja excluir este anúncio permanentemente?')) {
      try {
        excluirAnuncio(anuncio.id, usuarioLogado?.id);
        alert('Anúncio excluído com sucesso!');
        navigate('/'); // Volta para o marketplace já que o anúncio sumiu
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleEditar = () => {
    setValue('titulo', anuncio.titulo);
    setValue('descricao', anuncio.descricao);
    setValue('categoria', anuncio.categoria);
    setValue('tamanho', anuncio.tamanho);
    setValue('conservacao', anuncio.conservacao);
    setValue('foto', anuncio.foto);
    setValue('modalidade', anuncio.modalidade);
    setValue('vats', anuncio.vats);
    setOpenModal(true);
  };

  const onSubmit = (data) => {
    try {
      editarAnuncio(anuncio.id, data, usuarioLogado?.id);
      setOpenModal(false);
      alert('Anúncio atualizado com sucesso!');
    } catch (err) {
      alert(err.message);
    }
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

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle fontWeight="bold" sx={{ pt: 3, px: 3, pb: 1 }}>
          Editar Dados do Anúncio
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent dividers sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <TextField fullWidth variant="outlined" label="Título do Anúncio" error={!!errors.titulo} helperText={errors.titulo?.message} {...register('titulo')} />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField select fullWidth variant="outlined" label="Categoria" defaultValue={anuncio.categoria} error={!!errors.categoria} helperText={errors.categoria?.message} {...register('categoria')}>
                  {CATEGORIAS_OPCOES.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                  ))}
                </TextField>

                <TextField select fullWidth variant="outlined" label="Tamanho" defaultValue={anuncio.tamanho} error={!!errors.tamanho} helperText={errors.tamanho?.message} {...register('tamanho')}>
                  {['PP', 'P', 'M', 'G', 'GG'].map((tam) => <MenuItem key={tam} value={tam}>{tam}</MenuItem>)}
                </TextField>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField select fullWidth variant="outlined" label="Conservação" defaultValue={anuncio.conservacao} error={!!errors.conservacao} helperText={errors.conservacao?.message} {...register('conservacao')}>
                  {['Novo', 'Bom', 'Regular', 'Marcas de uso'].map((est) => <MenuItem key={est} value={est}>{est}</MenuItem>)}
                </TextField>

                <TextField select fullWidth variant="outlined" label="Modalidade" defaultValue={anuncio.modalidade} error={!!errors.modalidade} helperText={errors.modalidade?.message} {...register('modalidade')}>
                  {['Venda', 'Troca', 'Ambos'].map((mod) => <MenuItem key={mod} value={mod}>{mod}</MenuItem>)}
                </TextField>
              </Box>

              <TextField fullWidth variant="outlined" type="number" label="Valor pedido (em Moeda VAT)" error={!!errors.vats} helperText={errors.vats?.message} {...register('vats')} />
              <TextField fullWidth variant="outlined" label="URL Direta da Foto do Produto" error={!!errors.foto} helperText={errors.foto?.message} {...register('foto')} />
              <TextField fullWidth variant="outlined" multiline rows={4} label="Descrição Detalhada da Peça" error={!!errors.descricao} helperText={errors.descricao?.message} {...register('descricao')} />
            </Stack>
          </DialogContent>
          
          <DialogActions sx={{ p: 2.5, px: 3 }}>
            <Button onClick={() => setOpenModal(false)} color="inherit">Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ px: 4, ml: 2 }}>
              Salvar Alterações
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
}