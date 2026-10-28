import { apiClient } from "@/api/client";
import type { Cart, CartItem } from "./cart.types";

export async function getCart(): Promise<Cart> {
  const response = await apiClient.get<{ cart: Cart }>("/cart");
  return response.data.cart;
}

export async function addCartItem(productVariantId: string): Promise<CartItem> {
  const response = await apiClient.post<{ item: CartItem }>("/cart/items", {
    product_variant_id: productVariantId,
  });
  return response.data.item;
}

export async function increaseCartItem(itemId: string): Promise<CartItem | null> {
  const response = await apiClient.post<{ item: CartItem }>(`/cart/items/${itemId}/increase`);
  return response.data.item;
}

export async function decreaseCartItem(itemId: string): Promise<CartItem | null> {
  const response = await apiClient.post<{ item?: CartItem }>(`/cart/items/${itemId}/decrease`);
  return response.data?.item ?? null;
}

export async function removeCartItem(itemId: string): Promise<void> {
  await apiClient.delete(`/cart/items/${itemId}`);
}

export async function clearCart(): Promise<void> {
  await apiClient.delete("/cart");
}
