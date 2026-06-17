import type { User } from '@entities/user/model/user.types';
import type { Anuncio } from '@entities/anuncio/model/anuncio.types';
import type { TransacaoVAT } from '@entities/transacao-vat/model/transacao-vat.types';
import { storage, STORAGE_KEYS } from '@shared/lib/storage';
import { generateId, now } from '@shared/lib/id-generator';

const SEED_USERS: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    nome: 'Ana Silva',
    email: 'ana@brecho.com',
    senha: 'hashed_senha123',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Ana`,
    saldoVAT: 150,
    role: 'AMBOS',
    bio: 'Apaixonada por moda sustentável! ♻️',
    avaliacaoMedia: 4.8,
    totalAvaliacoes: 24,
  },
  {
    nome: 'Bruno Costa',
    email: 'bruno@brecho.com',
    senha: 'hashed_senha456',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Bruno`,
    saldoVAT: 80,
    role: 'VENDEDOR',
    bio: 'Renovando o guarda-roupa todo mês!',
    avaliacaoMedia: 4.5,
    totalAvaliacoes: 11,
  },
  {
    nome: 'Carla Mendes',
    email: 'carla@brecho.com',
    senha: 'hashed_senha789',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Carla`,
    saldoVAT: 200,
    role: 'COMPRADOR',
    bio: 'Buscando peças únicas e especiais.',
    avaliacaoMedia: 5.0,
    totalAvaliacoes: 7,
  },
];

function seedUsers(): User[] {
  const users: User[] = SEED_USERS.map((u) => ({
    ...u,
    id: generateId(),
    createdAt: now(),
    updatedAt: now(),
  }));
  storage.setItem(STORAGE_KEYS.USERS, users);
  return users;
}

function seedAnuncios(users: User[]): Anuncio[] {
  const anuncios: Anuncio[] = [
    {
      id: generateId(),
      titulo: 'Vestido Floral Verão',
      descricao: 'Vestido midi floral, levíssimo, perfeito para o verão. Usado apenas uma vez em viagem.',
      fotos: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'],
      preco: 85,
      valorVAT: 50,
      tipo: 'AMBOS',
      categoria: 'ROUPAS_FEMININAS',
      condicao: 'SEMINOVO',
      tamanho: 'M',
      status: 'DISPONIVEL',
      userId: users[0]!.id,
      views: 34,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: generateId(),
      titulo: 'Jaqueta Jeans Clássica',
      descricao: 'Jaqueta jeans oversized anos 90, estilo vintage. Em ótimo estado.',
      fotos: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
      preco: 120,
      tipo: 'VENDA',
      categoria: 'ROUPAS_FEMININAS',
      condicao: 'USADO_BOM',
      tamanho: 'G',
      status: 'DISPONIVEL',
      userId: users[0]!.id,
      views: 58,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: generateId(),
      titulo: 'Tênis Casual Masculino',
      descricao: 'Tênis branco casual, tamanho 42. Aceito troca por outro calçado.',
      fotos: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
      valorVAT: 80,
      tipo: 'TROCA',
      categoria: 'CALCADOS',
      condicao: 'SEMINOVO',
      tamanho: '42',
      status: 'DISPONIVEL',
      userId: users[1]!.id,
      views: 21,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: generateId(),
      titulo: 'Blazer Social Listrado',
      descricao: 'Blazer listrado azul e branco, corte slim. Ideal para reuniões e eventos.',
      fotos: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4d03?w=400'],
      preco: 160,
      valorVAT: 100,
      tipo: 'AMBOS',
      categoria: 'ROUPAS_MASCULINAS',
      condicao: 'NOVO',
      tamanho: 'G',
      status: 'DISPONIVEL',
      userId: users[1]!.id,
      views: 45,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: generateId(),
      titulo: 'Bolsa de Couro Vintage',
      descricao: 'Bolsa de couro legítimo, modelo envelope. Peça rara de garimpo.',
      fotos: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
      preco: 250,
      tipo: 'VENDA',
      categoria: 'BOLSAS',
      condicao: 'USADO_BOM',
      tamanho: 'UNICO',
      status: 'DISPONIVEL',
      userId: users[2]!.id,
      views: 112,
      createdAt: now(),
      updatedAt: now(),
    },
  ];
  storage.setItem(STORAGE_KEYS.ANUNCIOS, anuncios);
  return anuncios;
}

function seedTransacoesVAT(users: User[]): void {
  const transacoes: TransacaoVAT[] = users.map((u) => ({
    id: generateId(),
    userId: u.id,
    tipo: 'CREDITO' as const,
    valor: u.saldoVAT,
    saldoAnterior: 0,
    saldoPosterior: u.saldoVAT,
    descricao: 'Bônus de boas-vindas ao Brechó Online!',
    motivo: 'CADASTRO_BONUS' as const,
    createdAt: now(),
  }));
  storage.setItem(STORAGE_KEYS.TRANSACOES_VAT, transacoes);
}

/**
 * Inicializa o banco de dados do localStorage com dados de exemplo.
 * Executar apenas uma vez (verificado via flag SEEDED).
 */
export function seedDatabase(): void {
  if (typeof window === 'undefined') return;
  if (storage.getItem<boolean>(STORAGE_KEYS.SEEDED)) return;

  const users = seedUsers();
  seedAnuncios(users);
  seedTransacoesVAT(users);

  storage.setItem(STORAGE_KEYS.SEEDED, true);
  console.info('[seed] Banco de dados inicializado com dados de exemplo.');
}

/**
 * Reseta o banco de dados (útil para desenvolvimento).
 */
export function resetDatabase(): void {
  if (typeof window === 'undefined') return;
  storage.clear();
  console.info('[seed] Banco de dados resetado.');
}
