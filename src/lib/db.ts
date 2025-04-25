import Dexie, { Table } from "dexie";
import type { PasswordProps } from "../interfaces";
import { getKey } from "./crypto";

interface EncryptedPassword {
  id?: number;
  name: string;
  url: string;
  encrypted: string;
  createdAt: string;
  updatedAt: string;
}

class PassageDB extends Dexie {
  passwords!: Table<EncryptedPassword>;

  constructor() {
    super("passageDB");
    this.version(1).stores({
      passwords: "++id, name, url",
    });
  }
}

export const db = new PassageDB();

export const savePassword = async (
  data: PasswordProps,
  masterPassword: string
) => {
  const { name, url, ...sensitive } = data;
  const key = await getKey(masterPassword);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(sensitive));

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  const fullPayload = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  fullPayload.set(iv);
  fullPayload.set(new Uint8Array(encryptedBuffer), iv.length);

  const encrypted = btoa(String.fromCharCode(...fullPayload));
  const now = new Date().toISOString();

  await db.passwords.add({
    name,
    url,
    encrypted,
    createdAt: now,
    updatedAt: now,
  });
};

export const loadPasswords = async (
  masterPassword: string
): Promise<PasswordProps[]> => {
  const all = await db.passwords.toArray();
  const key = await getKey(masterPassword);

  const decrypted = await Promise.all(
    all.map(async (entry) => {
      const encryptedBytes = Uint8Array.from(atob(entry.encrypted), (c) =>
        c.charCodeAt(0)
      );
      const iv = encryptedBytes.slice(0, 12);
      const data = encryptedBytes.slice(12);

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        data
      );

      const json = new TextDecoder().decode(decryptedBuffer);
      const sensitive = JSON.parse(json);

      return {
        id: entry.id?.toString(),
        name: entry.name,
        url: entry.url,
        ...sensitive,
      } as PasswordProps;
    })
  );

  return decrypted;
};

export const updatePassword = async (
  id: number,
  data: PasswordProps,
  masterPassword: string
) => {
  const { name, url, ...sensitive } = data;
  const key = await getKey(masterPassword);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(sensitive));

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  const fullPayload = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  fullPayload.set(iv);
  fullPayload.set(new Uint8Array(encryptedBuffer), iv.length);

  const encrypted = btoa(String.fromCharCode(...fullPayload));
  const now = new Date().toISOString();

  await db.passwords.update(id, {
    name,
    url,
    encrypted,
    updatedAt: now,
  });
};

export const deletePassword = async (id: number) => {
  await db.passwords.delete(id);
};
