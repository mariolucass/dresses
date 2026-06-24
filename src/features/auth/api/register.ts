import type {
  CreateUserDto,
  User,
  UserSession,
} from "@entities/user/model/user.types";
import { generateId, now } from "@shared/lib/id-generator";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import type { OperationResult } from "@shared/types/common.types";

const SESSION_DURATION_HOURS = 24;

export function registerService(
  dto: Omit<CreateUserDto, "senha"> & { senha: string },
): OperationResult<UserSession> {
  const users = storage.getCollection<User>(STORAGE_KEYS.USERS);
  const exists = users.some(
    (u) => u.email.toLowerCase() === dto.email.toLowerCase(),
  );

  if (exists) {
    return { success: false, error: "Este e-mail já está cadastrado." };
  }

  const newUser: User = {
    id: generateId(),
    nome: dto.nome,
    email: dto.email,
    senha: `hashed_${dto.senha}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dto.nome)}`,
    saldoVAT: 50, // bônus inicial
    role: dto.role ?? "AMBOS",
    avaliacaoMedia: 0,
    totalAvaliacoes: 0,
    createdAt: now(),
    updatedAt: now(),
  };

  storage.addToCollection<User>(STORAGE_KEYS.USERS, newUser);

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS);
  const session: UserSession = {
    userId: newUser.id,
    email: newUser.email,
    nome: newUser.nome,
    avatar: newUser.avatar,
    expiresAt: expiresAt.toISOString(),
  };
  storage.setItem(STORAGE_KEYS.SESSION, session);
  return { success: true, data: session };
}
