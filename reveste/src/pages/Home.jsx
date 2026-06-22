import { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, MenuItem, 
  Card, CardMedia, CardContent, Button, Chip, Divider, Stack, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';

const FALLBACK_IMAGE = 'https://www.ype.ind.br/assets-NS/roupas-de-malha_ypedia-scaled.jpg?w=500';

export default function Home() {
  const { anuncios } = useStore();
  const navigate = useNavigate();
  const catalogoRef = useRef(null);

    useEffect(() => {
        if (sessionStorage.getItem('scroll_to_catalogo') === 'true') {
            sessionStorage.removeItem('scroll_to_catalogo');

            setTimeout(() => {
            catalogoRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            }, 150);
        }
    }, []);

  // ESTADOS DOS FILTROS E BUSCA
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [minVat, setMinVat] = useState('');
  const [maxVat, setMaxVat] = useState('');
  const [ordenacao, setOrdenacao] = useState('recentes');

  const handleLimparFiltros = () => {
    setBusca('');
    setCategoria('');
    setTamanho('');
    setModalidade('');
    setMinVat('');
    setMaxVat('');
    setOrdenacao('recentes');
  };

  const handleScrollToCatalogo = () => {
    catalogoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // LÓGICA DE FILTRAGEM
  const anunciosFiltrados = anuncios
    .filter((anuncio) => anuncio.status === 'disponivel')
    .filter((anuncio) => {
      if (!busca) return true;
      const termo = busca.toLowerCase();
      return (
        anuncio.titulo.toLowerCase().includes(termo) ||
        anuncio.descricao.toLowerCase().includes(termo)
      );
    })
    .filter((anuncio) => !categoria || anuncio.categoria === categoria)
    .filter((anuncio) => !tamanho || anuncio.tamanho === tamanho)
    .filter((anuncio) => !modalidade || anuncio.modalidade.toLowerCase() === modalidade.toLowerCase())
    .filter((anuncio) => {
      const valor = Number(anuncio.vats);
      const min = minVat !== '' ? Number(minVat) : 0;
      const max = maxVat !== '' ? Number(maxVat) : Infinity;
      return valor >= min && valor <= max;
    })
    .sort((a, b) => {
      if (ordenacao === 'menor_vat') return a.vats - b.vats;
      if (ordenacao === 'maior_vat') return b.vats - a.vats;
      if (ordenacao === 'recentes') return new Date(b.criadoEm) - new Date(a.criadoEm);
      return 0;
    });

  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      
      {/* BANNER */}
      <Box 
        sx={{ 
          bgcolor: (theme) => theme.palette.mode === 'light' ? 'primary.light' : 'primary.dark',
          color: 'white',
          borderRadius: 4,
          p: { xs: 4, md: 8 },
          textAlign: 'center',
          mb: 6,
          boxShadow: 2
        }}
      >
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2rem', md: '3.5rem' } }}>
          Estilo Sustentável, Economia Circular ♻️
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: '600px', mx: 'auto', fontSize: { xs: '1rem', md: '1.25rem' } }}>
          Renove seu guarda-roupa desapegando do que não usa e conquistando novas peças usando a moeda VAT.
        </Typography>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
          <Button 
            variant="contained" 
            color="secondary" 
            size="large" 
            startIcon={<StorefrontIcon />}
            onClick={handleScrollToCatalogo}
            sx={{ fontWeight: 'bold', px: 4, py: 1.5, width: { xs: '100%', sm: 'auto' } }}
          >
            Explorar Anúncios
          </Button>
          <Button 
            variant="outlined" 
            color="inherit" 
            size="large" 
            startIcon={<AddCircleOutlinedIcon />}
            onClick={() => navigate('/garagem')}
            sx={{ fontWeight: 'bold', px: 4, py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 }, width: { xs: '100%', sm: 'auto' } }}
          >
            Anunciar Peça
          </Button>
        </Stack>
      </Box>

      {/* CONTAINER DO MARKETPLACE */}
      <Box 
        ref={catalogoRef}
        id="catalogo-vitrine"
        sx={{ 
          display: 'grid', 
          // Trava a barra lateral em 280px fixos no desktop (md) e o resto vai pro conteúdo
          gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, 
          gap: 4, 
          alignItems: 'start',
          scrollMarginTop: '20px', 
          pb: 6 
        }}
      >
        
        {/* COLUNA ESQUERDA: SISTEMA DE FILTROS */}
        <Box 
          sx={{ 
            p: 3, 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            border: '1px solid rgba(255,255,255,0.08)', 
            position: { xs: 'static', md: 'sticky' }, 
            top: 90,
            width: '100%' // Garante preenchimento total
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Filtros</Typography>
            <Button size="small" startIcon={<FilterAltOffIcon />} onClick={handleLimparFiltros} color="secondary" sx={{ textTransform: 'none' }}>
              Limpar
            </Button>
          </Box>
          
          <Divider sx={{ mb: 2.5 }} />

          <Stack spacing={2.5}>
            <TextField select fullWidth label="Categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} size="small">
              <MenuItem value="camisa">CAMISA</MenuItem>
              <MenuItem value="calca">CALÇA</MenuItem>
              <MenuItem value="casaco">CASACO</MenuItem>
              <MenuItem value="calcado">CALÇADO</MenuItem>
              <MenuItem value="acessorio">ACESSÓRIO</MenuItem>
              <MenuItem value="outro">OUTRO</MenuItem>
            </TextField>

            <TextField select fullWidth label="Tamanho" value={tamanho} onChange={(e) => setTamanho(e.target.value)} size="small">
              {['PP', 'P', 'M', 'G', 'GG'].map((tam) => (
                <MenuItem key={tam} value={tam}>{tam}</MenuItem>
              ))}
            </TextField>

            <TextField select fullWidth label="Modalidade" value={modalidade} onChange={(e) => setModalidade(e.target.value)} size="small">
              {['Venda', 'Troca', 'Ambos'].map((mod) => (
                <MenuItem key={mod} value={mod}>{mod}</MenuItem>
              ))}
            </TextField>

            <Box>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                FAIXA DE VALOR (VAT)
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField type="number" label="Mín" value={minVat} onChange={(e) => setMinVat(e.target.value)} size="small" fullWidth />
                <TextField type="number" label="Máx" value={maxVat} onChange={(e) => setMaxVat(e.target.value)} size="small" fullWidth />
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* COLUNA DIREITA: BUSCA, ORDENAÇÃO E LISTAGEM DOS CARDS */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', minWidth: 0 }}>
          
          {/* BARRA DE PESQUISA SUPERIOR */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Pesquisar por título ou descrição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              sx={{ minWidth: { sm: 200 } }}
              label="Ordenar por"
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
            >
              <MenuItem value="recentes">Mais recentes</MenuItem>
              <MenuItem value="menor_vat">Menor preço (VAT)</MenuItem>
              <MenuItem value="maior_vat">Maior preço (VAT)</MenuItem>
            </TextField>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {anunciosFiltrados.length} {anunciosFiltrados.length === 1 ? 'anúncio encontrado' : 'anúncios encontrados'}
          </Typography>

          {/* GRID DE PRODUTOS */}
          {anunciosFiltrados.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2, width: '100%' }}>
              <Typography variant="h6" color="text.secondary" fontWeight="medium">
                Nenhum desapego encontrado com os filtros selecionados. 👕
              </Typography>
            </Box>
          ) : (
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)'
                },
                gap: 3,
                width: '100%'
              }}
            >
              {anunciosFiltrados.map((anuncio) => (
                <Card 
                  key={anuncio.id} 
                  variant="outlined"
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="220"
                    image={anuncio.foto}
                    alt={anuncio.titulo}
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                    sx={{ objectFit: 'cover' }}
                  />

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                      <Chip label={anuncio.categoria.toUpperCase()} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.7rem', height: 20 }} />
                      <Chip label={`Tam: ${anuncio.tamanho}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                      <Chip label={anuncio.conservacao} size="small" color="default" sx={{ fontSize: '0.7rem', height: 20, bgcolor: 'action.selected' }} />
                    </Stack>

                    <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ mb: 0.5 }}>
                      {anuncio.titulo}
                    </Typography>

                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden',
                        mb: 2,
                        minHeight: 40
                      }}
                    >
                      {anuncio.descricao}
                    </Typography>

                    <Box sx={{ mt: 'auto', pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" fontWeight="bold" color="secondary.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocalOfferIcon sx={{ fontSize: 14 }} /> {anuncio.modalidade}
                      </Typography>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {anuncio.vats} VATs
                      </Typography>
                    </Box>
                  </CardContent>

                  <Box sx={{ px: 2, pb: 2 }}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="primary" 
                      size="small"
                      onClick={() => navigate(`/anuncio/${anuncio.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
          )}

        </Box>
      </Box>
    </Container>
  );
}