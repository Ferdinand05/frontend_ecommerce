<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AdminDataTable from "@/components/admin/AdminDataTable.vue";
import AdminDialog from "@/components/admin/AdminDialog.vue";
import AdminFormDialog from "@/components/admin/AdminFormDialog.vue";
import OrderDetailPanel from "@/components/admin/OrderDetailPanel.vue";
import RowActions from "@/components/admin/RowActions.vue";
import TableFilterBar from "@/components/admin/table/TableFilterBar.vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminOrdersQuery,
  useUpdateAdminOrderStatusMutation,
} from "@/api/features/admin/orders/order.queries";
import type { AdminOrder } from "@/api/features/admin/orders/order.types";
import { column } from "@/lib/table-columns";
import { formatDateTime, formatIDR } from "@/lib/format";
import { humanizeStatus, nextOrderStatuses, ORDER_STATUS_OPTIONS, statusVariant } from "@/lib/table";

const PAGE_SIZE = 20;

const pageIndex = ref(0);
const status = ref("all");
const orderNumber = ref("");
const startDate = ref("");
const endDate = ref("");

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

const columns = [
  column("order_number", "Nomor pesanan"),
  column("status", "Status"),
  column("courier", "Kurir"),
  column("total_amount", "Total", "right"),
  column("created_at", "Dibuat"),
  column("actions", "Aksi"),
];

const detailOpen = ref(false);
const detailOrder = ref<AdminOrder | null>(null);

const statusOpen = ref(false);
const statusOrder = ref<AdminOrder | null>(null);
const nextStatus = ref("");
const statusNote = ref("");

const statusMutation = useUpdateAdminOrderStatusMutation();

function openDetail(order: AdminOrder) {
  detailOrder.value = order;
  detailOpen.value = true;
}

function openStatus(order: AdminOrder) {
  statusOrder.value = order;
  nextStatus.value = nextOrderStatuses(order.status)[0] ?? "";
  statusNote.value = "";
  statusMutation.reset();
  statusOpen.value = true;
}

async function submitStatus() {
  if (!statusOrder.value || !nextStatus.value) return;
  await statusMutation.mutateAsync({
    orderId: statusOrder.value.id,
    payload: { status: nextStatus.value, note: statusNote.value || null },
  });
  statusOpen.value = false;
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <TableFilterBar label="Filter pesanan">
      <div class="grid flex-1 gap-2 sm:min-w-52">
        <label class="text-sm font-medium text-muted-foreground" for="order-number">
          Nomor pesanan
        </label>
        <Input id="order-number" v-model="orderNumber" type="search" placeholder="Contoh ORD-2026" />
      </div>
      <div class="grid gap-2 sm:w-40">
        <span class="text-sm font-medium text-muted-foreground">Status</span>
        <Select v-model="status">
          <SelectTrigger>
            <SelectValue placeholder="Semua status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua status</SelectItem>
            <SelectItem v-for="option in ORDER_STATUS_OPTIONS" :key="option" :value="option">
              {{ humanizeStatus(option) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="grid gap-2">
        <label class="text-sm font-medium text-muted-foreground" for="order-start-date">Dari tanggal</label>
        <Input id="order-start-date" v-model="startDate" type="date" class="sm:w-40" />
      </div>
      <div class="grid gap-2">
        <label class="text-sm font-medium text-muted-foreground" for="order-end-date">Sampai tanggal</label>
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
      empty-title="Belum ada pesanan yang cocok"
      empty-hint="Longgarkan filter status, nomor pesanan, atau rentang tanggal."
      loading-label="Memuat pesanan"
      error-title="Pesanan gagal dimuat"
      @retry="ordersQuery.refetch()"
      @update:page-index="pageIndex = $event"
    >
      <template #cell="{ columnId, row }">
        <template v-if="columnId === 'order_number'">
          <span class="font-mono text-sm">{{ row.original.order_number }}</span>
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
        <template v-else-if="columnId === 'actions'">
          <RowActions
            :actions="[
              { label: 'Lihat detail', onSelect: () => openDetail(row.original) },
              {
                label: 'Ubah status',
                onSelect: () => openStatus(row.original),
                disabled: nextOrderStatuses(row.original.status).length === 0,
              },
            ]"
          />
        </template>
      </template>
    </AdminDataTable>

    <AdminDialog
      v-model:open="detailOpen"
      title="Detail pesanan"
      :description="detailOrder?.order_number"
      wide
    >
      <OrderDetailPanel v-if="detailOrder" :order-id="detailOrder.id" />

      <template #footer>
        <Button
          variant="outline"
          :disabled="!detailOrder || nextOrderStatuses(detailOrder.status).length === 0"
          @click="detailOpen = false; detailOrder && openStatus(detailOrder)"
        >
          Ubah status
        </Button>
      </template>
    </AdminDialog>

    <AdminFormDialog
      v-model:open="statusOpen"
      title="Ubah status pesanan"
      :description="
        statusOrder
          ? `Pesanan ${statusOrder.order_number} sekarang berstatus ${humanizeStatus(statusOrder.status)}.`
          : ''
      "
      submit-label="Simpan status"
      :pending="statusMutation.isPending.value"
      :error="statusMutation.error.value"
      @submit="submitStatus"
    >
      <div class="grid gap-2">
        <Label for="order-next-status">Status baru</Label>
        <Select v-model="nextStatus">
          <SelectTrigger id="order-next-status">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="option in nextOrderStatuses(statusOrder?.status ?? '')"
              :key="option"
              :value="option"
            >
              {{ humanizeStatus(option) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="grid gap-2">
        <Label for="order-status-note">Catatan</Label>
        <Textarea id="order-status-note" v-model="statusNote" rows="3" />
      </div>
    </AdminFormDialog>
  </div>
</template>
