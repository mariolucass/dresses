import type {
  CategoriaAnuncio,
  CondicaoItem,
  TipoAnuncio,
} from "@entities/anuncio/model/anuncio.types";
import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

export const anuncioFilterParsers = {
  busca: parseAsString,
  categoria: parseAsStringEnum<CategoriaAnuncio>([
    "ROUPAS_FEMININAS",
    "ROUPAS_MASCULINAS",
    "INFANTIL",
    "CALCADOS",
    "ACESSORIOS",
    "BOLSAS",
    "ESPORTES",
    "FESTA",
    "OUTROS",
  ]),
  tipo: parseAsStringEnum<TipoAnuncio>(["VENDA", "TROCA", "AMBOS"]),
  condicao: parseAsStringEnum<CondicaoItem>([
    "NOVO",
    "SEMINOVO",
    "USADO_BOM",
    "USADO_REGULAR",
  ]),
  tamanho: parseAsString,
  precoMin: parseAsInteger,
  precoMax: parseAsInteger,
};
