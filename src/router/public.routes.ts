import StoreLayout from "@/views/layouts/StoreLayout.vue";
import HomeView from "@/views/store/HomeView.vue";
import CartView from "@/views/store/CartView.vue";
import CheckoutView from "@/views/store/CheckoutView.vue";
import ProductDetailView from "@/views/store/ProductDetailView.vue";
import type { RouteRecordRaw } from "vue-router";

// routes ini untuk public akses (no auth required)
export const publicRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: StoreLayout,
    children: [
      {
        path: "",
        name: "home",
        component: HomeView,
      },
      {
        path: "cart",
        name: "cart",
        component: CartView,
      },
      {
        path: "checkout",
        name: "checkout",
        component: CheckoutView,
        meta: { requiresAuth: true, title: "Checkout" },
      },
      {
        path: "product/:id",
        name: "product",
        component: ProductDetailView,
        meta: { title: "Product" },
      },
    ],
  },
];
