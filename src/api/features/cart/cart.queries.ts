import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { useAuthStore } from "@/stores/auth";
import {
  addCartItem,
  clearCart,
  decreaseCartItem,
  getCart,
  increaseCartItem,
  removeCartItem,
} from "./cart.api";

export function useCartQuery() {
  const authStore = useAuthStore();
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: authStore.isAuthenticated,
    staleTime: 30_000,
  });
}

function useCartInvalidation() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };
}

export function useAddCartItemMutation() {
  const invalidate = useCartInvalidation();
  return useMutation({
    mutationFn: (productVariantId: string) => addCartItem(productVariantId),
    onSuccess: invalidate,
  });
}

export function useIncreaseCartItemMutation() {
  const invalidate = useCartInvalidation();
  return useMutation({
    mutationFn: (itemId: string) => increaseCartItem(itemId),
    onSuccess: invalidate,
  });
}

export function useDecreaseCartItemMutation() {
  const invalidate = useCartInvalidation();
  return useMutation({
    mutationFn: (itemId: string) => decreaseCartItem(itemId),
    onSuccess: invalidate,
  });
}

export function useRemoveCartItemMutation() {
  const invalidate = useCartInvalidation();
  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: invalidate,
  });
}

export function useClearCartMutation() {
  const invalidate = useCartInvalidation();
  return useMutation({
    mutationFn: () => clearCart(),
    onSuccess: invalidate,
  });
}
