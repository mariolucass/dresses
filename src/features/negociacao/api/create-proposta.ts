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
  const novaProposta: Proposta = {
    ...dto,
    id: generateId(),
    compradorId,
    itensOfertados: dto.itensOfertados ?? [],
    status: "PENDENTE",
    createdAt: now(),
    updatedAt: now(),
  };
  storage.addToCollection<Proposta>(STORAGE_KEYS.PROPOSTAS, novaProposta);
  // Marca o anúncio como EM_NEGOCIACAO
  updateAnuncioService(dto.anuncioId, { status: "EM_NEGOCIACAO" });
  return { success: true, data: novaProposta };
}
