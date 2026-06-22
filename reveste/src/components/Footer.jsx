import { Box, Container, Typography, Link, Stack } from '@mui/material';

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4, 
        px: 2, 
        mt: 'auto', // Joga o rodapé para o fim da página
        backgroundColor: (theme) => 
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 3,
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >

          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              ReVeste ♻️
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: '300px' }}>
              Sua garagem virtual de desapegos, economia circular e trocas inteligentes usando VATs.
            </Typography>
          </Box>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 2, sm: 4 }}
            alignItems="center"
          >
            <Link href="#" color="text.secondary" variant="body2" underline="hover">
              Sobre o ReVeste
            </Link>
            <Link href="#" color="text.secondary" variant="body2" underline="hover">
              Como Funciona
            </Link>
            <Link href="#" color="text.secondary" variant="body2" underline="hover">
              Termos de Uso
            </Link>
            <Link href="#" color="text.secondary" variant="body2" underline="hover">
              Suporte
            </Link>
          </Stack>
        </Box>
        
        <Box 
          sx={{ 
            mt: 4, 
            pt: 2, 
            borderTop: '1px solid', 
            borderColor: 'rgba(0, 0, 0, 0.06)', 
            textAlign: 'center' 
          }}
        >
          <Typography variant="caption" color="text.secondary">
            &copy; {anoAtual} ReVeste. Todos os direitos reservados. Feito com &💚; para o futuro da moda sustentável.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}