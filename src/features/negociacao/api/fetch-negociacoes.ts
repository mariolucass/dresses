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

/** Retorna todas as versões da negociação, preservando a proposta inicial. */
export function fetchNegociacaoHistory(id: string): Proposta[] {
  const propostas = storage.getCollection<Proposta>(STORAGE_KEYS.PROPOSTAS);
  let root = propostas.find((item) => item.id === id);
  if (!root) return [];

  while (root.contrapropostaRef) {
    const parent = propostas.find(
      (item) => item.id === root?.contrapropostaRef,
    );
    if (!parent) break;
    root = parent;
  }

  const history: Proposta[] = [root];
  let current = root;
  while (true) {
    const next = propostas
      .filter((item) => item.contrapropostaRef === current.id)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )[0];
    if (!next) break;
    history.push(next);
    current = next;
  }
  return history;
}
