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
} as const;

export type AppRoute = typeof ROUTES;
