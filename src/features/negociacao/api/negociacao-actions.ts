import type { Anuncio } from "@entities/anuncio";
import type { Proposta } from "@entities/proposta";
import type { User } from "@entities/user";
import { updateAnuncioService } from "@features/anuncios";
import { creditarVAT, debitarVAT } from "@features/vat";
import { now } from "@shared/lib/id-generator";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import type { OperationResult } from "@shared/types/common.types";

export interface EquivalenciaProposta {
  valorTotalProposta: number;
  percentualDiferenca: number;
  equilibrada: boolean;
}

export function calcularEquivalencia(
  valorAnuncio: number,
  valorItens: number,
  complementoVAT = 0,
): EquivalenciaProposta {
  const valorTotalProposta = Number(valorItens) + Number(complementoVAT || 0);
  if (valorTotalProposta >= Number(valorAnuncio)) {
    return { valorTotalProposta, percentualDiferenca: 0, equilibrada: true };
  }
  const percentualDiferenca =
    valorAnuncio > 0
      ? ((Number(valorAnuncio) - valorTotalProposta) / Number(valorAnuncio)) *
        100
      : 0;
  return {
    valorTotalProposta,
    percentualDiferenca,
    equilibrada: percentualDiferenca <= 20,
  };
}

export function cancelarPropostaService(
  propostaId: string,
  actorId: string,
): OperationResult<Proposta> {
  const proposta = storage
    .getCollection<Proposta>(STORAGE_KEYS.PROPOSTAS)
    .find((item) => item.id === propostaId);
  if (!proposta) return { success: false, error: "Proposta não encontrada." };
  if (proposta.compradorId !== actorId && proposta.vendedorId !== actorId) {
    return { success: false, error: "Você não participa desta negociação." };
  }
  if (["CONCLUIDA", "CANCELADA"].includes(proposta.status)) {
    return { success: false, error: "Esta negociação já foi encerrada." };
  }
  const updated = storage.updateInCollection<Proposta>(
    STORAGE_KEYS.PROPOSTAS,
    propostaId,
    { status: "CANCELADA", updatedAt: now() },
  );
  updateAnuncioService(proposta.anuncioId, { status: "DISPONIVEL" });
  return { success: true, data: updated! };
}

export function aceitarPropostaService(
  propostaId: string,
  actorId: string,
): OperationResult<Proposta> {
  const proposta = storage
    .getCollection<Proposta>(STORAGE_KEYS.PROPOSTAS)
    .find((item) => item.id === propostaId);
  if (!proposta) return { success: false, error: "Proposta não encontrada." };
  if (proposta.compradorId !== actorId && proposta.vendedorId !== actorId) {
    return {
      success: false,
      error: "Você não participa desta negociação.",
    };
  }
  if (proposta.autorId === actorId) {
    return {
      success: false,
      error: "Você não pode aceitar a própria proposta.",
    };
  }
  const updated = storage.updateInCollection<Proposta>(
    STORAGE_KEYS.PROPOSTAS,
    propostaId,
    { status: "ACEITA", updatedAt: now() },
  );
  updateAnuncioService(proposta.anuncioId, { status: "EM_NEGOCIACAO" });
  return { success: true, data: updated! };
}

export function recusarPropostaService(
  propostaId: string,
  actorId: string,
): OperationResult<Proposta> {
  const proposta = storage
    .getCollection<Proposta>(STORAGE_KEYS.PROPOSTAS)
    .find((item) => item.id === propostaId);
  if (!proposta) return { success: false, error: "Proposta não encontrada." };
  if (proposta.compradorId !== actorId && proposta.vendedorId !== actorId) {
    return {
      success: false,
      error: "Você não participa desta negociação.",
    };
  }
  if (proposta.autorId === actorId) {
    return {
      success: false,
      error: "Você não pode recusar a própria proposta.",
    };
  }
  const updated = storage.updateInCollection<Proposta>(
    STORAGE_KEYS.PROPOSTAS,
    propostaId,
    { status: "RECUSADA", updatedAt: now() },
  );
  updateAnuncioService(proposta.anuncioId, { status: "DISPONIVEL" });
  return { success: true, data: updated! };
}

export function concluirNegociacaoService(
  propostaId: string,
  actorId: string,
): OperationResult<Proposta> {
  const proposta = storage
    .getCollection<Proposta>(STORAGE_KEYS.PROPOSTAS)
    .find((item) => item.id === propostaId);
  if (!proposta) return { success: false, error: "Proposta não encontrada." };
  if (proposta.compradorId !== actorId && proposta.vendedorId !== actorId) {
    return { success: false, error: "Você não participa desta negociação." };
  }
  if (proposta.status !== "ACEITA") {
    return { success: false, error: "Aceite a proposta antes de concluir." };
  }

  const vat = Number(proposta.vatOfertado ?? 0);
  if (vat > 0) {
    const debit = debitarVAT(
      proposta.compradorId,
      vat,
      "Pagamento de negociação",
      proposta.id,
    );
    if (!debit.success) return debit as OperationResult<Proposta>;
    const credit = creditarVAT(
      proposta.vendedorId,
      vat,
      "Recebimento de negociação",
      proposta.id,
    );
    if (!credit.success) return credit as OperationResult<Proposta>;
  }

  updateAnuncioService(proposta.anuncioId, { status: "FINALIZADO" });
  proposta.itensOfertados.forEach(({ anuncioId }) =>
    updateAnuncioService(anuncioId, { status: "FINALIZADO" }),
  );
  if (proposta.itensDesejados) {
    proposta.itensDesejados.forEach(({ anuncioId }) =>
      updateAnuncioService(anuncioId, { status: "FINALIZADO" }),
    );
  }
  const updated = storage.updateInCollection<Proposta>(
    STORAGE_KEYS.PROPOSTAS,
    proposta.id,
    { status: "CONCLUIDA", updatedAt: now() },
  );
  return { success: true, data: updated! };
}

export function getNegociacaoRelations(proposta: Proposta) {
  const anuncios = storage.getCollection<Anuncio>(STORAGE_KEYS.ANUNCIOS);
  const anuncio = anuncios.find((item) => item.id === proposta.anuncioId);
  const users = storage.getCollection<User>(STORAGE_KEYS.USERS);
  return {
    anuncio,
    comprador: users.find((item) => item.id === proposta.compradorId),
    vendedor: users.find((item) => item.id === proposta.vendedorId),
    itensOfertados: proposta.itensOfertados.map(({ anuncioId }) => ({
      anuncioId,
      anuncio: anuncios.find((item) => item.id === anuncioId),
    })),
    itensDesejados: (proposta.itensDesejados ?? []).map(({ anuncioId }) => ({
      anuncioId,
      anuncio: anuncios.find((item) => item.id === anuncioId),
    })),
  };
}
