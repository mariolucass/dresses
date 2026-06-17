import { storage, STORAGE_KEYS } from '@shared/lib/storage';

export function logoutService(): void {
  storage.removeItem(STORAGE_KEYS.SESSION);
}
