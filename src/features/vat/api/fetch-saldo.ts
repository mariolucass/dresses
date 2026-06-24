import type { User } from "@entities/user/model/user.types";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";

export function fetchSaldoVAT(userId: string): number {
  const users = storage.getCollection<User>(STORAGE_KEYS.USERS);
  const user = users.find((u) => u.id === userId);
  return user?.saldoVAT ?? 0;
}
