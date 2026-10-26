import AccountLayout from "@/views/layouts/AccountLayout.vue";
import AccountDetailsView from "@/views/account/AccountDetailsView.vue";
import OrdersView from "@/views/account/OrdersView.vue";
import OrderHistoryView from "@/views/account/OrderHistoryView.vue";
import type { RouteRecordRaw } from "vue-router";




export const customerRoutes : RouteRecordRaw[] = [
    {
        path:"/account",
        component:AccountLayout,
        meta: {
            requiresAuth: true,
            roles: ['customer'],
        },
        children :[
            { path: "", name: "account", component: AccountDetailsView },
            { path: "orders", name: "customer-orders", component: OrdersView },
            { path: "order-history", name: "customer-order-history", component: OrderHistoryView },
        ]
    }
]