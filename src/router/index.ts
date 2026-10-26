import { createRouter, createWebHistory } from "vue-router";
import { publicRoutes } from "./public.routes.ts";
import { authRoutes } from "./auth.routes.ts";
import { customerRoutes } from "./customer.routes.ts";
import { setupGuards } from "./guards.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...publicRoutes, ...authRoutes, ...customerRoutes],

  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    }
    return { top: 0 };
  },
});

// guard
setupGuards(router);

export default router;
