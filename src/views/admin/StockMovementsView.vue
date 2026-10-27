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
import { useAdminStockMovementsQuery } from "@/api/features/admin/stock-movements/stock-movement.queries";
import { column } from "@/lib/table-columns";
import { formatDateTime, formatNumber } from "@/lib/format";
import { humanizeStatus, movementTypeVariant } from "@/lib/table";

const PAGE_SIZE = 20;

const pageIndex = ref(0);
const type = ref("all");

const params = computed(() => ({
  type: type.value === "all" ? undefined : type.value,
  page: pageIndex.value + 1,
  page_size: PAGE_SIZE,
}));

const movementsQuery = useAdminStockMovementsQuery(() => params.value);
const movements = computed(() => movementsQuery.data.value?.movements ?? []);
const total = computed(() => movementsQuery.data.value?.meta.total ?? 0);

watch(type, () => {
  pageIndex.value = 0;
});

const typeOptions = ["RESTOCK", "SALE", "RETURN", "DAMAGE", "ADJUSTMENT", "ORDER_CANCEL", "RESERVE"];

const columns = [
  column("type", "Jenis"),
  column("sku", "SKU"),
  column("variant_name", "Varian"),
  column("quantity", "Jumlah", "right"),
  column("note", "Catatan"),
  column("created_at", "Waktu"),
];
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <TableFilterBar label="Filter perpindahan stok">
      <div class="grid gap-2 sm:w-52">
        <span class="text-xs font-semibold text-muted-foreground">Jenis</span>
        <Select v-model="type">
          <SelectTrigger>
            <SelectValue placeholder="Semua jenis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua jenis</SelectItem>
            <SelectItem v-for="option in typeOptions" :key="option" :value="option">
              {{ humanizeStatus(option) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </TableFilterBar>

    <AdminDataTable
      :data="movements"
      :columns="columns"
      :loading="movementsQuery.isPending.value"
      :error="movementsQuery.error.value"
      :total="total"
      :page-index="pageIndex"
      :page-size="PAGE_SIZE"
      empty-title="Belum ada perpindahan stok"
      empty-hint="Pilih jenis lain atau tunggu ada transaksi stok baru."
      loading-label="Memuat perpindahan stok"
      error-title="Perpindahan stok gagal dimuat"
      @retry="movementsQuery.refetch()"
      @update:page-index="pageIndex = $event"
    >
      <template #cell="{ columnId, row }">
        <template v-if="columnId === 'type'">
          <Badge :variant="movementTypeVariant(row.original.type)">
            {{ humanizeStatus(row.original.type) }}
          </Badge>
        </template>
        <template v-else-if="columnId === 'sku'">
          <span class="font-mono text-xs">{{ row.original.sku }}</span>
        </template>
        <template v-else-if="columnId === 'variant_name'">
          <span class="text-sm">{{ row.original.variant_name }}</span>
        </template>
        <template v-else-if="columnId === 'quantity'">
          <span
            class="text-sm font-medium tabular-nums"
            :class="row.original.quantity < 0 ? 'text-destructive' : 'text-foreground'"
          >
            {{ row.original.quantity > 0 ? `+${formatNumber(row.original.quantity)}` : formatNumber(row.original.quantity) }}
          </span>
        </template>
        <template v-else-if="columnId === 'note'">
          <span class="text-sm text-muted-foreground">{{ row.original.note || "-" }}</span>
        </template>
        <template v-else-if="columnId === 'created_at'">
          <span class="text-sm text-muted-foreground">{{ formatDateTime(row.original.created_at) }}</span>
        </template>
      </template>
    </AdminDataTable>
  </div>
</template>
