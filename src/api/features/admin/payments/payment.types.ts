import type { PaginationMeta } from "../admin.types";

export interface AdminPayment {
  id: string;
  order_id: string;
  provider: string;
  external_id: string;
  provider_invoice_id: string | null;
  status: string;
  amount: string;
  currency: string;
  checkout_url: string | null;
  expires_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminPaymentsResponse {
  payments: AdminPayment[];
  meta: PaginationMeta;
}

export interface AdminPaymentsParams {
  status?: string;
  page?: number;
  page_size?: number;
}
