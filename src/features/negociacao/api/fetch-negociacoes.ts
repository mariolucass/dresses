import type { Proposta } from "@entities/proposta/model/proposta.types";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";

export function fetchNegociacoes(userId: string): Proposta[] {
  return storage
    .getCollection<Proposta>(STORAGE_KEYS.PROPOSTAS)
    .filter((p) => p.compradorId === userId || p.vendedorId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function fetchNegociacaoById(id: string): Proposta | null {
  return (
    storage
      .getCollection<Proposta>(STORAGE_KEYS.PROPOSTAS)
      .find((p) => p.id === id) ?? null
  );
}
