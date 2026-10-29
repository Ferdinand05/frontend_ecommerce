import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import {
  createAdminProduct,
  createAdminProductVariant,
  deleteAdminProduct,
  deleteAdminProductImage,
  deleteAdminProductVariant,
  deleteAdminVariantImage,
  getAdminProductVariants,
  getAdminProducts,
  updateAdminProduct,
  updateAdminProductVariant,
  uploadAdminProductImage,
  uploadAdminVariantImage,
  type ProductRequest,
} from "./product.api";
import type {
  AdminProduct,
  AdminProductsParams,
  AdminProductVariant,
  ProductVariantRequest,
} from "./product.types";

export function useAdminProductsQuery(params: () => AdminProductsParams) {
  return useQuery(() => ({
    queryKey: ["admin", "products", params()] as const,
    queryFn: () => getAdminProducts(params()),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  }));
}

export function useAdminProductVariantsQuery(productId: () => string | null) {
  return useQuery(() => ({
    queryKey: ["admin", "products", productId(), "variants"] as const,
    queryFn: () => getAdminProductVariants(productId() as string),
    enabled: !!productId(),
    staleTime: 30_000,
  }));
}

export function useCreateAdminProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductRequest) => createAdminProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useUpdateAdminProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, payload }: { productId: string; payload: ProductRequest }) =>
      updateAdminProduct(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useDeleteAdminProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => deleteAdminProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useCreateAdminProductVariantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, payload }: { productId: string; payload: ProductVariantRequest }) =>
      createAdminProductVariant(productId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products", variables.productId, "variants"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useUpdateAdminProductVariantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      payload,
    }: {
      productId: string;
      variantId: string;
      payload: ProductVariantRequest;
    }) => updateAdminProductVariant(productId, variantId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products", variables.productId, "variants"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useDeleteAdminProductVariantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId }: { productId: string; variantId: string }) =>
      deleteAdminProductVariant(productId, variantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products", variables.productId, "variants"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useUploadAdminProductImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, file, alt }: { productId: string; file: File; alt?: string }) =>
      uploadAdminProductImage(productId, file, alt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useDeleteAdminProductImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: string; imageId: string }) =>
      deleteAdminProductImage(productId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useUploadAdminVariantImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      file,
      alt,
    }: {
      productId: string;
      variantId: string;
      file: File;
      alt?: string;
    }) => uploadAdminVariantImage(productId, variantId, file, alt),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products", variables.productId, "variants"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useDeleteAdminVariantImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      imageId,
    }: {
      productId: string;
      variantId: string;
      imageId: string;
    }) => deleteAdminVariantImage(productId, variantId, imageId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products", variables.productId, "variants"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export interface LowStockVariant {
  productId: string;
  productName: string;
  categoryName: string;
  variant: AdminProductVariant;
  available: number;
}

/** Stok tersedia paling rendah yang masih diambil alih dasbor. */
export const LOW_STOCK_THRESHOLD = 10;

async function fetchLowStockVariants(): Promise<LowStockVariant[]> {
  const products = await getAdminProducts({ page: 1, page_size: 100 });
  const rows: LowStockVariant[] = [];

  // Backend tidak punya endpoint varian global, jadi tiap produk diambil satu per satu.
  // Permintaan dibagi per batch supaya tidak membanjiri server.
  const BATCH = 8;
  for (let start = 0; start < products.products.length; start += BATCH) {
    const batch = products.products.slice(start, start + BATCH);
    const variants = await Promise.all(
      batch.map((product) => getAdminProductVariants(product.id)),
    );

    batch.forEach((product, index) => {
      for (const variant of variants[index]?.variants ?? []) {
        const quantity = variant.inventory?.quantity ?? 0;
        const reserved = variant.inventory?.reserved_quantity ?? 0;
        const available = quantity - reserved;
        if (available > LOW_STOCK_THRESHOLD) continue;
        rows.push({
          productId: product.id,
          productName: product.name,
          categoryName: product.category?.name ?? "-",
          variant,
          available,
        });
      }
    });
  }

  return rows.sort((a, b) => a.available - b.available);
}

/**
 * Daftar varian dengan stok menipis. Data diambil per produk karena
 * endpoint admin products tidak menyertakan inventory varian.
 */
export function useAdminLowStockVariantsQuery() {
  return useQuery({
    queryKey: ["admin", "low-stock-variants"] as const,
    queryFn: fetchLowStockVariants,
    staleTime: 60_000,
  });
}

export type { AdminProduct };
