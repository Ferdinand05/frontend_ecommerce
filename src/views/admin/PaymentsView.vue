<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AdminDataTable from "@/components/admin/AdminDataTable.vue";
import TableFilterBar from "@/components/admin/table/TableFilterBar.vue";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminPaymentsQuery } from "@/api/features/admin/payments/payment.queries";
import { column } from "@/lib/table-columns";
import { formatDateTime, formatIDR } from "@/lib/format";
import { humanizeStatus, statusVariant } from "@/lib/table";

const PAGE_SIZE = 20;

const pageIndex = ref(0);
const status = ref("all");

const params = computed(() => ({
  status: status.value === "all" ? undefined : status.value,
  page: pageIndex.value + 1,
  page_size: PAGE_SIZE,
}));

const paymentsQuery = useAdminPaymentsQuery(() => params.value);
const payments = computed(() => paymentsQuery.data.value?.payments ?? []);
const total = computed(() => paymentsQuery.data.value?.meta.total ?? 0);

watch(status, () => {
  pageIndex.value = 0;
});

const statusOptions = ["PENDING", "PAID", "EXPIRED", "FAILED"];

const columns = [
  column("external_id", "Referensi"),
  column("provider", "Penyedia"),
  column("status", "Status"),
  column("amount", "Nominal", "right"),
  column("paid_at", "Dibayar"),
  column("created_at", "Dibuat"),
];
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <TableFilterBar label="Filter pembayaran">
      <div class="grid gap-2 sm:w-48">
        <span class="text-sm font-medium text-muted-foreground">Status</span>
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
      :data="payments"
      :columns="columns"
      :loading="paymentsQuery.isPending.value"
      :error="paymentsQuery.error.value"
      :total="total"
      :page-index="pageIndex"
      :page-size="PAGE_SIZE"
      empty-title="Belum ada pembayaran"
      empty-hint="Pilih status lain atau tunggu ada pembayaran baru masuk."
      loading-label="Memuat pembayaran"
      error-title="Pembayaran gagal dimuat"
      @retry="paymentsQuery.refetch()"
      @update:page-index="pageIndex = $event"
    >
      <template #cell="{ columnId, row }">
        <template v-if="columnId === 'external_id'">
          <span class="font-mono text-sm">{{ row.original.external_id }}</span>
        </template>
        <template v-else-if="columnId === 'provider'">
          <span class="text-sm">{{ row.original.provider }}</span>
        </template>
        <template v-else-if="columnId === 'status'">
          <Badge :variant="statusVariant(row.original.status)">
            {{ humanizeStatus(row.original.status) }}
          </Badge>
        </template>
        <template v-else-if="columnId === 'amount'">
          <span class="text-sm font-medium tabular-nums">{{ formatIDR(row.original.amount) }}</span>
        </template>
        <template v-else-if="columnId === 'paid_at'">
          <span class="text-sm text-muted-foreground">{{ formatDateTime(row.original.paid_at) }}</span>
        </template>
        <template v-else-if="columnId === 'created_at'">
          <span class="text-sm text-muted-foreground">{{ formatDateTime(row.original.created_at) }}</span>
        </template>
      </template>
    </AdminDataTable>
  </div>
</template>
