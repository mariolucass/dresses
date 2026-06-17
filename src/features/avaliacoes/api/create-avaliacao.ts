import type { Avaliacao, CreateAvaliacaoDto } from '@entities/avaliacao/model/avaliacao.types';
import type { User } from '@entities/user/model/user.types';
import { storage, STORAGE_KEYS } from '@shared/lib/storage';
import { generateId, now } from '@shared/lib/id-generator';
import type { OperationResult } from '@shared/types/common.types';

export function createAvaliacaoService(
  avaliadorId: string,
  dto: Omit<CreateAvaliacaoDto, 'avaliadorId'>,
): OperationResult<Avaliacao> {
  // Impede avaliação duplicada
  const avaliacoes = storage.getCollection<Avaliacao>(STORAGE_KEYS.AVALIACOES);
  const duplicada = avaliacoes.some(
    (a) => a.negociacaoId === dto.negociacaoId && a.avaliadorId === avaliadorId,
  );
  if (duplicada) return { success: false, error: 'Você já avaliou esta negociação.' };

  const novaAvaliacao: Avaliacao = {
    ...dto,
    id: generateId(),
    avaliadorId,
    createdAt: now(),
  };
  storage.addToCollection<Avaliacao>(STORAGE_KEYS.AVALIACOES, novaAvaliacao);

  // Recalcula média do avaliado
  const todasAvaliacoesDoAvaliado = [
    ...avaliacoes.filter((a) => a.avaliadoId === dto.avaliadoId),
    novaAvaliacao,
  ];
  const media =
    todasAvaliacoesDoAvaliado.reduce((acc, a) => acc + a.nota, 0) /
    todasAvaliacoesDoAvaliado.length;

  storage.updateInCollection<User>(STORAGE_KEYS.USERS, dto.avaliadoId, {
    avaliacaoMedia: Math.round(media * 10) / 10,
    totalAvaliacoes: todasAvaliacoesDoAvaliado.length,
  });

  return { success: true, data: novaAvaliacao };
}
