import type { Anuncio } from "@entities/anuncio";
import type { Mensagem } from "@entities/mensagem";
import type {
  CreatePropostaDto,
  Proposta,
} from "@entities/proposta/model/proposta.types";
import { updateAnuncioService } from "@features/anuncios/api/update-anuncio";
import { generateId, now } from "@shared/lib/id-generator";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import type { OperationResult } from "@shared/types/common.types";

export function createPropostaService(
  compradorId: string,
  dto: Omit<CreatePropostaDto, "compradorId">,
): OperationResult<Proposta> {
  const anuncio = storage
    .getCollection<Anuncio>(STORAGE_KEYS.ANUNCIOS)
    .find((item) => item.id === dto.anuncioId);

  if (!anuncio) {
    return { success: false, error: "Anúncio não encontrado." };
  }
  if (anuncio.userId === compradorId) {
    return {
      success: false,
      error: "Você não pode negociar o seu próprio anúncio.",
    };
  }
  if (anuncio.userId !== dto.vendedorId) {
    return { success: false, error: "Vendedor do anúncio inválido." };
  }
  if (anuncio.status !== "DISPONIVEL") {
    return { success: false, error: "Este anúncio não está disponível." };
  }

  const createdAt = now();
  const novaProposta: Proposta = {
    ...dto,
    id: generateId(),
    compradorId,
    autorId: compradorId,
    itensOfertados: dto.itensOfertados ?? [],
    itensDesejados: dto.itensDesejados ?? [],
    status: "PENDENTE",
    createdAt,
    updatedAt: createdAt,
  };
  storage.addToCollection<Proposta>(STORAGE_KEYS.PROPOSTAS, novaProposta);
  if (novaProposta.mensagemInicial) {
    storage.addToCollection<Mensagem>(STORAGE_KEYS.MENSAGENS, {
      id: generateId(),
      negociacaoId: novaProposta.id,
      remetenteId: compradorId,
      texto: novaProposta.mensagemInicial,
      tipo: "TEXTO",
      lida: false,
      createdAt,
    });
  }
  // Marca o anúncio como EM_NEGOCIACAO
  updateAnuncioService(dto.anuncioId, { status: "EM_NEGOCIACAO" });
  return { success: true, data: novaProposta };
}
