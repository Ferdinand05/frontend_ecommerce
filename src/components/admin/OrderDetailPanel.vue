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

const orderQuery = useAdminOrderQuery(() => props.orderId);const order = computed(() => orderQuery.data.value?.order);
const address = computed(() => order.value?.address);
</script>

<template>
  <div class="p-4">
    <p v-if="orderQuery.isPending.value" class="text-sm text-muted-foreground" aria-busy="true">
      Memuat detail pesanan
    </p>

    <p v-else-if="orderQuery.error.value" class="text-sm text-destructive">
      Gagal memuat detail pesanan ini. Tutup dan buka lagi barisnya untuk mencoba ulang.
    </p>

    <div v-else-if="order" class="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div class="grid gap-3">
        <div class="overflow-x-auto rounded-md border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead class="text-right">Harga</TableHead>
                <TableHead class="text-right">Jumlah</TableHead>
                <TableHead class="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="item in order.items" :key="item.id">
                <TableCell>
                  <p class="text-sm font-medium">{{ item.product_name }}</p>
                  <p class="text-xs text-muted-foreground">{{ item.variant_name }} · {{ item.sku }}</p>
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
      </div>

      <div class="grid content-start gap-5">
        <div>
          <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Alamat pengiriman
          </h3>
          <address v-if="address" class="text-sm not-italic leading-relaxed">
            <p class="font-medium">{{ address.recipient_name }}</p>
            <p class="text-muted-foreground">{{ address.phone }}</p>
            <p class="text-muted-foreground">{{ address.address }}</p>
            <p class="text-muted-foreground">
              {{ address.city }}, {{ address.province }} {{ address.postal_code }}
            </p>
          </address>
        </div>

        <div>
          <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Riwayat status
          </h3>
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
        </div>
      </div>
    </div>
  </div>
</template>
