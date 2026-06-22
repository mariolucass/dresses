import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Container, Typography, Box, Card, CardContent, 
  TextField, Button, Stack, InputAdornment, Alert 
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function Wallet() {
  const { usuarioLogado, atualizarPerfil } = useAuth();
  
  const [quantComprar, setQuantComprar] = useState('');
  const [quantSacar, setQuantSacar] = useState('');
  
  const [erroComprar, setErroComprar] = useState('');
  const [erroSacar, setErroSacar] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');

  const saldoAtual = usuarioLogado?.saldoVats ?? usuarioLogado?.vats ?? 0;

  const persistirNovoSaldo = (novoSaldo) => {
    if (!usuarioLogado) return;

    const usuarioAtualizado = {
      ...usuarioLogado,
      saldoVats: novoSaldo,
      vats: novoSaldo 
    };

    const usuariosLocais = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuariosAtualizados = usuariosLocais.map((u) => 
      u.id === usuarioLogado.id ? usuarioAtualizado : u
    );
    localStorage.setItem('usuarios', JSON.stringify(usuariosAtualizados));
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));

    if (atualizarPerfil) {
      atualizarPerfil(usuarioAtualizado);
    }
  };

  const handleComprar = (e) => {
    e.preventDefault();
    setErroComprar('');
    setSucessoMsg('');

    const valor = parseFloat(quantComprar);

    if (isNaN(valor) || valor <= 0) {
      setErroComprar('Insira um valor maior que 0 para comprar.');
      return;
    }

    const novoSaldo = saldoAtual + valor;
    persistirNovoSaldo(novoSaldo);
    
    setSucessoMsg(`Transação concluída! +${valor} VATs adicionados com sucesso.`);
    setQuantComprar('');
  };

  const handleSacar = (e) => {
    e.preventDefault();
    setErroSacar('');
    setSucessoMsg('');

    const valor = parseFloat(quantSacar);

    if (isNaN(valor) || valor <= 0) {
      setErroSacar('Insira um valor maior que 0 para retirar.');
      return;
    }

    if (valor > saldoAtual) {
      setErroSacar(`Operação inválida. Seu saldo atual é de ${saldoAtual} VATs.`);
      return;
    }

    const novoSaldo = saldoAtual - valor;
    persistirNovoSaldo(novoSaldo);

    setSucessoMsg(`Transação concluída! -${valor} VATs convertidos em dinheiro real.`);
    setQuantSacar('');
  };

  if (!usuarioLogado) {
    return (
      <Container maxWidth="sm" sx={{ pt: 10, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Faça login para gerenciar sua carteira de VATs.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ pt: { xs: 2, md: 4 }, pb: 6, px: { xs: 2, sm: 3 } }}>
      
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, fontSize: { xs: '1.8rem', sm: '2.125rem' } }}>
        Minha Carteira VAT
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Gerencie e simule transações com a moeda virtual exclusiva do ReVeste.
      </Typography>

      {sucessoMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSucessoMsg('')}>
          {sucessoMsg}
        </Alert>
      )}

      <Stack spacing={3}>
        
        <Card variant="outlined" sx={{ borderRadius: 4, bgcolor: 'background.paper', borderLeft: '6px solid', borderColor: 'primary.main' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 }, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AccountBalanceWalletIcon color="primary" sx={{ fontSize: '2.5rem' }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                SALDO DISPONÍVEL
              </Typography>
              <Typography variant="h4" fontWeight="900" color="text.primary" sx={{ mt: 0.5 }}>
                {saldoAtual} VATs
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          
          {/* COMPRAR */}
          <Card variant="outlined" sx={{ borderRadius: 4, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flexGrow: 1 }}>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddCircleIcon color="success" />
                <Typography variant="h6" fontWeight="bold">Comprar VATs</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Simule a adição de fundos à sua conta informando a quantidade desejada.
              </Typography>

              <Box component="form" onSubmit={handleComprar} noValidate>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantidade de VATs"
                  variant="outlined"
                  value={quantComprar}
                  onChange={(e) => setQuantComprar(e.target.value)}
                  error={!!erroComprar}
                  helperText={erroComprar}
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">VATs</InputAdornment>,
                      min: 1
                    }
                  }}
                  sx={{ mb: 2 }}
                />
                <Button 
                  fullWidth 
                  type="submit" 
                  variant="contained" 
                  color="success"
                  sx={{ py: 1.2, fontWeight: 'bold', textTransform: 'none', borderRadius: 2 }}
                >
                  Confirmar Compra
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* SACAR */}
          <Card variant="outlined" sx={{ borderRadius: 4, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flexGrow: 1 }}>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <RemoveCircleIcon color="error" />
                <Typography variant="h6" fontWeight="bold">Resgatar Dinheiro</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Troque seus VATs acumulados por dinheiro real fictício de forma simulada.
              </Typography>

              <Box component="form" onSubmit={handleSacar} noValidate>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantidade para Sacar"
                  variant="outlined"
                  value={quantSacar}
                  onChange={(e) => setQuantSacar(e.target.value)}
                  error={!!erroSacar}
                  helperText={erroSacar}
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">VATs</InputAdornment>,
                      min: 1
                    }
                  }}
                  sx={{ mb: 2 }}
                />
                <Button 
                  fullWidth 
                  type="submit" 
                  variant="contained" 
                  color="error"
                  sx={{ py: 1.2, fontWeight: 'bold', textTransform: 'none', borderRadius: 2 }}
                >
                  Confirmar Saque
                </Button>
              </Box>
            </CardContent>
          </Card>

        </Box>

        <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: 'action.hover', borderStyle: 'dashed' }}>
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Aviso:</strong> Integração com PIX em breve.
            </Typography>
          </CardContent>
        </Card>

      </Stack>
    </Container>
  );
}