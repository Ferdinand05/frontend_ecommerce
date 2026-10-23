import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/store/HomeView.vue";
import { publicRoutes } from "./public.routes.ts";
import { authRoutes } from "./auth.routes.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    ...authRoutes,

  ],

   scrollBehavior() {
    return { top: 0 }
  },

});

export default router;
