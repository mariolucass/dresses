import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Box, Typography, TextField, Button, Card, CardContent, Link, Alert } from '@mui/material';
import { loginSchema, registerSchema } from '../validations/authValidation';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Escolhe dinamicamente o esquema de validação do Zod
  const { register: registerField, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  });

  const onSubmit = (data) => {
    setErrorMsg('');
    try {
        if (isRegister) {
        register(data);
        alert('Cadastro realizado com sucesso! Agora insira seus dados para entrar.');
        setIsRegister(false); // Joga o usuário para a tela de Login
        reset(); // Limpa os campos digitados
        } else {
        login(data.email, data.senha);
        navigate('/'); // Redireciona para a Página Inicial
        }
    } catch (err) {
        setErrorMsg(err.message);
    }
  };

  const handleToggleMode = () => {
    setIsRegister(!isRegister);
    setErrorMsg('');
    reset(); // Limpa os campos do formulário ao alternar
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card variant="outlined" sx={{ width: '100%', p: 2, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h1" align="center" fontWeight="bold" color="primary" gutterBottom>
              {isRegister ? 'Criar Conta no ReVeste' : 'Entrar no ReVeste'}
            </Typography>
            
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
              {isRegister ? 'Preencha os campos para desapegar e negociar' : 'Insira suas credenciais'}
            </Typography>

            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {isRegister && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Nome Completo"
                  error={!!errors.nome}
                  helperText={errors.nome?.message}
                  {...registerField('nome')}
                />
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                label="E-mail"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...registerField('email')}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Senha"
                type="password"
                error={!!errors.senha}
                helperText={errors.senha?.message}
                {...registerField('senha')}
              />

              {isRegister && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Telefone"
                    placeholder="(85) 99999-9999"
                    error={!!errors.telefone}
                    helperText={errors.telefone?.message}
                    {...registerField('telefone')}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Endereço Completo"
                    error={!!errors.endereco}
                    helperText={errors.endereco?.message}
                    {...registerField('endereco')}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    label="URL do Avatar (Opcional)"
                    error={!!errors.avatar}
                    helperText={errors.avatar?.message}
                    {...registerField('avatar')}
                  />
                </>
              )}

              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, py: 1.2 }}>
                {isRegister ? 'Cadastrar' : 'Entrar'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Link component="button" type="button" variant="body2" onClick={handleToggleMode} underline="hover">
                  {isRegister ? 'Já tem uma conta? Entre aqui' : 'Não tem uma conta? Cadastre-se'}
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}