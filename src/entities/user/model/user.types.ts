export type UserRole = 'COMPRADOR' | 'VENDEDOR' | 'AMBOS';

export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string; // hashed-like string (bcrypt simulado no localStorage)
  avatar?: string;
  saldoVAT: number;
  role: UserRole;
  bio?: string;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  userId: string;
  email: string;
  nome: string;
  avatar?: string;
  expiresAt: string;
}

export type CreateUserDto = Omit<
  User,
  'id' | 'saldoVAT' | 'avaliacaoMedia' | 'totalAvaliacoes' | 'createdAt' | 'updatedAt'
>;

export type UpdateUserDto = Partial<
  Pick<User, 'nome' | 'avatar' | 'bio' | 'role'>
>;
