import type { User } from "@entities/user/model/user.types";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";

/**
 * Busca o registro completo do usuário (incluindo saldoVAT, bio, reputação)
 * a partir do `userId` salvo na sessão (`UserSession`).
 *
 * A sessão guarda apenas um resumo do usuário; esta função "hidrata"
 * esse resumo com o registro completo salvo em `STORAGE_KEYS.USERS`.
 */
export function getCurrentUserService(userId: string): User | null {
  const users = storage.getCollection<User>(STORAGE_KEYS.USERS);
  return users.find((u) => u.id === userId) ?? null;
}
