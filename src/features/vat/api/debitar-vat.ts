import type { TransacaoVAT } from "@entities/transacao-vat/model/transacao-vat.types";
import type { User } from "@entities/user/model/user.types";
import { generateId, now } from "@shared/lib/id-generator";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import type { OperationResult } from "@shared/types/common.types";

export function debitarVAT(
  userId: string,
  valor: number,
  descricao: string,
  negociacaoId?: string,
): OperationResult<TransacaoVAT> {
  const users = storage.getCollection<User>(STORAGE_KEYS.USERS);
  const user = users.find((u) => u.id === userId);
  if (!user) return { success: false, error: "Usuário não encontrado." };
  if (user.saldoVAT < valor) {
    return {
      success: false,
      error: "Saldo VAT insuficiente para esta operação.",
    };
  }

  const saldoAnterior = user.saldoVAT;
  const saldoPosterior = saldoAnterior - valor;

  storage.updateInCollection<User>(STORAGE_KEYS.USERS, userId, {
    saldoVAT: saldoPosterior,
  });

  const transacao: TransacaoVAT = {
    id: generateId(),
    userId,
    tipo: "DEBITO",
    valor,
    saldoAnterior,
    saldoPosterior,
    descricao,
    motivo: "PROPOSTA_ACEITA",
    negociacaoId,
    createdAt: now(),
  };
  storage.addToCollection<TransacaoVAT>(STORAGE_KEYS.TRANSACOES_VAT, transacao);
  return { success: true, data: transacao };
}
