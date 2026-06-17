export type TipoAnuncio = "VENDA" | "TROCA" | "AMBOS";

export type StatusAnuncio = "DISPONIVEL" | "EM_NEGOCIACAO" | "FINALIZADO";

export type CategoriaAnuncio =
  | "ROUPAS_FEMININAS"
  | "ROUPAS_MASCULINAS"
  | "INFANTIL"
  | "CALCADOS"
  | "ACESSORIOS"
  | "BOLSAS"
  | "ESPORTES"
  | "FESTA"
  | "OUTROS";

export type CondicaoItem = "NOVO" | "SEMINOVO" | "USADO_BOM" | "USADO_REGULAR";

export type TamanhoItem =
  | "PP"
  | "P"
  | "M"
  | "G"
  | "GG"
  | "XG"
  | "UNICO"
  | string; // número de calçado, etc.

export interface Anuncio {
  id: string;
  titulo: string;
  descricao: string;
  fotos: string[]; // URLs ou base64
  preco?: number; // opcional para tipo TROCA puro
  valorVAT?: number; // valor em VAT para trocas
  tipo: TipoAnuncio;
  categoria: CategoriaAnuncio;
  condicao: CondicaoItem;
  tamanho: TamanhoItem;
  status: StatusAnuncio;
  userId: string; // dono do anúncio
  views: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateAnuncioDto = Omit<
  Anuncio,
  "id" | "status" | "views" | "createdAt" | "updatedAt"
>;

export type UpdateAnuncioDto = Partial<
  Pick<
    Anuncio,
    | "titulo"
    | "descricao"
    | "fotos"
    | "preco"
    | "valorVAT"
    | "tipo"
    | "categoria"
    | "condicao"
    | "tamanho"
    | "status"
  >
>;

export interface AnuncioFilters {
  busca?: string;
  categoria?: CategoriaAnuncio;
  tipo?: TipoAnuncio;
  condicao?: CondicaoItem;
  precoMin?: number;
  precoMax?: number;
  tamanho?: TamanhoItem;
}
