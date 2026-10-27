import type { ColumnDef } from "@tanstack/vue-table";
import { adminTableFeatures } from "@/lib/table";

/**
 * Kolom tabel admin tanpa accessor: nilai dirender lewat slot #cell
 * supaya tiap view bisa mem-format field sesuai kebutuhannya sendiri.
 */
export function column(
  id: string,
  header: string,
  align?: "left" | "right",
): ColumnDef<typeof adminTableFeatures, any, unknown> {
  return {
    id,
    header,
    meta: align ? { align } : undefined,
  };
}

export function expanderColumn(): ColumnDef<typeof adminTableFeatures, any, unknown> {
  return {
    id: "expander",
    header: "",
  };
}
