<script setup lang="ts">
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminOrderQuery } from "@/api/features/admin/orders/order.queries";
import { formatDateTime, formatIDR, formatNumber } from "@/lib/format";
import { humanizeStatus, statusVariant } from "@/lib/table";

const props = defineProps<{
  orderId: string;
}>();

const orderQuery = useAdminOrderQuery(() => props.orderId);
const order = computed(() => orderQuery.data.value?.order);
const address = computed(() => order.value?.address);

const totalWeight = computed(() =>
  (order.value?.items ?? []).reduce((sum, item) => sum + item.weight_grams * item.quantity, 0),
);

const itemCount = computed(() =>
  (order.value?.items ?? []).reduce((sum, item) => sum + item.quantity, 0),
);
</script>

<template>
  <div>
    <p v-if="orderQuery.isPending.value" class="text-sm text-muted-foreground" aria-busy="true">
      Memuat detail pesanan
    </p>

    <p v-else-if="orderQuery.error.value" class="text-sm text-destructive">
      Gagal memuat detail pesanan ini. Tutup dan buka lagi barisnya untuk mencoba ulang.
    </p>

    <div v-else-if="order" class="grid gap-6">
      <section class="grid gap-3">
        <h3 class="text-sm font-medium text-muted-foreground">Ringkasan</h3>
        <dl class="grid gap-3 text-sm sm:grid-cols-2">
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Nomor pesanan</dt>
            <dd class="text-right font-mono text-sm">{{ order.order_number }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Status</dt>
            <dd class="text-right">
              <Badge :variant="statusVariant(order.status)">
                {{ humanizeStatus(order.status) }}
              </Badge>
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Kurir</dt>
            <dd class="text-right">
              {{ order.courier_name }} {{ order.courier_service_name }}
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Batas bayar</dt>
            <dd class="text-right">{{ formatDateTime(order.payment_expires_at) }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Dibuat</dt>
            <dd class="text-right">{{ formatDateTime(order.created_at) }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Diperbarui</dt>
            <dd class="text-right">{{ formatDateTime(order.updated_at) }}</dd>
          </div>
        </dl>
      </section>

      <section class="grid gap-3">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h3 class="text-sm font-medium text-muted-foreground">Barang yang dipesan</h3>
          <p class="text-sm text-muted-foreground">
            {{ formatNumber(itemCount) }} barang, berat {{ formatNumber(totalWeight) }} g
          </p>
        </div>

        <div class="overflow-x-auto rounded-md border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead class="w-28 text-right">Harga</TableHead>
                <TableHead class="w-24 text-right">Jumlah</TableHead>
                <TableHead class="w-28 text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="item in order.items" :key="item.id">
                <TableCell>
                  <p class="text-sm font-medium">{{ item.product_name }}</p>
                  <p class="text-sm text-muted-foreground">
                    {{ item.variant_name }} · <span class="font-mono">{{ item.sku }}</span>
                  </p>
                </TableCell>
                <TableCell class="text-right text-sm tabular-nums">{{ formatIDR(item.price) }}</TableCell>
                <TableCell class="text-right text-sm tabular-nums">{{ formatNumber(item.quantity) }}</TableCell>
                <TableCell class="text-right text-sm tabular-nums">{{ formatIDR(item.subtotal) }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <dl class="grid gap-2 text-sm sm:grid-cols-2">
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Subtotal</dt>
            <dd class="tabular-nums">{{ formatIDR(order.subtotal) }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Ongkir</dt>
            <dd class="tabular-nums">{{ formatIDR(order.shipping_cost) }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Diskon</dt>
            <dd class="tabular-nums">{{ formatIDR(order.discount_amount) }}</dd>
          </div>
          <div class="flex justify-between gap-4 font-semibold">
            <dt>Total</dt>
            <dd class="tabular-nums">{{ formatIDR(order.total_amount) }}</dd>
          </div>
        </dl>
      </section>

      <div class="grid gap-6 lg:grid-cols-2">
        <section class="grid gap-3">
          <h3 class="text-sm font-medium text-muted-foreground">Alamat pengiriman</h3>
          <address v-if="address" class="text-sm not-italic leading-relaxed">
            <p class="font-medium">{{ address.recipient_name }}</p>
            <p class="text-muted-foreground">{{ address.phone }}</p>
            <p class="text-muted-foreground">{{ address.address }}</p>
            <p class="text-muted-foreground">
              {{ address.city }}, {{ address.province }} {{ address.postal_code }}
            </p>
          </address>
        </section>

        <section class="grid gap-3">
          <h3 class="text-sm font-medium text-muted-foreground">Riwayat status</h3>
          <ol class="grid gap-2">
            <li
              v-for="history in order.status_histories"
              :key="history.id"
              class="flex flex-wrap items-center gap-2 text-sm"
            >
              <Badge :variant="statusVariant(history.status)">{{ humanizeStatus(history.status) }}</Badge>
              <span class="text-muted-foreground">{{ formatDateTime(history.created_at) }}</span>
              <span v-if="history.note" class="w-full text-muted-foreground">{{ history.note }}</span>
            </li>
          </ol>
        </section>
      </div>
    </div>
  </div>
</template>
