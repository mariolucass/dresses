import type { StatusAnuncio } from "@entities/anuncio/model/anuncio.types";
import { parseAsStringEnum } from "nuqs";

/** Parsers nuqs para filtros de status da garagem */
export const garagemFilterParsers = {
  status: parseAsStringEnum<StatusAnuncio>([
    "DISPONIVEL",
    "EM_NEGOCIACAO",
    "FINALIZADO",
  ]),
};
