import type {
  Anuncio,
  AnuncioFilters,
} from "@entities/anuncio/model/anuncio.types";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";

export function fetchAnuncios(filters?: AnuncioFilters): Anuncio[] {
  let anuncios = storage
    .getCollection<Anuncio>(STORAGE_KEYS.ANUNCIOS)
    .filter((a) => a.status === "DISPONIVEL");

  if (!filters) return anuncios;

  if (filters.busca) {
    const q = filters.busca.toLowerCase();
    anuncios = anuncios.filter(
      (a) =>
        a.titulo.toLowerCase().includes(q) ||
        a.descricao.toLowerCase().includes(q) ||
        (a.marca?.toLowerCase().includes(q) ?? false),
    );
  }
  if (filters.categoria) {
    anuncios = anuncios.filter((a) => a.categoria === filters.categoria);
  }
  if (filters.tipo) {
    anuncios = anuncios.filter(
      (a) => a.tipo === filters.tipo || a.tipo === "AMBOS",
    );
  }
  if (filters.condicao) {
    anuncios = anuncios.filter((a) => a.condicao === filters.condicao);
  }
  if (filters.precoMin !== undefined) {
    anuncios = anuncios.filter((a) => (a.preco ?? 0) >= filters.precoMin!);
  }
  if (filters.precoMax !== undefined) {
    anuncios = anuncios.filter(
      (a) => (a.preco ?? Infinity) <= filters.precoMax!,
    );
  }
  if (filters.tamanho) {
    anuncios = anuncios.filter((a) =>
      a.tamanho.toLowerCase().includes(filters.tamanho!.toLowerCase()),
    );
  }

  return anuncios;
}

export function fetchAnuncioById(id: string): Anuncio | null {
  const anuncios = storage.getCollection<Anuncio>(STORAGE_KEYS.ANUNCIOS);
  return anuncios.find((a) => a.id === id) ?? null;
}

export function fetchAnunciosByUser(userId: string): Anuncio[] {
  return storage
    .getCollection<Anuncio>(STORAGE_KEYS.ANUNCIOS)
    .filter((a) => a.userId === userId);
}
