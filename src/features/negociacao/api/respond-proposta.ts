import type {
  CreatePropostaDto,
  Proposta,
  RespostaProposta,
} from "@entities/proposta/model/proposta.types";
import type { Mensagem } from "@entities/mensagem";
import { generateId, now } from "@shared/lib/id-generator";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import type { OperationResult } from "@shared/types/common.types";

export function respondPropostaService(
  resposta: RespostaProposta,
): OperationResult<Proposta> {
  const propostas = storage.getCollection<Proposta>(STORAGE_KEYS.PROPOSTAS);
  const propostaAtual = propostas.find(
    (item) => item.id === resposta.propostaId,
  );
  if (!propostaAtual) {
    return { success: false, error: "Proposta não encontrada." };
  }
  if (
    propostaAtual.compradorId !== resposta.actorId &&
    propostaAtual.vendedorId !== resposta.actorId
  ) {
    return { success: false, error: "Você não participa desta negociação." };
  }
  const autorAtual = propostaAtual.autorId ?? propostaAtual.compradorId;
  if (autorAtual === resposta.actorId) {
    return { success: false, error: "Aguarde a resposta da outra pessoa." };
  }
  if (propostaAtual.status !== "PENDENTE") {
    return { success: false, error: "Esta proposta já foi respondida." };
  }

  let raiz = propostaAtual;
  while (raiz.contrapropostaRef) {
    const parent = propostas.find((item) => item.id === raiz.contrapropostaRef);
    if (!parent) break;
    raiz = parent;
  }

  const propostaAtualizada = storage.updateInCollection<Proposta>(
    STORAGE_KEYS.PROPOSTAS,
    resposta.propostaId,
    {
      status:
        resposta.resposta === "CONTRAPROPOSTA"
          ? "SUBSTITUIDA"
          : resposta.resposta,
      updatedAt: now(),
    },
  );
  if (!propostaAtualizada) {
    return { success: false, error: "Proposta não encontrada." };
  }

  if (resposta.resposta === "CONTRAPROPOSTA" && resposta.contrapropostaData) {
    const createdAt = now();
    const contraproposta: Proposta = {
      ...(resposta.contrapropostaData as CreatePropostaDto),
      id: generateId(),
      autorId: resposta.actorId,
      status: "PENDENTE",
      contrapropostaRef: resposta.propostaId,
      itensOfertados: resposta.contrapropostaData.itensOfertados ?? [],
      itensDesejados: resposta.contrapropostaData.itensDesejados ?? [],
      createdAt,
      updatedAt: createdAt,
    } as Proposta;
    storage.addToCollection<Proposta>(STORAGE_KEYS.PROPOSTAS, contraproposta);
    storage.addToCollection<Mensagem>(STORAGE_KEYS.MENSAGENS, {
      id: generateId(),
      negociacaoId: raiz.id,
      remetenteId: resposta.actorId,
      texto: "Nova contraproposta enviada",
      tipo: "CONTRAPROPOSTA",
      propostaId: contraproposta.id,
      lida: false,
      createdAt,
    });
    return { success: true, data: contraproposta };
  }

  return { success: true, data: propostaAtualizada };
}
