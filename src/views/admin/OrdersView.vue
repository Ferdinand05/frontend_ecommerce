<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AdminDataTable from "@/components/admin/AdminDataTable.vue";
import OrderDetailPanel from "@/components/admin/OrderDetailPanel.vue";
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
const startDate = ref("");
const endDate = ref("");
const expanded = ref<Record<string, boolean>>({});

const params = computed(() => ({
  status: status.value === "all" ? undefined : status.value,
  order_number: orderNumber.value.trim() || undefined,
  start_date: startDate.value || undefined,
  end_date: endDate.value || undefined,
  page: pageIndex.value + 1,
  page_size: PAGE_SIZE,
}));

const ordersQuery = useAdminOrdersQuery(() => params.value);
const orders = computed(() => ordersQuery.data.value?.orders ?? []);
const total = computed(() => ordersQuery.data.value?.meta.total ?? 0);

watch([status, orderNumber, startDate, endDate], () => {
  pageIndex.value = 0;
});

const statusOptions = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];

const columns = [
  expanderColumn(),
  column("order_number", "Nomor pesanan"),
  column("status", "Status"),
  column("courier", "Kurir"),
  column("total_amount", "Total", "right"),
  column("created_at", "Dibuat"),
];
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <TableFilterBar label="Filter pesanan">
      <div class="grid flex-1 gap-2 sm:min-w-52">
        <label class="text-xs font-semibold text-muted-foreground" for="order-number">
          Nomor pesanan
        </label>
        <Input id="order-number" v-model="orderNumber" type="search" placeholder="Contoh ORD-2026" />
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
      <div class="grid gap-2">
        <label class="text-xs font-semibold text-muted-foreground" for="order-start-date">Dari tanggal</label>
        <Input id="order-start-date" v-model="startDate" type="date" class="sm:w-40" />
      </div>
      <div class="grid gap-2">
        <label class="text-xs font-semibold text-muted-foreground" for="order-end-date">Sampai tanggal</label>
        <Input id="order-end-date" v-model="endDate" type="date" class="sm:w-40" />
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
      empty-hint="Longgarkan filter status, nomor pesanan, atau rentang tanggal."
      loading-label="Memuat pesanan"
      error-title="Pesanan gagal dimuat"
      @retry="ordersQuery.refetch()"
      @update:page-index="pageIndex = $event"
      @update:expanded="expanded = $event"
    >
      <template #expanded="{ row }">
        <OrderDetailPanel :order-id="row.original.id" />
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
        <template v-else-if="columnId === 'courier'">
          <span class="text-sm">
            {{ row.original.courier_name }} {{ row.original.courier_service_name }}
          </span>
        </template>
        <template v-else-if="columnId === 'total_amount'">
          <span class="text-sm font-medium tabular-nums">{{ formatIDR(row.original.total_amount) }}</span>
        </template>
        <template v-else-if="columnId === 'created_at'">
          <span class="text-sm text-muted-foreground">{{ formatDateTime(row.original.created_at) }}</span>
        </template>
      </template>
    </AdminDataTable>
  </div>
</template>
