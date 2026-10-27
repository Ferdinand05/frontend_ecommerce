import type { RoleRef } from "../admin.types";

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  role: RoleRef;
  status: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}
