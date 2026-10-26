import AdminLayout from "@/views/layouts/AdminLayout.vue";
import DashboardView from "@/views/admin/DashboardView.vue";
import UsersView from "@/views/admin/UsersView.vue";
import RolesView from "@/views/admin/RolesView.vue";
import OrdersView from "@/views/admin/OrdersView.vue";
import OrderStatusHistoriesView from "@/views/admin/OrderStatusHistoriesView.vue";
import CategoriesView from "@/views/admin/CategoriesView.vue";
import ProductsView from "@/views/admin/ProductsView.vue";
import StockMovementsView from "@/views/admin/StockMovementsView.vue";
import PaymentsView from "@/views/admin/PaymentsView.vue";
import ShipmentsView from "@/views/admin/ShipmentsView.vue";
import type { RouteRecordRaw } from "vue-router";

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: "/admin",
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
    children: [
      { path: "", redirect: { name: "admin-dashboard" } },
      { path: "dashboard", name: "admin-dashboard", component: DashboardView, meta: { title: "Dashboard" } },
      { path: "users", name: "admin-users", component: UsersView, meta: { title: "Users" } },
      { path: "roles", name: "admin-roles", component: RolesView, meta: { title: "Roles" } },
      { path: "orders", name: "admin-orders", component: OrdersView, meta: { title: "Orders" } },
      {
        path: "order-status-histories",
        name: "admin-order-status-histories",
        component: OrderStatusHistoriesView,
        meta: { title: "Order status histories" },
      },
      { path: "categories", name: "admin-categories", component: CategoriesView, meta: { title: "Categories" } },
      { path: "products", name: "admin-products", component: ProductsView, meta: { title: "Products" } },
      {
        path: "stock-movements",
        name: "admin-stock-movements",
        component: StockMovementsView,
        meta: { title: "Stock movements" },
      },
      { path: "payments", name: "admin-payments", component: PaymentsView, meta: { title: "Payments" } },
      { path: "shipments", name: "admin-shipments", component: ShipmentsView, meta: { title: "Shipments" } },
    ],
  },
];
