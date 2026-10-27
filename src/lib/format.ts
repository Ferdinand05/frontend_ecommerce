const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const dateTime = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

const dateOnly = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeZone: "Asia/Jakarta",
});

/** Semua field uang dari API datang sebagai string numerik, contoh "120000". */
export function formatIDR(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "-";
  const amount = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(amount)) return "-";
  return rupiah.format(amount);
}

/**
 * Rentang harga varian. Varian satu produk bisa punya harga berbeda,
 * jadi tampilkan rentang kalau lebih dari satu nilai unik.
 */
export function formatIDRRange(prices: Array<string | number | null | undefined>): string {
  const amounts = prices
    .filter((price) => price !== null && price !== undefined && price !== "")
    .map((price) => (typeof price === "number" ? price : Number(price)))
    .filter((amount) => Number.isFinite(amount));
  if (amounts.length === 0) return "-";
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  if (min === max) return rupiah.format(min);
  return `${rupiah.format(min)} s/d ${rupiah.format(max)}`;
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return dateTime.format(parsed);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return dateOnly.format(parsed);
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("id-ID").format(value);
}
