import type {
  CreateMensagemDto,
  Mensagem,
} from "@entities/mensagem/model/mensagem.types";
import { generateId, now } from "@shared/lib/id-generator";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import type { OperationResult } from "@shared/types/common.types";

export function sendMessageService(
  dto: CreateMensagemDto,
): OperationResult<Mensagem> {
  const mensagem: Mensagem = {
    ...dto,
    id: generateId(),
    lida: false,
    createdAt: now(),
  };
  storage.addToCollection<Mensagem>(STORAGE_KEYS.MENSAGENS, mensagem);
  return { success: true, data: mensagem };
}
