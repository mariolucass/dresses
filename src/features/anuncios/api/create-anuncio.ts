import type {
  Anuncio,
  CreateAnuncioDto,
} from "@entities/anuncio/model/anuncio.types";
import { generateId, now } from "@shared/lib/id-generator";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import type { OperationResult } from "@shared/types/common.types";

export function createAnuncioService(
  dto: CreateAnuncioDto,
): OperationResult<Anuncio> {
  const newAnuncio: Anuncio = {
    ...dto,
    preco: dto.tipo === "TROCA" ? undefined : dto.preco,
    valorVAT: dto.tipo === "VENDA" ? undefined : dto.valorVAT,
    id: generateId(),
    status: "DISPONIVEL",
    views: 0,
    createdAt: now(),
    updatedAt: now(),
  };
  storage.addToCollection<Anuncio>(STORAGE_KEYS.ANUNCIOS, newAnuncio);
  return { success: true, data: newAnuncio };
}
