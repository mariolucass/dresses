/**
 * Gerador de IDs únicos sem dependências externas.
 * Usa crypto.randomUUID (disponível em todos os browsers modernos).
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para ambientes sem crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Gera um timestamp ISO string do momento atual.
 */
export function now(): string {
  return new Date().toISOString();
}
