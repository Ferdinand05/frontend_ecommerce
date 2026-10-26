import type { Router } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Type safety untuk meta tags bawaan Vue Router agar tidak error di TypeScript
declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
    guestOnly?: boolean; // Disesuaikan menjadi guestOnly
  }
}

export function setupGuards(router: Router) {
  router.beforeEach((to) => {
    const authStore = useAuthStore();

    // 1. Dynamic Title (Anti-slop SEO)
    const baseTitle = "Bread & Circus";
    if (to.meta.title) {
      document.title = `${to.meta.title} — ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }

    // 2. Pengecekan Akses Halaman
    const isAuthRequired = to.matched.some((record) => record.meta.requiresAuth);
    const isGuestOnly = to.matched.some((record) => record.meta.guestOnly); // Pengecekan membaca guestOnly

    if (isAuthRequired && !authStore.isAuthenticated) {
      return { name: "login", query: { redirect: to.fullPath } };
    } else if (isGuestOnly && authStore.isAuthenticated) {
      return { name: "home" }; // Sesuaikan dengan nama rute dashboard Anda
    } else {
      // Lanjutkan navigasi
      return;
    }
  });
}
