import { describe, expect, it } from "vitest";
import { parseAreaName } from "@/lib/area";

describe("parseAreaName", () => {
  it("mengambil kota dan provinsi dari nama area API", () => {
    expect(parseAreaName("Sumur Bandung, Bandung, Jawa Barat. 40111")).toEqual({
      city: "Bandung",
      province: "Jawa Barat",
    });
  });

  it("menangani nama area tanpa kode pos", () => {
    expect(parseAreaName("Sumur Bandung, Bandung, Jawa Barat")).toEqual({
      city: "Bandung",
      province: "Jawa Barat",
    });
  });

  it("mengembalikan string kosong untuk nama yang tidak lengkap", () => {
    expect(parseAreaName("Kota Malaka")).toEqual({ city: "", province: "" });
  });
});
