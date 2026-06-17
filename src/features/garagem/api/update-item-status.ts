import type { StatusAnuncio, Anuncio } from '@entities/anuncio/model/anuncio.types';
import { storage, STORAGE_KEYS } from '@shared/lib/storage';
import { now } from '@shared/lib/id-generator';
import type { OperationResult } from '@shared/types/common.types';

export function updateItemStatusService(
  anuncioId: string,
  status: StatusAnuncio,
): OperationResult<Anuncio> {
  const updated = storage.updateInCollection<Anuncio>(
    STORAGE_KEYS.ANUNCIOS,
    anuncioId,
    { status, updatedAt: now() },
  );
  if (!updated) return { success: false, error: 'Item não encontrado na garagem.' };
  return { success: true, data: updated };
}
