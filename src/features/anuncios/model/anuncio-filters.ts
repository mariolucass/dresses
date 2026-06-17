import type {
  CategoriaAnuncio,
  CondicaoItem,
  TipoAnuncio,
} from "@entities/anuncio/model/anuncio.types";
import { parseAsString, parseAsStringEnum } from "nuqs";

/** Parsers nuqs para filtros de URL dos anúncios */
export const anuncioFilterParsers = {
  busca: parseAsString.withDefault(""),
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
};
