import { describe, expect, it } from "vitest";
import { formatIDR, formatIDRRange, formatNumber } from "@/lib/format";

describe("formatIDR", () => {
  it("membaca uang dari string numerik yang dikirim API", () => {
    expect(formatIDR("120000")).toContain("120.000");
  });

  it("memberi tanda hubung untuk nilai kosong", () => {
    expect(formatIDR(null)).toBe("-");
    expect(formatIDR(undefined)).toBe("-");
    expect(formatIDR("")).toBe("-");
  });

  it("tidak memformat nilai yang bukan angka", () => {
    expect(formatIDR("bukan angka")).toBe("-");
  });
});

describe("formatNumber", () => {
  it("memformat angka negatif", () => {
    expect(formatNumber(-3)).toContain("3");
  });
});

describe("formatIDRRange", () => {
  it("tampilkan satu harga kalau semua varian sama", () => {
    expect(formatIDRRange(["120000", "120000"])).toContain("120.000");
  });

  it("tampilkan rentang kalau harga varian berbeda", () => {
    expect(formatIDRRange(["120000", "150000"])).toContain("120.000");
    expect(formatIDRRange(["120000", "150000"])).toContain("150.000");
  });

  it("abaikan nilai kosong", () => {
    expect(formatIDRRange([])).toBe("-");
    expect(formatIDRRange([null, undefined])).toBe("-");
  });
});
