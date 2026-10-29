<script setup lang="ts">
import { computed } from "vue";
import { CircleAlert, CreditCard, Package, Users } from "@lucide/vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminMetricsSummaryQuery } from "@/api/features/admin/metrics/metric.queries";
import { useAdminOrdersQuery } from "@/api/features/admin/orders/order.queries";
import { useAdminLowStockVariantsQuery } from "@/api/features/admin/products/product.queries";
import { formatDateTime, formatIDR, formatNumber } from "@/lib/format";
import { humanizeStatus, statusVariant, stockState } from "@/lib/table";

const metricsQuery = useAdminMetricsSummaryQuery();
const metrics = computed(() => metricsQuery.data.value);

const ordersQuery = useAdminOrdersQuery(() => ({ page: 1, page_size: 5 }));
const recentOrders = computed(() => ordersQuery.data.value?.orders ?? []);

const lowStockQuery = useAdminLowStockVariantsQuery();
const lowStockVariants = computed(() => lowStockQuery.data.value ?? []);

const cards = computed(() => {
  const summary = metrics.value;
  if (!summary) return [];
  return [
    {
      id: "revenue",
      label: "Total pendapatan",
      value: formatIDR(summary.total_revenue),
      icon: CreditCard,
    },
    {
      id: "orders",
      label: "Pesanan aktif",
      value: formatNumber(summary.active_orders),
      icon: Package,
    },
    {
      id: "users",
      label: "Pengguna baru",
      value: formatNumber(summary.new_users),
      icon: Users,
    },
    {
      id: "low-stock",
      label: "Varian stok menipis",
      value: formatNumber(summary.low_stock_count),
      icon: CircleAlert,
    },
  ];
});
</script>

<template>
  <div class="grid min-w-0 gap-6">
    <section class="min-w-0" aria-labelledby="metrics-title">
      <h2 id="metrics-title" class="sr-only">Ringkasan angka</h2>
      <p class="mb-3 text-sm text-muted-foreground">
        Ringkasan ini mencakup seluruh transaksi yang tercatat, tanpa batas periode waktu.
      </p>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <template v-if="metricsQuery.isPending.value">
          <Card v-for="slot in 4" :key="`skeleton-${slot}`">
            <CardHeader>
              <CardDescription>Ringkasan</CardDescription>
              <Skeleton class="h-8 w-32" />
            </CardHeader>
          </Card>
        </template>

        <Card v-for="card in cards" :key="card.id">
          <CardHeader>
            <CardDescription class="flex items-center gap-2">
              <component :is="card.icon" :size="14" aria-hidden="true" class="text-primary" />
              {{ card.label }}
            </CardDescription>
            <CardTitle class="text-3xl font-semibold tracking-tight tabular-nums">{{ card.value }}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <p v-if="metricsQuery.error.value" class="mt-3 text-sm text-destructive">
        Ringkasan gagal dimuat. Muat ulang halaman untuk mencoba lagi.
      </p>
    </section>

    <Card class="min-w-0">
      <CardHeader>
        <CardTitle>Varian stok menipis</CardTitle>
        <CardDescription>Varian dengan sisa stok 10 atau kurang</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="lowStockQuery.isPending.value" class="space-y-3" aria-busy="true">
          <p class="sr-only">Memuat varian stok menipis</p>
          <Skeleton v-for="row in 4" :key="row" class="h-9 w-full" />
        </div>

        <p v-else-if="lowStockQuery.error.value" class="text-sm text-destructive">
          Gagal memuat daftar varian stok menipis. Muat ulang halaman untuk mencoba lagi.
        </p>

        <p v-else-if="lowStockVariants.length === 0" class="text-sm text-muted-foreground">
          Semua varian masih punya stok di atas 10.
        </p>

        <div v-else class="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead>Varian</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead class="text-right">Sisa stok</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in lowStockVariants" :key="row.variant.id">
                <TableCell class="text-sm font-medium">{{ row.productName }}</TableCell>
                <TableCell class="text-sm">{{ row.variant.name }}</TableCell>
                <TableCell class="font-mono text-sm">{{ row.variant.sku }}</TableCell>
                <TableCell class="text-sm text-muted-foreground">{{ row.categoryName }}</TableCell>
                <TableCell class="text-right text-sm font-medium tabular-nums">
                  {{ formatNumber(row.available) }}
                </TableCell>
                <TableCell>
                  <Badge :variant="stockState(row.available).variant">
                    {{ stockState(row.available).label }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <Card class="min-w-0">
      <CardHeader>
        <CardTitle>Pesanan terbaru</CardTitle>
        <CardDescription>Lima pesanan terakhir yang masuk</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="ordersQuery.isPending.value" class="space-y-3" aria-busy="true">
          <p class="sr-only">Memuat pesanan terbaru</p>
          <Skeleton v-for="row in 4" :key="row" class="h-9 w-full" />
        </div>

        <p v-else-if="ordersQuery.error.value" class="text-sm text-destructive">
          Gagal memuat pesanan terbaru. Muat ulang halaman untuk mencoba lagi.
        </p>

        <p v-else-if="recentOrders.length === 0" class="text-sm text-muted-foreground">
          Belum ada pesanan yang masuk. Pesanan baru akan tampil di sini.
        </p>

        <div v-else class="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor pesanan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Kurir</TableHead>
                <TableHead class="text-right">Total</TableHead>
                <TableHead class="text-right">Dibuat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="order in recentOrders" :key="order.id">
                <TableCell class="font-mono text-sm">{{ order.order_number }}</TableCell>
                <TableCell>
                  <Badge :variant="statusVariant(order.status)">{{ humanizeStatus(order.status) }}</Badge>
                </TableCell>
                <TableCell class="text-sm">{{ order.courier_name }} {{ order.courier_service_name }}</TableCell>
                <TableCell class="text-right text-sm font-medium tabular-nums">
                  {{ formatIDR(order.total_amount) }}
                </TableCell>
                <TableCell class="text-right text-sm text-muted-foreground">
                  {{ formatDateTime(order.created_at) }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
