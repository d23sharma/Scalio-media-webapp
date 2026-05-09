export type Role = "member" | "admin" | "owner";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  token: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
  packageName?: string;
  lastLogin?: string;
}
