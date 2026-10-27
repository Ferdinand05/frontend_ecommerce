<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ExternalLink } from "@lucide/vue";
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
import { useAdminShipmentsQuery } from "@/api/features/admin/shipments/shipment.queries";
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

const shipmentsQuery = useAdminShipmentsQuery(() => params.value);
const shipments = computed(() => shipmentsQuery.data.value?.shipments ?? []);
const total = computed(() => shipmentsQuery.data.value?.meta.total ?? 0);

watch(status, () => {
  pageIndex.value = 0;
});

const statusOptions = ["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED", "FAILED"];

const columns = [
  column("tracking_number", "Nomor resi"),
  column("courier", "Kurir"),
  column("status", "Status"),
  column("shipping_cost", "Ongkir", "right"),
  column("created_at", "Dibuat"),
];
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <TableFilterBar label="Filter pengiriman">
      <div class="grid gap-2 sm:w-48">
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
      :data="shipments"
      :columns="columns"
      :loading="shipmentsQuery.isPending.value"
      :error="shipmentsQuery.error.value"
      :total="total"
      :page-index="pageIndex"
      :page-size="PAGE_SIZE"
      empty-title="Belum ada pengiriman"
      empty-hint="Pilih status lain atau tunggu ada pengiriman baru dibuat."
      loading-label="Memuat pengiriman"
      error-title="Pengiriman gagal dimuat"
      @retry="shipmentsQuery.refetch()"
      @update:page-index="pageIndex = $event"
    >
      <template #cell="{ columnId, row }">
        <template v-if="columnId === 'tracking_number'">
          <a
            :href="row.original.tracking_url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 font-mono text-xs text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {{ row.original.tracking_number }}
            <ExternalLink :size="12" aria-hidden="true" />
          </a>
        </template>
        <template v-else-if="columnId === 'courier'">
          <span class="text-sm">
            {{ row.original.courier_company.toUpperCase() }} {{ row.original.courier_type }}
          </span>
        </template>
        <template v-else-if="columnId === 'status'">
          <Badge :variant="statusVariant(row.original.status)">
            {{ humanizeStatus(row.original.status) }}
          </Badge>
        </template>
        <template v-else-if="columnId === 'shipping_cost'">
          <span class="text-sm tabular-nums">{{ formatIDR(row.original.shipping_cost) }}</span>
        </template>
        <template v-else-if="columnId === 'created_at'">
          <span class="text-sm text-muted-foreground">{{ formatDateTime(row.original.created_at) }}</span>
        </template>
      </template>
    </AdminDataTable>
  </div>
</template>
