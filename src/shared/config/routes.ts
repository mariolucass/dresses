export const ROUTES = {
  // Público
  HOME: "/",
  LOGIN: "/login",
  CADASTRO: "/cadastro",

  // Principal (autenticado)
  ANUNCIOS: "/anuncios",
  ANUNCIO_NOVO: "/anuncios/novo",
  ANUNCIO_DETALHE: (id: string) => `/anuncios/${id}`,
  GARAGEM: "/garagem",
  NEGOCIACOES: "/negociacoes",
  NEGOCIACAO_DETALHE: (id: string) => `/negociacoes/${id}`,
  PERFIL: "/perfil",
  PERFIL_AVALIACOES: "/perfil/avaliacoes",
  PERFIL_AVALIACAO_DETALHE: (id: string) => `/perfil/avaliacoes/${id}`,
  CARTEIRA: "/perfil/carteira",
} as const;

export type AppRoute = typeof ROUTES;
