import type { User, UserSession } from "@entities/user/model/user.types";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import type { OperationResult } from "@shared/types/common.types";

const SESSION_DURATION_HOURS = 24;

function createSession(user: User): UserSession {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS);
  return {
    userId: user.id,
    email: user.email,
    nome: user.nome,
    avatar: user.avatar,
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Realiza o login do usuário.
 *
 * @example
 * // Usuários de exemplo disponíveis no sistema (criados pelo seed):
 * // - Maria Eduarda: maria@mail.com (Senha: password123)
 * // - Joao Vitor: joao@mail.com (Senha: password123)
 */
export function loginService(
  email: string,
  senha: string,
): OperationResult<UserSession> {
  const users = storage.getCollection<User>(STORAGE_KEYS.USERS);
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.senha === `hashed_${senha}`,
  );

  if (!user) {
    return { success: false, error: "E-mail ou senha incorretos." };
  }

  const session = createSession(user);
  storage.setItem(STORAGE_KEYS.SESSION, session);
  return { success: true, data: session };
}
