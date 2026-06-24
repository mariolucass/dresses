import type { Anuncio } from "@entities/anuncio/model/anuncio.types";
import type { Avaliacao } from "@entities/avaliacao/model/avaliacao.types";
import type { Mensagem } from "@entities/mensagem/model/mensagem.types";
import type { Proposta } from "@entities/proposta/model/proposta.types";
import type { TransacaoVAT } from "@entities/transacao-vat/model/transacao-vat.types";
import type { User } from "@entities/user/model/user.types";
import { generateId, now } from "@shared/lib/id-generator";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import {
  mockAnuncios,
  mockAvaliacoes,
  mockMensagens,
  mockPropostas,
  mockRegisters,
  mockVatTransacoes,
} from "@shared/mocks";

function seedUsers(): User[] {
  const users: User[] = mockRegisters.map((u) => ({
    id: generateId(),
    nome: u.nome,
    email: u.email,
    senha: `hashed_${u.senha}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.nome)}`,
    saldoVAT: 500,
    role: u.role,
    avaliacaoMedia: 4.5,
    totalAvaliacoes: 2,
    createdAt: now(),
    updatedAt: now(),
  }));

  users.push({
    id: generateId(),
    nome: "Joao Vitor",
    email: "joao@mail.com",
    senha: "hashed_password123",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Joao%20Vitor`,
    saldoVAT: 500,
    role: "AMBOS",
    avaliacaoMedia: 5,
    totalAvaliacoes: 0,
    createdAt: now(),
    updatedAt: now(),
  });

  storage.setItem(STORAGE_KEYS.USERS, users);
  return users;
}

function seedAnuncios(users: User[]): Anuncio[] {
  const anuncios: Anuncio[] = mockAnuncios.map((a) => ({
    id: a.id || generateId(),
    titulo: a.titulo,
    descricao: a.descricao,
    fotos: a.fotos,
    preco: a.preco,
    valorVAT: a.valorVAT,
    tipo: a.tipo,
    categoria: a.categoria,
    condicao: a.condicao,
    tamanho: a.tamanho,
    status: "DISPONIVEL",
    userId: users[Math.floor(Math.random() * users.length)]!.id,
    views: Math.floor(Math.random() * 100),
    createdAt: now(),
    updatedAt: now(),
  }));
  storage.setItem(STORAGE_KEYS.ANUNCIOS, anuncios);
  return anuncios;
}

function seedTransacoesVAT(users: User[]): void {
  const transacoes: TransacaoVAT[] = mockVatTransacoes.map((t) => ({
    id: generateId(),
    userId: users[Math.floor(Math.random() * users.length)]!.id,
    tipo: t.tipo,
    valor: t.valor,
    saldoAnterior: 0,
    saldoPosterior: t.valor,
    descricao: t.descricao,
    motivo: t.motivo,
    negociacaoId: t.negociacaoId,
    createdAt: now(),
  }));
  storage.setItem(STORAGE_KEYS.TRANSACOES_VAT, transacoes);
}

function seedAvaliacoes(users: User[]): void {
  const usersByEmail = new Map(users.map((user) => [user.email, user]));
  const avaliacoes: Avaliacao[] = mockAvaliacoes.flatMap((mock) => {
    const avaliador = usersByEmail.get(mock.avaliadorEmail);
    const avaliado = usersByEmail.get(mock.avaliadoEmail);
    if (!avaliador || !avaliado || avaliador.id === avaliado.id) return [];

    return [
      {
        id: mock.id,
        negociacaoId: mock.negociacaoId,
        avaliadorId: avaliador.id,
        avaliadoId: avaliado.id,
        nota: mock.nota,
        comentario: mock.comentario,
        createdAt: mock.createdAt,
      },
    ];
  });
  storage.setItem(STORAGE_KEYS.AVALIACOES, avaliacoes);

  users.forEach((user) => {
    const recebidas = avaliacoes.filter(
      (avaliacao) => avaliacao.avaliadoId === user.id,
    );
    const media = recebidas.length
      ? recebidas.reduce((total, avaliacao) => total + avaliacao.nota, 0) /
        recebidas.length
      : 0;

    storage.updateInCollection<User>(STORAGE_KEYS.USERS, user.id, {
      avaliacaoMedia: Math.round(media * 10) / 10,
      totalAvaliacoes: recebidas.length,
    });
  });
}

function seedMensagens(users: User[]): void {
  const mensagens: Mensagem[] = mockMensagens.map((msg) => ({
    id: generateId(),
    negociacaoId: msg.negociacaoId,
    remetenteId: users[Math.floor(Math.random() * users.length)]!.id,
    texto: msg.texto,
    tipo: msg.tipo,
    lida: false,
    createdAt: now(),
  }));
  storage.setItem(STORAGE_KEYS.MENSAGENS, mensagens);
}

function seedPropostas(users: User[]): void {
  const propostas: Proposta[] = mockPropostas.map((prop) => ({
    id: prop.id || generateId(),
    anuncioId: prop.anuncioId,
    compradorId: users[Math.floor(Math.random() * users.length)]!.id,
    vendedorId: users[Math.floor(Math.random() * users.length)]!.id,
    tipo: prop.tipo,
    valorOfertado: prop.valorOfertado,
    vatOfertado: prop.vatOfertado,
    itensOfertados: prop.itensOfertados,
    status: "PENDENTE",
    createdAt: now(),
    updatedAt: now(),
  }));
  storage.setItem(STORAGE_KEYS.PROPOSTAS, propostas);
}

/**
 * Inicializa o banco de dados do localStorage com dados de exemplo.
 * Executar apenas uma vez (verificado via flag SEEDED).
 */
export function seedDatabase(): void {
  if (typeof window === "undefined") return;
  if (storage.getItem<boolean>(STORAGE_KEYS.SEEDED)) return;

  const users = seedUsers();
  seedAnuncios(users);
  seedTransacoesVAT(users);
  seedAvaliacoes(users);
  seedMensagens(users);
  seedPropostas(users);

  storage.setItem(STORAGE_KEYS.SEEDED, true);
  console.info(
    "[seed] Banco de dados inicializado com dados de exemplo (mocks customizados).",
  );
}

/**
 * Reseta o banco de dados (útil para desenvolvimento).
 */
export function resetDatabase(): void {
  if (typeof window === "undefined") return;
  storage.clear();
  console.info("[seed] Banco de dados resetado.");
}
