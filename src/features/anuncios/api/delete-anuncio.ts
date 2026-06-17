import type { Anuncio } from "@entities/anuncio/model/anuncio.types";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import type { OperationResult } from "@shared/types/common.types";

export function deleteAnuncioService(
  id: string,
  userId: string,
): OperationResult<void> {
  const anuncios = storage.getCollection<Anuncio>(STORAGE_KEYS.ANUNCIOS);
  const anuncio = anuncios.find((a) => a.id === id);
  if (!anuncio) return { success: false, error: "Anúncio não encontrado." };
  if (anuncio.userId !== userId)
    return {
      success: false,
      error: "Sem permissão para deletar este anúncio.",
    };
  storage.removeFromCollection<Anuncio>(STORAGE_KEYS.ANUNCIOS, id);
  return { success: true, data: undefined };
}
