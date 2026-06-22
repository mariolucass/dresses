import { z } from 'zod';

// Validação para a Tela de Login
export const loginSchema = z.object({
  email: z.string().email('Insira um e-mail válido'),
  senha: z.string().min(1, 'A senha é obrigatória'),
});

// Validação para a Tela de Cadastro
export const registerSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Insira um e-mail válido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  telefone: z.string().min(10, 'Insira um telefone válido com DDD'),
  endereco: z.string().min(5, 'Insira o endereço completo'),
  avatar: z.string().url('O avatar deve ser uma URL válida').or(z.literal('')), // Opcional ou Vazio
});