import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { adSchema } from '../validations/adValidation';
import { 
  Container, Typography, Box, Button, Tabs, Tab, Card, 
  CardMedia, CardContent, CardActions, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, Stack 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const FALLBACK_IMAGE = 'https://www.ype.ind.br/assets-NS/roupas-de-malha_ypedia-scaled.jpg?w=500';

// MAPEAMENTO DAS CATEGORIAS
const CATEGORIAS_OPCOES = [
  { value: 'camisa', label: 'CAMISA' },
  { value: 'calca', label: 'CALÇA' },
  { value: 'casaco', label: 'CASACO' },
  { value: 'calcado', label: 'CALÇADO' },
  { value: 'acessorio', label: 'ACESSÓRIO' },
  { value: 'outro', label: 'OUTRO' }
];

export default function MyGarage() {
  const { usuarioLogado } = useAuth();
  const { anuncios, adicionarAnuncio, editarAnuncio, excluirAnuncio } = useStore();
  
  const [tabIndex, setTabIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(adSchema),
  });

  // Impede quebra caso o login mude de estado abruptamente
  const meusAnuncios = anuncios.filter((a) => a.usuarioId === usuarioLogado?.id);
  const anunciosDisponiveis = meusAnuncios.filter((a) => a.status === 'disponivel');
  const anunciosEmNegociacao = meusAnuncios.filter((a) => a.status === 'em_negociacao');
  const anunciosFinalizados = meusAnuncios.filter((a) => a.status === 'vendido' || a.status === 'trocado');

  const handleOpenCreate = () => {
    setEditingAd(null);
    reset();
    setOpenModal(true);
  };

  const handleOpenEdit = (anuncio) => {
    setEditingAd(anuncio);
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

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingAd(null);
    reset();
  };

  const onSubmit = (data) => {
    try {
      if (editingAd) {
        editarAnuncio(editingAd.id, data, usuarioLogado?.id);
      } else {
        adicionarAnuncio(data, usuarioLogado?.id);
      }
      handleCloseModal();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir permanentemente este anúncio?')) {
      try {
        excluirAnuncio(id, usuarioLogado?.id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 2 }}>
        <Typography variant="h4" fontWeight="bold">Minha Garagem Virtual 🚗</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Anunciar Desapego
        </Button>
      </Box>

      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} sx={{ mb: 3 }} indicatorColor="primary" textColor="primary">
        <Tab label={`Disponíveis (${anunciosDisponiveis.length})`} />
        <Tab label={`Em Negociação (${anunciosEmNegociacao.length})`} />
        <Tab label={`Vendidos / Trocados (${anunciosFinalizados.length})`} />
      </Tabs>

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3,
          width: '100%'
        }}
      >
        {((tabIndex === 0 ? anunciosDisponiveis : tabIndex === 1 ? anunciosEmNegociacao : anunciosFinalizados)).map((anuncio) => (
          <Card 
            key={anuncio.id} 
            variant="outlined" 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              minWidth: 0,
              overflow: 'hidden'
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={anuncio.foto}
              alt={anuncio.titulo}
              onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
              sx={{ objectFit: 'cover' }}
            />
            
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <Typography variant="h6" fontWeight="bold" noWrap sx={{ mb: 0.5 }}>
                {anuncio.titulo}
              </Typography>
              
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {anuncio.categoria.toUpperCase()} • Tam: {anuncio.tamanho}
              </Typography>
              
              <Box sx={{ flexGrow: 1, mb: 2, minWidth: 0 }}>
                <Typography 
                  variant="body2" 
                  color="text.primary" 
                  sx={{ 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    wordBreak: 'break-all',
                    overflowWrap: 'anywhere'
                  }}
                >
                  {anuncio.descricao}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <Typography variant="subtitle2" color="secondary" fontWeight="bold">{anuncio.modalidade}</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">{anuncio.vats} VATs</Typography>
              </Box>
            </CardContent>
            
            {tabIndex === 0 && (
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2, pt: 0 }}>
                <Button size="small" startIcon={<EditIcon />} onClick={() => handleOpenEdit(anuncio)}>Editar</Button>
                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(anuncio.id)}>Excluir</Button>
              </CardActions>
            )}
          </Card>
        ))}
      </Box>

      {/* FORMULÁRIO */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle fontWeight="bold" sx={{ pt: 3, px: 3, pb: 1 }}>
          {editingAd ? 'Editar Dados do Anúncio' : 'Anunciar Peça no ReVeste'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent dividers sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <TextField fullWidth variant="outlined" label="Título do Anúncio" error={!!errors.titulo} helperText={errors.titulo?.message} {...register('titulo')} />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField select fullWidth variant="outlined" label="Categoria" defaultValue={editingAd?.categoria || ''} error={!!errors.categoria} helperText={errors.categoria?.message} {...register('categoria')}>
                  {CATEGORIAS_OPCOES.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField select fullWidth variant="outlined" label="Tamanho" defaultValue={editingAd?.tamanho || ''} error={!!errors.tamanho} helperText={errors.tamanho?.message} {...register('tamanho')}>
                  {['PP', 'P', 'M', 'G', 'GG'].map((tam) => <MenuItem key={tam} value={tam}>{tam}</MenuItem>)}
                </TextField>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField select fullWidth variant="outlined" label="Conservação" defaultValue={editingAd?.conservacao || ''} error={!!errors.conservacao} helperText={errors.conservacao?.message} {...register('conservacao')}>
                  {['Novo', 'Bom', 'Regular', 'Marcas de uso'].map((est) => <MenuItem key={est} value={est}>{est}</MenuItem>)}
                </TextField>

                <TextField select fullWidth variant="outlined" label="Modalidade" defaultValue={editingAd?.modalidade || ''} error={!!errors.modalidade} helperText={errors.modalidade?.message} {...register('modalidade')}>
                  {['Venda', 'Troca', 'Ambos'].map((mod) => <MenuItem key={mod} value={mod}>{mod}</MenuItem>)}
                </TextField>
              </Box>

              <TextField fullWidth variant="outlined" type="number" label="Valor pedido (em Moeda VAT)" error={!!errors.vats} helperText={errors.vats?.message} {...register('vats')} />
              <TextField fullWidth variant="outlined" label="URL Direta da Foto do Produto" error={!!errors.foto} helperText={errors.foto?.message} {...register('foto')} />
              <TextField fullWidth variant="outlined" multiline rows={4} label="Descrição Detalhada da Peça" error={!!errors.descricao} helperText={errors.descricao?.message} {...register('descricao')} />
            </Stack>
          </DialogContent>
          
          <DialogActions sx={{ p: 2.5, px: 3 }}>
            <Button onClick={handleCloseModal} color="inherit">Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ px: 4, ml: 2 }}>
              {editingAd ? 'Salvar Alterações' : 'Publicar Anúncio'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
}