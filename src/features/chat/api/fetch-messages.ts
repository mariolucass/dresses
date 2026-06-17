import type { Mensagem } from "@entities/mensagem/model/mensagem.types";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";

export function fetchMessages(negociacaoId: string): Mensagem[] {
  return storage
    .getCollection<Mensagem>(STORAGE_KEYS.MENSAGENS)
    .filter((m) => m.negociacaoId === negociacaoId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
}
