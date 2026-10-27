<script setup lang="ts" generic="TData extends { id: string }">
import { computed, type ComputedRef } from "vue";
import { ChevronDown, ChevronRight } from "@lucide/vue";
import { FlexRender, useTable, type ColumnDef } from "@tanstack/vue-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TablePagination from "./table/TablePagination.vue";
import TableStateBlock from "./table/TableStateBlock.vue";
import { adminTableFeatures } from "@/lib/table";

const props = withDefaults(
  defineProps<{
    data: TData[];
    columns: ColumnDef<typeof adminTableFeatures, any, unknown>[];
    loading: boolean;
    error: unknown;
    total?: number | null;
    pageIndex?: number;
    pageSize?: number;
    expanded?: Record<string, boolean>;
    expandable?: boolean;
    showPagination?: boolean;
    emptyTitle: string;
    emptyHint: string;
    loadingLabel?: string;
    errorTitle?: string;
  }>(),
  {
    total: null,
    pageIndex: 0,
    pageSize: 20,
    expanded: () => ({}),
    expandable: false,
    showPagination: true,
    loadingLabel: "Memuat data",
    errorTitle: "Data gagal dimuat",
  },
);

const emit = defineEmits<{
  retry: [];
  "update:pageIndex": [value: number];
  "update:expanded": [value: Record<string, boolean>];
}>();

const paginationState = computed(() => ({ pageIndex: props.pageIndex, pageSize: props.pageSize }));

const table = useTable<typeof adminTableFeatures, any>({
  features: adminTableFeatures,
  columns: props.columns,
  data: computed(() => props.data) as unknown as ComputedRef<ReadonlyArray<any>>,
  getRowId: (row: { id: string }) => row.id,
  manualPagination: true,
  rowCount: computed(() => props.total ?? props.data.length),
  state: computed(() => ({ pagination: paginationState.value })),
  onPaginationChange: (updater) => {
    const next = typeof updater === "function" ? updater(paginationState.value) : updater;
    emit("update:pageIndex", next.pageIndex);
  },
});

const rows = computed(() => table.getRowModel().rows);
const leafColumnCount = computed(() => table.getAllLeafColumns().length);

function alignOf(meta: unknown): "text-right" | undefined {
  const align = (meta as { align?: string } | undefined)?.align;
  return align === "right" ? "text-right" : undefined;
}

function isExpanded(rowId: string) {
  return !!props.expanded[rowId];
}

function toggleRow(rowId: string) {
  emit("update:expanded", { ...props.expanded, [rowId]: !props.expanded[rowId] });
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-border bg-card">
    <TableStateBlock
      v-if="props.loading || props.error || props.data.length === 0"
      :loading="props.loading"
      :error="props.error"
      :empty-title="props.emptyTitle"
      :empty-hint="props.emptyHint"
      :loading-label="props.loadingLabel"
      :error-title="props.errorTitle"
      @retry="emit('retry')"
    >
      <template #empty-action>
        <slot name="empty-action" />
      </template>
    </TableStateBlock>

    <template v-else>
      <div class="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow v-for="group in table.getHeaderGroups()" :key="group.id">
              <TableHead
                v-for="header in group.headers"
                :key="header.id"
                :class="alignOf(header.column.columnDef.meta)"
              >
                <FlexRender v-if="!header.isPlaceholder" :header="header" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-for="row in rows" :key="row.id">
              <TableRow>
                <TableCell
                  v-for="cell in row.getAllCells()"
                  :key="cell.id"
                  :class="alignOf(cell.column.columnDef.meta)"
                >
                  <button
                    v-if="cell.column.id === 'expander'"
                    type="button"
                    class="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    :aria-expanded="isExpanded(row.id)"
                    :aria-label="isExpanded(row.id) ? `Tutup detail ${row.id}` : `Buka detail ${row.id}`"
                    @click="toggleRow(row.id)"
                  >
                    <ChevronDown v-if="isExpanded(row.id)" :size="16" aria-hidden="true" />
                    <ChevronRight v-else :size="16" aria-hidden="true" />
                  </button>
                  <slot v-else name="cell" :row="row" :column-id="cell.column.id" :value="cell.getValue()">
                    {{ cell.getValue() }}
                  </slot>
                </TableCell>
              </TableRow>
              <TableRow v-if="props.expandable && isExpanded(row.id)" class="hover:bg-transparent">
                <TableCell :colspan="leafColumnCount" class="bg-muted/40 p-0">
                  <slot name="expanded" :row="row" />
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </div>

      <TablePagination
        v-if="props.showPagination"
        :page-index="props.pageIndex"
        :page-size="props.pageSize"
        :row-count="props.total ?? props.data.length"
        :disabled="props.loading"
        @update:page-index="emit('update:pageIndex', $event)"
      />
    </template>
  </div>
</template>
