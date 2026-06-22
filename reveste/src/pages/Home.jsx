import { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, MenuItem, 
  Card, CardMedia, CardContent, Button, Chip, Divider, Stack, InputAdornment,
  Skeleton
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

  // ESTADOS DOS FILTROS E BUSCA
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [minVat, setMinVat] = useState('');
  const [maxVat, setMaxVat] = useState('');
  const [ordenacao, setOrdenacao] = useState('recentes');
  
  // Loading nas transições de filtros
  const [carregando, setCarregando] = useState(false);

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

  // Loading suave sempre que qualquer filtro mudar
  useEffect(() => {
    setCarregando(true);
    const timer = setTimeout(() => {
      setCarregando(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [busca, categoria, tamanho, modalidade, minVat, maxVat, ordenacao]);

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
      
      {/* BANNER COM TRANSIÇÃO DE ENTRADA SUAVE */}
      <Box 
        sx={{ 
          bgcolor: (theme) => theme.palette.mode === 'light' ? 'primary.light' : 'primary.dark',
          color: 'white',
          borderRadius: 4,
          p: { xs: 4, md: 8 },
          textAlign: 'center',
          mb: 6,
          boxShadow: 2,
          animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          '@keyframes fadeInUp': {
            from: { opacity: 0, transform: 'translateY(15px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}
      >
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2rem', md: '4rem' } }}>
          Estilo Sustentável, Economia Circular
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.7, maxWidth: '600px', mx: 'auto', fontSize: { xs: '1rem', md: '1.25rem' } }}>
          Renove seu guarda-roupa desapegando do que não usa e conquistando novas peças usando os seus VATs.
        </Typography>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
          <Button 
            variant="contained" 
            color="secondary" 
            size="large" 
            startIcon={<StorefrontIcon />}
            onClick={handleScrollToCatalogo}
            sx={{ 
              fontWeight: 'bold', 
              px: 4, 
              py: 1.5, 
              width: { xs: '100%', sm: 'auto' },
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': { transform: 'scale(1.05)', boxShadow: 4 }
            }}
          >
            Explorar Anúncios
          </Button>
          <Button 
            variant="outlined" 
            color="inherit" 
            size="large" 
            startIcon={<AddCircleOutlinedIcon />}
            onClick={() => navigate('/garagem')}
            sx={{ 
              fontWeight: 'bold', 
              px: 4, 
              py: 1.5, 
              borderWidth: 2, 
              width: { xs: '100%', sm: 'auto' },
              transition: 'all 0.2s ease',
              '&:hover': { borderWidth: 2, bgcolor: 'rgba(255,255,255,0.08)', transform: 'scale(1.05)' }
            }}
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
            width: '100%',
            transition: 'box-shadow 0.3s ease',
            '&:focus-within': { boxShadow: '0 0 0 2px rgba(46, 125, 50, 0.2)' }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Filtros</Typography>
            <Button 
              size="small" 
              startIcon={<FilterAltOffIcon />} 
              onClick={handleLimparFiltros} 
              color="secondary" 
              sx={{ 
                textTransform: 'none',
                transition: 'all 0.2s',
                '&:active': { transform: 'scale(0.95)' }
              }}
            >
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
          {carregando ? (
            // Mostra Skeletons alinhados com o grid original durante transições
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3, width: '100%' }}>
              {[1, 2, 3].map((n) => (
                <Card key={n} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Skeleton variant="rectangular" height={220} animation="wave" />
                  <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}><Skeleton width="40%" height={20} /><Skeleton width="30%" height={20} /></Stack>
                    <Skeleton width="80%" height={24} sx={{ mb: 1 }} />
                    <Skeleton width="100%" height={40} sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Skeleton width="30%" /><Skeleton width="20%" /></Box>
                  </CardContent>
                  <Box sx={{ p: 2 }}><Skeleton variant="rectangular" height={30} /></Box>
                </Card>
              ))}
            </Box>
          ) : anunciosFiltrados.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2, width: '100%', animation: 'fadeIn 0.4s ease' }}>
              <Typography variant="h6" color="text.secondary" fontWeight="medium">
                Nenhum desapego encontrado com os filtros selecionados.       
              </Typography>
            </Box>
          ) : (
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 3,
                width: '100%',
                animation: 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } }
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
                    overflow: 'hidden',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-6px)', // Eleva levemente o card
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      '& .card-media-zoom': { transform: 'scale(1.05)' }
                    }
                  }}
                >
                  <Box sx={{ overflow: 'hidden', height: 220, position: 'relative' }}>
                    <CardMedia
                      component="img"
                      className="card-media-zoom"
                      image={anuncio.foto}
                      alt={anuncio.titulo}
                      onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                      sx={{ 
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                  </Box>

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
                      sx={{
                        transition: 'all 0.2s ease',
                        '&:active': { transform: 'scale(0.98)' }
                      }}
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