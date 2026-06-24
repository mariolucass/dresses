import type { Avaliacao } from "@entities/avaliacao/model/avaliacao.types";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";

export function fetchAvaliacoes(avaliadoId: string): Avaliacao[] {
  return storage
    .getCollection<Avaliacao>(STORAGE_KEYS.AVALIACOES)
    .filter((a) => a.avaliadoId === avaliadoId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function fetchAvaliacaoById(id: string): Avaliacao | null {
  return (
    storage
      .getCollection<Avaliacao>(STORAGE_KEYS.AVALIACOES)
      .find((avaliacao) => avaliacao.id === id) ?? null
  );
}
