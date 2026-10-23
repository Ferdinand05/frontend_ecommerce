import AccountLayout from "@/views/layouts/AccountLayout.vue";
import type { RouteRecordRaw } from "vue-router";




export const customerRoutes : RouteRecordRaw[] = [
    {
        path:"/",
        component:AccountLayout,
        meta: {
            requiresAuth: true,
            roles: ['customer'],
        },
        children :[]
    }
]