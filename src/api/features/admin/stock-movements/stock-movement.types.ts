import type { PaginationMeta } from "../admin.types";

export type StockMovementType = "RESTOCK" | "SALE" | "RETURN" | "DAMAGE" | "ADJUSTMENT" | "ORDER_CANCEL" | "RESERVE";

export interface AdminStockMovement {
  id: string;
  inventory_item_id: string;
  type: string;
  quantity: number;
  note: string;
  reference_type: string | null;
  reference_id: string | null;
  created_at: string;
  sku: string;
  variant_name: string;
}

export interface AdminStockMovementsResponse {
  movements: AdminStockMovement[];
  meta: PaginationMeta;
}

export interface AdminStockMovementsParams {
  type?: string;
  page?: number;
  page_size?: number;
}
