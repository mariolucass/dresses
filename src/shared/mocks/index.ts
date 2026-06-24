import type { Avaliacao } from "@/entities/avaliacao";
import { AnuncioFormData } from "@/features/anuncios/model/anuncio-schemas";
import {
  LoginFormData,
  RegisterFormData,
} from "@/features/auth/model/auth-schemas";
import { MensagemFormData } from "@/features/chat/model/chat-schemas";
import { GaragemFilters } from "@/features/garagem/model/garagem-schemas";
import { PropostaFormData } from "@/features/negociacao/model/negociacao-schemas";
import { VatTransacaoFormData } from "@/features/vat/model/vat-schemas";

// --- CHAT MOCKS ---
export const mockMensagens: MensagemFormData[] = [
  {
    negociacaoId: "neg_1",
    remetenteId: "user_1",
    texto: "Olá! O vestido ainda está disponível?",
    tipo: "TEXTO",
  },
  {
    negociacaoId: "neg_1",
    remetenteId: "user_2",
    texto: "Sim, está sim! Pronta entrega.",
    tipo: "TEXTO",
  },
  {
    negociacaoId: "neg_1",
    remetenteId: "system",
    texto: "O usuário fez uma proposta de R$ 300.",
    tipo: "SISTEMA",
  },
];

// --- GARAGEM MOCKS ---
export const mockGaragemFilters: GaragemFilters[] = [
  { status: "DISPONIVEL" },
  { status: "EM_NEGOCIACAO" },
  { status: "FINALIZADO" },
];

// --- NEGOCIACAO MOCKS ---
export const mockPropostas: (PropostaFormData & { id: string })[] = [
  {
    id: "prop_1",
    anuncioId: "anun_1",
    vendedorId: "user_2",
    tipo: "COMPRA",
    valorOfertado: 300.0,
    itensOfertados: [],
    itensDesejados: [],
    mensagemInicial: "Aceita 300 reais no vestido?",
  },
  {
    id: "prop_2",
    anuncioId: "anun_2",
    vendedorId: "user_3",
    tipo: "TROCA",
    itensOfertados: [{ anuncioId: "anun_3" }],
    itensDesejados: [{ anuncioId: "anun_2" }],
    mensagemInicial: "Troca na minha bota nova?",
  },
  {
    id: "prop_3",
    anuncioId: "anun_3",
    vendedorId: "user_1",
    tipo: "MISTA",
    valorOfertado: 100.0,
    itensOfertados: [{ anuncioId: "anun_2" }],
    itensDesejados: [{ anuncioId: "anun_3" }],
    mensagemInicial: "Dou a jaqueta e mais 100 reais, o que acha?",
  },
];

// =============================================================================
// AUTH MOCKS
// =============================================================================

/**
 * Fonte única de verdade para usuários mock.
 * Os e-mails são usados como chave de relacionamento em avaliações e VAT.
 */
const MOCK_USERS = [
  {
    nome: "Ana Silva",
    email: "ana.silva@example.com",
    senha: "password123",
    role: "COMPRADOR" as const,
  },
  {
    nome: "Carlos Eduardo",
    email: "carlos.edu@example.com",
    senha: "securePass!1",
    role: "VENDEDOR" as const,
  },
  {
    nome: "Mariana Costa",
    email: "mariana.costa@example.com",
    senha: "mysecretpassword",
    role: "AMBOS" as const,
  },
  {
    nome: "Carol Mendes",
    email: "carol.mendes@example.com",
    senha: "carol@Pass2",
    role: "COMPRADOR" as const,
  },
  {
    nome: "Mario Andrade",
    email: "mario.andrade@example.com",
    senha: "mario@Pass3",
    role: "VENDEDOR" as const,
  },
  {
    nome: "João Vitor Nascimento",
    email: "joao.vitor@example.com",
    senha: "joaovitor@Pass4",
    role: "AMBOS" as const,
  },
] satisfies Array<{
  nome: string;
  email: string;
  senha: string;
  role: RegisterFormData["role"];
}>;

export const mockRegisters: RegisterFormData[] = MOCK_USERS.map((user) => ({
  nome: user.nome,
  email: user.email,
  senha: user.senha,
  confirmarSenha: user.senha,
  role: user.role,
}));

export const mockLogins: LoginFormData[] = MOCK_USERS.map((user) => ({
  email: user.email,
  senha: user.senha,
}));

// =============================================================================
// ANÚNCIOS MOCKS
// =============================================================================

export const mockAnuncios: (AnuncioFormData & { id: string })[] = [
  // --- Usuários originais ---
  {
    id: "anun_1",
    titulo: "Vestido de Festa Longo Vermelho",
    descricao:
      "Lindo vestido vermelho, usado apenas uma vez. Ideal para casamentos e formaturas.",
    fotos: [
      "https://plus.unsplash.com/premium_photo-1675186049409-f9f8f60ebb5e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    preco: 350.0,
    tipo: "VENDA",
    categoria: "FESTA",
    condicao: "SEMINOVO",
    tamanho: "M",
  },
  {
    id: "anun_2",
    titulo: "Jaqueta de Couro Sintético",
    descricao:
      "Jaqueta preta estilosa, combina com qualquer look. Aceito propostas de troca por botas.",
    fotos: ["https://images.unsplash.com/photo-1551028719-00167b16eac5"],
    valorVAT: 150.0,
    tipo: "TROCA",
    categoria: "ROUPAS_FEMININAS",
    condicao: "USADO_BOM",
    tamanho: "P",
  },
  {
    id: "anun_3",
    titulo: "Tênis Esportivo Corrida",
    descricao:
      "Tênis muito confortável para corridas e caminhadas. Disponível para venda ou troca.",
    fotos: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
    preco: 200.0,
    valorVAT: 220.0,
    tipo: "AMBOS",
    categoria: "CALCADOS",
    condicao: "NOVO",
    tamanho: "40",
  },
  // --- Carol Mendes ---
  {
    id: "anun_4",
    titulo: "Colar Dourado Delicado",
    descricao:
      "Colar banhado a ouro, perfeito para looks casuais e sociais. Sem sinais de uso.",
    fotos: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f"],
    preco: 80.0,
    tipo: "VENDA",
    categoria: "ACESSORIOS",
    condicao: "NOVO",
    tamanho: "UNICO",
  },
  // --- Mario Andrade ---
  {
    id: "anun_5",
    titulo: "Camisa Social Slim Fit Azul",
    descricao:
      "Camisa masculina de algodão, corte slim fit. Usada poucas vezes, sem manchas ou defeitos.",
    fotos: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"],
    preco: 120.0,
    valorVAT: 100.0,
    tipo: "AMBOS",
    categoria: "ROUPAS_MASCULINAS",
    condicao: "SEMINOVO",
    tamanho: "G",
  },
  // --- João Vitor Nascimento ---
  {
    id: "anun_6",
    titulo: "Bolsa Transversal Feminina",
    descricao:
      "Bolsa de couro sintético marrom, com alça regulável. Ótimo estado, acompanha necessaire.",
    fotos: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa"],
    preco: 180.0,
    tipo: "VENDA",
    categoria: "ACESSORIOS",
    condicao: "USADO_BOM",
    tamanho: "UNICO",
  },
];

// =============================================================================
// AVALIAÇÕES MOCKS
// =============================================================================

/**
 * Os e-mails são resolvidos para IDs reais durante o seed. Isso mantém os
 * relacionamentos determinísticos mesmo que os usuários recebam IDs aleatórios.
 */
export type MockAvaliacao = Pick<
  Avaliacao,
  "id" | "negociacaoId" | "nota" | "comentario" | "createdAt"
> & {
  avaliadorEmail: string;
  avaliadoEmail: string;
};

export const mockAvaliacoes: MockAvaliacao[] = [
  // --- Avaliações originais ---
  {
    id: "aval_1",
    negociacaoId: "neg_1",
    avaliadorEmail: "ana.silva@example.com",
    avaliadoEmail: "carlos.edu@example.com",
    nota: 5,
    comentario:
      "Negociação excelente. A peça estava exatamente como descrita e o envio foi muito rápido.",
    createdAt: "2026-06-18T14:30:00.000Z",
  },
  {
    id: "aval_2",
    negociacaoId: "neg_2",
    avaliadorEmail: "carlos.edu@example.com",
    avaliadoEmail: "ana.silva@example.com",
    nota: 4,
    comentario:
      "A troca foi tranquila e a comunicação foi ótima. Só demorou um pouco para postar.",
    createdAt: "2026-06-16T10:15:00.000Z",
  },
  {
    id: "aval_3",
    negociacaoId: "neg_3",
    avaliadorEmail: "mariana.costa@example.com",
    avaliadoEmail: "ana.silva@example.com",
    nota: 5,
    comentario:
      "Muito cuidadosa e transparente durante toda a negociação. Recomendo!",
    createdAt: "2026-06-12T19:45:00.000Z",
  },
  {
    id: "aval_4",
    negociacaoId: "neg_4",
    avaliadorEmail: "ana.silva@example.com",
    avaliadoEmail: "mariana.costa@example.com",
    nota: 5,
    comentario:
      "A peça chegou impecável e ainda veio com um bilhete super gentil.",
    createdAt: "2026-06-09T13:20:00.000Z",
  },
  {
    id: "aval_5",
    negociacaoId: "neg_5",
    avaliadorEmail: "mariana.costa@example.com",
    avaliadoEmail: "carlos.edu@example.com",
    nota: 4,
    comentario:
      "Produto em ótimo estado e negociação objetiva. Compraria novamente.",
    createdAt: "2026-06-04T16:05:00.000Z",
  },
  {
    id: "aval_6",
    negociacaoId: "neg_6",
    avaliadorEmail: "carlos.edu@example.com",
    avaliadoEmail: "mariana.costa@example.com",
    nota: 5,
    comentario:
      "Experiência perfeita do início ao fim. Comunicação rápida e peça muito bem cuidada.",
    createdAt: "2026-05-29T11:40:00.000Z",
  },
  // --- Avaliações com os novos usuários ---
  {
    id: "aval_7",
    negociacaoId: "neg_7",
    avaliadorEmail: "carol.mendes@example.com",
    avaliadoEmail: "mario.andrade@example.com",
    nota: 5,
    comentario:
      "Mario foi super atencioso e a camisa veio muito bem embalada. Amei a compra!",
    createdAt: "2026-06-20T09:00:00.000Z",
  },
  {
    id: "aval_8",
    negociacaoId: "neg_8",
    avaliadorEmail: "mario.andrade@example.com",
    avaliadoEmail: "carol.mendes@example.com",
    nota: 4,
    comentario:
      "Ótima compradora, pagamento rápido e comunicação clara. Recomendo.",
    createdAt: "2026-06-20T10:30:00.000Z",
  },
  {
    id: "aval_9",
    negociacaoId: "neg_9",
    avaliadorEmail: "joao.vitor@example.com",
    avaliadoEmail: "carol.mendes@example.com",
    nota: 5,
    comentario:
      "Carol foi muito honesta na descrição do colar, chegou perfeito. Super recomendo!",
    createdAt: "2026-06-21T14:00:00.000Z",
  },
  {
    id: "aval_10",
    negociacaoId: "neg_10",
    avaliadorEmail: "carol.mendes@example.com",
    avaliadoEmail: "joao.vitor@example.com",
    nota: 5,
    comentario:
      "João Vitor foi extremamente prestativo e a bolsa estava impecável. Recomendadíssimo!",
    createdAt: "2026-06-21T15:45:00.000Z",
  },
  {
    id: "aval_11",
    negociacaoId: "neg_11",
    avaliadorEmail: "mario.andrade@example.com",
    avaliadoEmail: "joao.vitor@example.com",
    nota: 4,
    comentario:
      "Negociação tranquila, produto conforme anunciado. Entrega dentro do prazo.",
    createdAt: "2026-06-22T08:20:00.000Z",
  },
  {
    id: "aval_12",
    negociacaoId: "neg_12",
    avaliadorEmail: "joao.vitor@example.com",
    avaliadoEmail: "mario.andrade@example.com",
    nota: 5,
    comentario:
      "Mario foi muito transparente sobre o estado da peça. Transação sem nenhuma surpresa negativa.",
    createdAt: "2026-06-22T11:10:00.000Z",
  },
];

// =============================================================================
// VAT MOCKS
// =============================================================================

export const mockVatTransacoes: VatTransacaoFormData[] = [
  // --- Transações originais ---
  {
    userId: "user_1",
    tipo: "CREDITO",
    valor: 50.0,
    descricao: "Bônus de boas-vindas ao se cadastrar.",
    motivo: "CADASTRO_BONUS",
  },
  {
    userId: "user_2",
    tipo: "DEBITO",
    valor: 10.0,
    descricao: "Taxa da plataforma pela venda.",
    motivo: "VENDA_CONCLUIDA",
    negociacaoId: "neg_1",
  },
  {
    userId: "user_3",
    tipo: "CREDITO",
    valor: 150.0,
    descricao: "Recebimento de VAT por diferença na troca.",
    motivo: "TROCA_CONCLUIDA",
    negociacaoId: "neg_2",
  },
  // --- Carol Mendes ---
  {
    userId: "user_4",
    tipo: "CREDITO",
    valor: 50.0,
    descricao: "Bônus de boas-vindas ao se cadastrar.",
    motivo: "CADASTRO_BONUS",
  },
  {
    userId: "user_4",
    tipo: "DEBITO",
    valor: 8.0,
    descricao: "Taxa da plataforma pela compra do colar.",
    motivo: "VENDA_CONCLUIDA",
    negociacaoId: "neg_9",
  },
  // --- Mario Andrade ---
  {
    userId: "user_5",
    tipo: "CREDITO",
    valor: 50.0,
    descricao: "Bônus de boas-vindas ao se cadastrar.",
    motivo: "CADASTRO_BONUS",
  },
  {
    userId: "user_5",
    tipo: "CREDITO",
    valor: 110.0,
    descricao: "Recebimento pela venda da camisa social.",
    motivo: "VENDA_CONCLUIDA",
    negociacaoId: "neg_7",
  },
  // --- João Vitor Nascimento ---
  {
    userId: "user_6",
    tipo: "CREDITO",
    valor: 50.0,
    descricao: "Bônus de boas-vindas ao se cadastrar.",
    motivo: "CADASTRO_BONUS",
  },
  {
    userId: "user_6",
    tipo: "CREDITO",
    valor: 170.0,
    descricao: "Recebimento pela venda da bolsa transversal.",
    motivo: "VENDA_CONCLUIDA",
    negociacaoId: "neg_10",
  },
];
