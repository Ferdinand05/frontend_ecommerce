import type { BadgeVariants } from "@/components/ui/badge";
import {
  createCoreRowModel,
  rowPaginationFeature,
  tableFeatures,
} from "@tanstack/vue-table";

export type StatusVariant = NonNullable<BadgeVariants["variant"]>;

const SUCCESS: StatusVariant = "secondary";
const DANGER: StatusVariant = "destructive";
const NEUTRAL: StatusVariant = "outline";
const INFO: StatusVariant = "default";

/**
 * Status pesanan: menunggu pembayaran, dibayar, diproses, dikirim, selesai, dibatalkan.
 */
const ORDER_STATUS: Record<string, StatusVariant> = {
  PENDING: NEUTRAL,
  PAID: INFO,
  PROCESSING: INFO,
  SHIPPED: SUCCESS,
  DELIVERED: SUCCESS,
  COMPLETED: SUCCESS,
  CANCELLED: DANGER,
  EXPIRED: DANGER,
  FAILED: DANGER,
  REFUNDED: DANGER,
  CONFIRMED: SUCCESS,
};

const MOVEMENT_TYPE: Record<string, StatusVariant> = {
  RESTOCK: SUCCESS,
  RETURN: INFO,
  RESERVE: NEUTRAL,
  ADJUSTMENT: NEUTRAL,
  SALE: INFO,
  DAMAGE: DANGER,
  ORDER_CANCEL: DANGER,
};

export function statusVariant(status: string): StatusVariant {
  return ORDER_STATUS[status?.toUpperCase()] ?? NEUTRAL;
}

export function movementTypeVariant(type: string): StatusVariant {
  return MOVEMENT_TYPE[type?.toUpperCase()] ?? NEUTRAL;
}

/**
 * Ubah label status mentah API jadi kalimat yang enak dibaca admin.
 */
export function humanizeStatus(status: string): string {
  if (!status) return "-";
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const adminTableFeatures = tableFeatures({
  rowPaginationFeature,
  coreRowModel: createCoreRowModel(),
  columnMeta: {} as { align?: "left" | "right" },
});
