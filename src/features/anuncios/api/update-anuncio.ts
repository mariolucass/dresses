import type {
  Anuncio,
  UpdateAnuncioDto,
} from "@entities/anuncio/model/anuncio.types";
import { now } from "@shared/lib/id-generator";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import type { OperationResult } from "@shared/types/common.types";

export function updateAnuncioService(
  id: string,
  dto: UpdateAnuncioDto,
): OperationResult<Anuncio> {
  const updated = storage.updateInCollection<Anuncio>(
    STORAGE_KEYS.ANUNCIOS,
    id,
    { ...dto, updatedAt: now() },
  );
  if (!updated) return { success: false, error: "Anúncio não encontrado." };
  return { success: true, data: updated };
}
