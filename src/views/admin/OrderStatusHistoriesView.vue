<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AdminDataTable from "@/components/admin/AdminDataTable.vue";
import OrderStatusHistoryPanel from "@/components/admin/OrderStatusHistoryPanel.vue";
import TableFilterBar from "@/components/admin/table/TableFilterBar.vue";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminOrdersQuery } from "@/api/features/admin/orders/order.queries";
import { column, expanderColumn } from "@/lib/table-columns";
import { formatDateTime, formatIDR } from "@/lib/format";
import { humanizeStatus, statusVariant } from "@/lib/table";

const PAGE_SIZE = 20;

const pageIndex = ref(0);
const status = ref("all");
const orderNumber = ref("");
const expanded = ref<Record<string, boolean>>({});

const params = computed(() => ({
  status: status.value === "all" ? undefined : status.value,
  order_number: orderNumber.value.trim() || undefined,
  page: pageIndex.value + 1,
  page_size: PAGE_SIZE,
}));

const ordersQuery = useAdminOrdersQuery(() => params.value);
const orders = computed(() => ordersQuery.data.value?.orders ?? []);
const total = computed(() => ordersQuery.data.value?.meta.total ?? 0);

watch([status, orderNumber], () => {
  pageIndex.value = 0;
});

const statusOptions = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];

const columns = [
  expanderColumn(),
  column("order_number", "Nomor pesanan"),
  column("status", "Status terakhir"),
  column("total_amount", "Total", "right"),
  column("created_at", "Dibuat"),
];
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <TableFilterBar label="Filter riwayat status">
      <div class="grid flex-1 gap-2 sm:min-w-52">
        <label class="text-xs font-semibold text-muted-foreground" for="history-order-number">
          Nomor pesanan
        </label>
        <Input id="history-order-number" v-model="orderNumber" type="search" placeholder="Contoh ORD-2026" />
      </div>
      <div class="grid gap-2 sm:w-40">
        <span class="text-xs font-semibold text-muted-foreground">Status</span>
        <Select v-model="status">
          <SelectTrigger>
            <SelectValue placeholder="Semua status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua status</SelectItem>
            <SelectItem v-for="option in statusOptions" :key="option" :value="option">
              {{ humanizeStatus(option) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </TableFilterBar>

    <AdminDataTable
      :data="orders"
      :columns="columns"
      :loading="ordersQuery.isPending.value"
      :error="ordersQuery.error.value"
      :total="total"
      :page-index="pageIndex"
      :page-size="PAGE_SIZE"
      :expanded="expanded"
      expandable
      empty-title="Belum ada pesanan yang cocok"
      empty-hint="Longgarkan filter status atau nomor pesanan untuk melihat riwayat lain."
      loading-label="Memuat riwayat status"
      error-title="Riwayat status gagal dimuat"
      @retry="ordersQuery.refetch()"
      @update:page-index="pageIndex = $event"
      @update:expanded="expanded = $event"
    >
      <template #expanded="{ row }">
        <OrderStatusHistoryPanel :order-id="row.original.id" />
      </template>
      <template #cell="{ columnId, row }">
        <template v-if="columnId === 'order_number'">
          <span class="font-mono text-xs">{{ row.original.order_number }}</span>
        </template>
        <template v-else-if="columnId === 'status'">
          <Badge :variant="statusVariant(row.original.status)">
            {{ humanizeStatus(row.original.status) }}
          </Badge>
        </template>
        <template v-else-if="columnId === 'total_amount'">
          <span class="text-sm tabular-nums">{{ formatIDR(row.original.total_amount) }}</span>
        </template>
        <template v-else-if="columnId === 'created_at'">
          <span class="text-sm text-muted-foreground">{{ formatDateTime(row.original.created_at) }}</span>
        </template>
      </template>
    </AdminDataTable>
  </div>
</template>
