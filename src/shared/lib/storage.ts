/**
 * Abstração de localStorage com tipagem genérica.
 * Toda a persistência do Desapeguei passa por este módulo.
 */

export const storage = {
  /**
   * Recupera um item do localStorage com tipagem.
   */
  getItem<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      console.error(`[storage.getItem] Erro ao ler chave "${key}".`);
      return null;
    }
  },

  /**
   * Salva um item no localStorage.
   */
  setItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new StorageEvent("storage", { key }));
    } catch {
      console.error(`[storage.setItem] Erro ao salvar chave "${key}".`);
    }
  },

  /**
   * Remove um item do localStorage.
   */
  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
    window.dispatchEvent(new StorageEvent("storage", { key }));
  },

  /**
   * Recupera uma coleção (array) do localStorage.
   * Retorna array vazio se não existir.
   */
  getCollection<T>(key: string): T[] {
    return this.getItem<T[]>(key) ?? [];
  },

  /**
   * Adiciona um item a uma coleção no localStorage.
   */
  addToCollection<T>(key: string, item: T): void {
    const collection = this.getCollection<T>(key);
    collection.push(item);
    this.setItem(key, collection);
  },

  /**
   * Atualiza um item em uma coleção pelo campo `id`.
   */
  updateInCollection<T extends { id: string }>(
    key: string,
    id: string,
    patch: Partial<T>,
  ): T | null {
    const collection = this.getCollection<T>(key);
    const index = collection.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const updated = { ...collection[index], ...patch } as T;
    collection[index] = updated;
    this.setItem(key, collection);
    return updated;
  },

  /**
   * Remove um item de uma coleção pelo campo `id`.
   */
  removeFromCollection<T extends { id: string }>(
    key: string,
    id: string,
  ): boolean {
    const collection = this.getCollection<T>(key);
    const filtered = collection.filter((item) => item.id !== id);
    if (filtered.length === collection.length) return false;
    this.setItem(key, filtered);
    return true;
  },

  /**
   * Limpa todo o localStorage (usar apenas em dev/seed).
   */
  clear(): void {
    if (typeof window === "undefined") return;
    window.localStorage.clear();
    window.dispatchEvent(new StorageEvent("storage"));
  },
};

/** Chaves do localStorage - fonte única de verdade para keys */
export const STORAGE_KEYS = {
  USERS: "brecho:users",
  ANUNCIOS: "brecho:anuncios",
  PROPOSTAS: "brecho:propostas",
  MENSAGENS: "brecho:mensagens",
  AVALIACOES: "brecho:avaliacoes",
  TRANSACOES_VAT: "brecho:transacoes_vat",
  SESSION: "brecho:session",
  SEEDED: "brecho:seeded",
} as const;
