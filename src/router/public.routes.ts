import StoreLayout from "@/views/layouts/StoreLayout.vue";
import HomeView from "@/views/store/HomeView.vue";
import CartView from "@/views/store/CartView.vue";
import type { RouteRecordRaw } from "vue-router";


export const publicRoutes : RouteRecordRaw[] = [
    {
        path: '/',
        component: StoreLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: HomeView,
            },
            {
                path: 'cart',
                name: 'cart',
                component: CartView,
            },
        ]
    }
    
]