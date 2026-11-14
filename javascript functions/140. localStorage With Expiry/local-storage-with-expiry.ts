interface StorageOptions {
  ttl?: number;
  expiresAt?: number | Date;
}

interface ILocalStorageWithExpiry {
  getItem(key: string): string | null;
  setItem(key: string, value: string, options?: StorageOptions): void;
}

export default class LocalStorageWithExpiry implements ILocalStorageWithExpiry {
  getItem(key: string): string | null {
    throw new Error("Not implemented!");
  }

  setItem(key: string, value: string, options?: StorageOptions): void {
    throw new Error("Not implemented!");
  }
}
