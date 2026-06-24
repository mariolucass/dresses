import type {
  Anuncio,
  StatusAnuncio,
} from "@entities/anuncio/model/anuncio.types";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";

export function fetchGaragem(
  userId: string,
  status?: StatusAnuncio,
): Anuncio[] {
  let items = storage
    .getCollection<Anuncio>(STORAGE_KEYS.ANUNCIOS)
    .filter((a) => a.userId === userId);
  if (status) items = items.filter((a) => a.status === status);
  return items.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}
