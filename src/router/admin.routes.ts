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
      { path: "dashboard", name: "admin-dashboard", component: DashboardView, meta: { title: "Dasbor" } },
      { path: "users", name: "admin-users", component: UsersView, meta: { title: "Pengguna" } },
      { path: "roles", name: "admin-roles", component: RolesView, meta: { title: "Peran" } },
      { path: "orders", name: "admin-orders", component: OrdersView, meta: { title: "Pesanan" } },
      {
        path: "order-status-histories",
        name: "admin-order-status-histories",
        component: OrderStatusHistoriesView,
        meta: { title: "Riwayat status pesanan" },
      },
      { path: "categories", name: "admin-categories", component: CategoriesView, meta: { title: "Kategori" } },
      { path: "products", name: "admin-products", component: ProductsView, meta: { title: "Produk" } },
      {
        path: "stock-movements",
        name: "admin-stock-movements",
        component: StockMovementsView,
        meta: { title: "Perpindahan stok" },
      },
      { path: "payments", name: "admin-payments", component: PaymentsView, meta: { title: "Pembayaran" } },
      { path: "shipments", name: "admin-shipments", component: ShipmentsView, meta: { title: "Pengiriman" } },
    ],
  },
];
