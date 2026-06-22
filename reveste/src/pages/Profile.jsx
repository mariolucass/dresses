import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../validations/authValidation';
import {
  Container, Box, Typography, Card, CardContent, Avatar, Button,
  Divider, Stack, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function Profile() {
  const { usuarioLogado, atualizarPerfil } = useAuth();
  const { negociacoes = [], avaliacoes = [] } = useStore();
  const [openModal, setOpenModal] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(profileSchema)
  });

  if (!usuarioLogado) {
    return (
      <Container maxWidth="sm" sx={{ pt: 10, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Você precisa estar autenticado para acessar o perfil.
        </Typography>
      </Container>
    );
  }

  const totalNegociacoesConcluidas = negociacoes.filter(
    (n) => (n.usuarioId === usuarioLogado.id || n.donoId === usuarioLogado.id) && n.status === 'concluida'
  ).length;

  const notasRecebidas = avaliacoes.filter((a) => a.usuarioDestinoId === usuarioLogado.id);
  const mediaAvaliacoesDerivada = notasRecebidas.length > 0
    ? (notasRecebidas.reduce((soma, item) => soma + item.nota, 0) / notasRecebidas.length).toFixed(1)
    : '5.0';

  const handleOpenEdit = () => {
    setValue('nome', usuarioLogado.nome);
    setValue('email', usuarioLogado.email);
    setValue('telefone', usuarioLogado.telefone);
    setValue('endereco', usuarioLogado.endereco);
    setValue('avatar', usuarioLogado.avatar || '');
    setValue('senha', usuarioLogado.senha);
    setOpenModal(true);
  };

  const onSubmit = (data) => {
    try {
      atualizarPerfil(data);
      setOpenModal(false);
      alert('Perfil updated!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ pt: { xs: 2, sm: 4 }, pb: { xs: 6, sm: 8 }, px: { xs: 2, sm: 3 } }}>
      
      <Stack spacing={3}>
        
        {/* CARD PRINCIPAL: Avatar, Nome e Carteira */}
        <Card variant="outlined" sx={{ borderRadius: 4, p: { xs: 3, sm: 4 }, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, maxWidth: 360, mx: 'auto' }}>
            <Avatar
              src={usuarioLogado.avatar}
              alt={usuarioLogado.nome}
              sx={{ width: 110, height: 110, bgcolor: 'primary.main', fontSize: '2.5rem', boxShadow: 2 }}
            >
              {usuarioLogado.nome.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ wordBreak: 'break-word', mb: 0.5 }}>
                {usuarioLogado.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary">Membro do Eco-Marketplace</Typography>
            </Box>

            <Paper 
              variant="outlined" 
              sx={{ 
                width: '100%', 
                py: 1.8, 
                px: 2,
                borderRadius: 3, 
                bgcolor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5
              }}
            >
              <AccountBalanceWalletIcon color="primary" />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold', lineHeight: 1.2 }}>
                  CARTEIRA DE VATS
                </Typography>
                <Typography variant="h6" fontWeight="900" color="primary.main" sx={{ lineHeight: 1.2 }}>
                  {usuarioLogado.saldoVats ?? usuarioLogado.vats ?? 0} VATs
                </Typography>
              </Box>
            </Paper>

            <Button
              fullWidth
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleOpenEdit}
              sx={{ textTransform: 'none', fontWeight: 'bold', py: 1.2, borderRadius: 2 }}
            >
              Editar Dados
            </Button>
          </Box>
        </Card>

        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center',
              gap: 1 
            }}
          >
            <Avatar sx={{ bgcolor: 'warning.light', width: 44, height: 44 }}>
              <StarIcon sx={{ color: 'warning.dark', fontSize: '1.4rem' }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.1 }}>{mediaAvaliacoesDerivada}</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight="medium">Avaliações</Typography>
            </Box>
          </Paper>

          <Paper 
            variant="outlined" 
            sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center',
              gap: 1 
            }}
          >
            <Avatar sx={{ bgcolor: 'success.light', width: 44, height: 44 }}>
              <HandshakeIcon sx={{ color: 'success.dark', fontSize: '1.4rem' }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.1 }}>{totalNegociacoesConcluidas}</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight="medium">Trocas</Typography>
            </Box>
          </Paper>
        </Box>

        {/* CARD INFORMAÇÕES DE CADASTRO */}
        <Card variant="outlined" sx={{ borderRadius: 4, width: '100%' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
              Informações de Cadastro e Envio
            </Typography>
            
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <EmailIcon color="action" sx={{ mt: 0.3, fontSize: '1.3rem' }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>E-mail</Typography>
                  <Typography variant="body2" fontWeight="medium" sx={{ wordBreak: 'break-all' }}>
                    {usuarioLogado.email}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <PhoneIcon color="action" sx={{ mt: 0.3, fontSize: '1.3rem' }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>Telefone</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {usuarioLogado.telefone}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <HomeIcon color="action" sx={{ mt: 0.3, fontSize: '1.3rem' }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.2 }}>Endereço Postal</Typography>
                  <Typography variant="body2" fontWeight="medium" sx={{ lineHeight: 1.4, wordBreak: 'break-word' }}>
                    {usuarioLogado.endereco}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>

      </Stack>

      {/* DIALOG DE EDIÇÃO */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle fontWeight="bold">Modificar Meus Dados</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent dividers sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <TextField fullWidth variant="outlined" label="Nome Completo" error={!!errors.nome} helperText={errors.nome?.message} {...register('nome')} />
              <TextField fullWidth variant="outlined" label="E-mail" error={!!errors.email} helperText={errors.email?.message} {...register('email')} />
              <TextField fullWidth variant="outlined" label="Telefone / WhatsApp" error={!!errors.telefone} helperText={errors.telefone?.message} {...register('telefone')} />
              <TextField fullWidth variant="outlined" label="Endereço de Entrega" error={!!errors.endereco} helperText={errors.endereco?.message} {...register('endereco')} />
              <TextField fullWidth variant="outlined" label="Link do Avatar (Opcional)" error={!!errors.avatar} helperText={errors.avatar?.message} {...register('avatar')} />
              <TextField fullWidth variant="outlined" type="password" label="Confirmar ou Mudar Senha" error={!!errors.senha} helperText={errors.senha?.message} {...register('senha')} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenModal(false)} color="inherit">Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ px: 3, ml: 2 }}>Salvar</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
}