import AdminLayout from "@/views/layouts/AdminLayout.vue";
import type { RouteRecordRaw } from "vue-router";



export const adminRoutes : RouteRecordRaw[] = [
    {
        path:"/",
        component:AdminLayout,
        meta: {
            requiresAuth: true,
            roles: ['admin'],
        },
        children :[]
    }
]