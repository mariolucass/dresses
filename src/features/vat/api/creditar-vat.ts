import type { TransacaoVAT } from "@entities/transacao-vat/model/transacao-vat.types";
import type { User } from "@entities/user/model/user.types";
import { generateId, now } from "@shared/lib/id-generator";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import type { OperationResult } from "@shared/types/common.types";

export function creditarVAT(
  userId: string,
  valor: number,
  descricao: string,
  negociacaoId?: string,
): OperationResult<TransacaoVAT> {
  const users = storage.getCollection<User>(STORAGE_KEYS.USERS);
  const user = users.find((u) => u.id === userId);
  if (!user) return { success: false, error: "Usuário não encontrado." };

  const saldoAnterior = user.saldoVAT;
  const saldoPosterior = saldoAnterior + valor;

  storage.updateInCollection<User>(STORAGE_KEYS.USERS, userId, {
    saldoVAT: saldoPosterior,
  });

  const transacao: TransacaoVAT = {
    id: generateId(),
    userId,
    tipo: "CREDITO",
    valor,
    saldoAnterior,
    saldoPosterior,
    descricao,
    motivo: "TROCA_CONCLUIDA",
    negociacaoId,
    createdAt: now(),
  };
  storage.addToCollection<TransacaoVAT>(STORAGE_KEYS.TRANSACOES_VAT, transacao);
  return { success: true, data: transacao };
}
