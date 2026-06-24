import type { TransacaoVAT } from "@entities/transacao-vat";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";

export function fetchHistoricoVAT(userId: string): TransacaoVAT[] {
  return storage
    .getCollection<TransacaoVAT>(STORAGE_KEYS.TRANSACOES_VAT)
    .filter((transacao) => transacao.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}
