import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { adSchema } from '../validations/adValidation';
import { 
  Container, Typography, Box, Button, Tabs, Tab, Card, 
  CardMedia, CardContent, CardActions, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, Stack, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LoopIcon from '@mui/icons-material/Loop';

const FALLBACK_IMAGE = 'https://www.ype.ind.br/assets-NS/roupas-de-malha_ypedia-scaled.jpg?w=500';

const CATEGORIAS_OPCOES = [
  { value: 'camisa', label: 'CAMISA' },
  { value: 'calca', label: 'CALÇA' },
  { value: 'casaco', label: 'CASACO' },
  { value: 'calcado', label: 'CALÇADO' },
  { value: 'acessorio', label: 'ACESSÓRIO' },
  { value: 'outro', label: 'OUTRO' }
];

const STATUS_CHIPS = {
  disponivel: { label: 'Disponível', color: 'success' },
  em_negociacao: { label: 'Em Negociação', color: 'warning' },
  vendido: { label: 'Vendido', color: 'info' },
  trocado: { label: 'Trocado', color: 'secondary' }
};

export default function MyGarage() {
  const { usuarioLogado } = useAuth();
  const { anuncios, adicionarAnuncio, editarAnuncio, excluirAnuncio } = useStore();
  
  const [tabIndex, setTabIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(adSchema),
  });

  // Filtra apenas os anúncios pertencentes ao usuário logado
  const meusAnuncios = anuncios.filter((a) => a.usuarioId === usuarioLogado?.id);
  
  // SEPARAÇÃO DAS LISTAS
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
        // Preserva o status atual do anúncio ao editar
        editarAnuncio(editingAd.id, { ...data, status: editingAd.status }, usuarioLogado?.id);
      } else {
        adicionarAnuncio(data, usuarioLogado?.id);
      }
      handleCloseModal();
    } catch (err) {
      alert(err.message);
    }
  };

  // MANIPULAÇÃO MANUAL DE STATUS
  const handleStatusChange = (anuncio, novoStatus) => {
    try {
      // Reutiliza a estrutura de edição para aplicar a transição manual de status
      editarAnuncio(anuncio.id, { ...anuncio, status: novoStatus }, usuarioLogado?.id);
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

  const listaExibida = tabIndex === 0 
    ? anunciosDisponiveis 
    : tabIndex === 1 
      ? anunciosEmNegociacao 
      : anunciosFinalizados;

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 4 }, pb: 6, px: { xs: 2, sm: 3 } }}>
      
      {/* Cabeçalho responsivo */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.8rem', sm: '2.125rem' } }}>
          Minha Garagem Virtual
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreate} sx={{ py: 1.2, fontWeight: 'bold', textTransform: 'none' }}>
          Anunciar Desapego
        </Button>
      </Box>

      {/* Abas de navegação */}
      <Tabs 
        value={tabIndex} 
        onChange={(e, newValue) => setTabIndex(newValue)} 
        sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }} 
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary" 
        textColor="primary"
      >
        <Tab label={`Disponíveis (${anunciosDisponiveis.length})`} sx={{ fontWeight: 'bold', textTransform: 'none' }} />
        <Tab label={`Em Negociação (${anunciosEmNegociacao.length})`} sx={{ fontWeight: 'bold', textTransform: 'none' }} />
        <Tab label={`Histórico (${anunciosFinalizados.length})`} sx={{ fontWeight: 'bold', textTransform: 'none' }} />
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
        {listaExibida.map((anuncio) => (
          <Card 
            key={anuncio.id} 
            variant="outlined" 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              borderRadius: 3,
              position: 'relative',
              minWidth: 0,
              overflow: 'hidden'
            }}
          >
            {/* Tag indicando o status atual */}
            <Chip 
              label={STATUS_CHIPS[anuncio.status]?.label} 
              color={STATUS_CHIPS[anuncio.status]?.color} 
              size="small"
              sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 'bold', boxShadow: 2 }}
            />

            <CardMedia
              component="img"
              height="180"
              image={anuncio.foto}
              alt={anuncio.titulo}
              onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
              sx={{ objectFit: 'cover' }}
            />
            
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5, minWidth: 0 }}>
              <Typography variant="h6" fontWeight="bold" noWrap sx={{ mb: 0.5 }}>
                {anuncio.titulo}
              </Typography>
              
              <Typography variant="caption" color="textSecondary" fontWeight="bold" sx={{ mb: 1.5 }}>
                {anuncio.categoria.toUpperCase()} • TAMANHO: {anuncio.tamanho} • {anuncio.conservacao.toUpperCase()}
              </Typography>
              
              <Box sx={{ flexGrow: 1, mb: 2, minWidth: 0 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    wordBreak: 'break-word'
                  }}
                >
                  {anuncio.descricao}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <Typography variant="subtitle2" color="secondary" fontWeight="bold">{anuncio.modalidade.toUpperCase()}</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">{anuncio.vats} VATs</Typography>
              </Box>
            </CardContent>
            
            {/* Painel de ações */}
            <CardActions sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'stretch', px: 2.5, pb: 2.5, pt: 0 }}>
              
              {/* Edição/Exclusão apenas para anúncios NÃO CONCLUÍDOS */}
              {anuncio.status !== 'vendido' && anuncio.status !== 'trocado' && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Button size="small" startIcon={<EditIcon />} onClick={() => handleOpenEdit(anuncio)} sx={{ textTransform: 'none' }}>
                    Editar
                  </Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(anuncio.id)} sx={{ textTransform: 'none' }}>
                    Excluir
                  </Button>
                </Box>
              )}

              {/* Mudar Manualmente o Status */}
              <TextField
                select
                size="small"
                fullWidth
                label="Mover Status"
                value={anuncio.status}
                onChange={(e) => handleStatusChange(anuncio, e.target.value)}
                InputProps={{
                  startAdornment: <LoopIcon sx={{ color: 'action.active', mr: 1, fontSize: '1.1rem' }} />
                }}
                sx={{ '& .MuiSelect-select': { py: 0.8, fontSize: '0.85rem' } }}
              >
                <MenuItem value="disponivel">Disponível</MenuItem>
                <MenuItem value="em_negociacao">Em Negociação</MenuItem>
                <MenuItem value="vendido">Vendido (Concluído)</MenuItem>
                <MenuItem value="trocado">Trocado (Concluído)</MenuItem>
              </TextField>

            </CardActions>
          </Card>
        ))}
      </Box>

      {/* FORMULÁRIO DO MODAL */}
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