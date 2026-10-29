import axios from "axios";
import { useInfiniteQuery, useQuery } from "@tanstack/vue-query";
import { getProductById, getProducts, type ProductsParams } from "./product.api";

export function useProductQuery(productId: () => string | null) {
  return useQuery(() => ({
    queryKey: ["products", "detail", productId()] as const,
    queryFn: () => getProductById(productId() as string),
    enabled: !!productId(),
    // 404 means the product is gone, not that the server hiccuped, so do not retry it.
    retry: (failureCount, failureError) => !(axios.isAxiosError(failureError) && failureError.response?.status === 404) && failureCount < 2,
    staleTime: 30_000,
  }));
}

/** Katalog publik untuk The collection: 12 produk per halaman, dimuat lewat tombol load more. */
export function useInfiniteProductsQuery(params: () => ProductsParams) {
  return useInfiniteQuery(() => ({
    queryKey: ["products", "infinite", params()] as const,
    queryFn: ({ pageParam }) => getProducts({ ...params(), page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.length * lastPage.meta.page_size;
      return loaded < lastPage.meta.total ? lastPage.meta.page + 1 : undefined;
    },
    staleTime: 30_000,
  }));
}
