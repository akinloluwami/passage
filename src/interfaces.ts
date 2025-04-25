export interface PasswordProps {
  id?: string;
  url: string;
  name: string;
  email: string;
  username: string;
  password: string;
  note: string;
}

export interface EncryptedPassword {
  id?: string;
  name: string;
  url: string;
  encrypted: string;
  createdAt: string;
  updatedAt: string;
}
