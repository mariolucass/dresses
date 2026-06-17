import type {
  CreatePropostaDto,
  Proposta,
  RespostaProposta,
} from "@entities/proposta/model/proposta.types";
import { generateId, now } from "@shared/lib/id-generator";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import type { OperationResult } from "@shared/types/common.types";

export function respondPropostaService(
  resposta: RespostaProposta,
): OperationResult<Proposta> {
  const propostaAtualizada = storage.updateInCollection<Proposta>(
    STORAGE_KEYS.PROPOSTAS,
    resposta.propostaId,
    { status: resposta.resposta, updatedAt: now() },
  );
  if (!propostaAtualizada) {
    return { success: false, error: "Proposta não encontrada." };
  }

  if (resposta.resposta === "CONTRAPROPOSTA" && resposta.contrapropostaData) {
    const contraproposta: Proposta = {
      ...(resposta.contrapropostaData as CreatePropostaDto),
      id: generateId(),
      status: "PENDENTE",
      contrapropostaRef: resposta.propostaId,
      itensOfertados: resposta.contrapropostaData.itensOfertados ?? [],
      createdAt: now(),
      updatedAt: now(),
    } as Proposta;
    storage.addToCollection<Proposta>(STORAGE_KEYS.PROPOSTAS, contraproposta);
  }

  return { success: true, data: propostaAtualizada };
}
