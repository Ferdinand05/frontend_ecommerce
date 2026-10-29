/**
 * Nama area pengiriman dari API berformat
 * "<kecamatan>, <kota>, <provinsi>. <kode pos>", contoh
 * "Sumur Bandung, Bandung, Jawa Barat. 40111".
 * Kota dan provinsi diambil dari nama itu supaya form alamat terisi
 * otomatis setelah shopper memilih area.
 */
export interface ParsedAreaName {
  city: string;
  province: string;
}

export function parseAreaName(name: string): ParsedAreaName {
  const segments = name.replace(/\.\s*\d+\s*$/, "").split(", ");
  if (segments.length < 3) return { city: "", province: "" };
  const province = segments[segments.length - 1] ?? "";
  const city = segments[segments.length - 2] ?? "";
  return { city, province };
}
