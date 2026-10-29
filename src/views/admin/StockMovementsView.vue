<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Plus } from "@lucide/vue";
import AdminDataTable from "@/components/admin/AdminDataTable.vue";
import AdminDialog from "@/components/admin/AdminDialog.vue";
import AdminFormDialog from "@/components/admin/AdminFormDialog.vue";
import RowActions from "@/components/admin/RowActions.vue";
import TableFilterBar from "@/components/admin/table/TableFilterBar.vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminProductVariantsQuery } from "@/api/features/admin/products/product.queries";
import { useAdminProductsQuery } from "@/api/features/admin/products/product.queries";
import {
  useAdminStockMovementsQuery,
  useCreateStockMovementMutation,
} from "@/api/features/admin/stock-movements/stock-movement.queries";
import type { AdminStockMovement } from "@/api/features/admin/stock-movements/stock-movement.types";
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
  column("actions", "Aksi"),
];

const detailOpen = ref(false);
const detailMovement = ref<AdminStockMovement | null>(null);

const formOpen = ref(false);
const form = ref({ product_id: "", variant_id: "", type: "RESTOCK", quantity: 1, note: "" });

const productsQuery = useAdminProductsQuery(() => ({ page: 1, page_size: 100 }));
const products = computed(() => productsQuery.data.value?.products ?? []);

const variantsQuery = useAdminProductVariantsQuery(() =>
  form.value.product_id || null,
);
const variants = computed(() => variantsQuery.data.value?.variants ?? []);

const createMutation = useCreateStockMovementMutation();

function openDetail(movement: AdminStockMovement) {
  detailMovement.value = movement;
  detailOpen.value = true;
}

function openCreate() {
  createMutation.reset();
  form.value = {
    product_id: products.value[0]?.id ?? "",
    variant_id: "",
    type: "RESTOCK",
    quantity: 1,
    note: "",
  };
  formOpen.value = true;
}

watch(
  () => form.value.product_id,
  () => {
    form.value.variant_id = "";
  },
);

async function submit() {
  if (!form.value.product_id || !form.value.variant_id) return;
  await createMutation.mutateAsync({
    productId: form.value.product_id,
    variantId: form.value.variant_id,
    payload: {
      type: form.value.type as "RESTOCK",
      quantity: form.value.quantity,
      note: form.value.note || undefined,
    },
  });
  formOpen.value = false;
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-muted-foreground">
        {{ total }} perpindahan stok tercatat.
      </p>
      <Button @click="openCreate">
        <Plus aria-hidden="true" />
        Catat stok
      </Button>
    </div>

    <TableFilterBar label="Filter perpindahan stok">
      <div class="grid gap-2 sm:w-52">
        <span class="text-sm font-medium text-muted-foreground">Jenis</span>
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
          <span class="font-mono text-sm">{{ row.original.sku }}</span>
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
        <template v-else-if="columnId === 'actions'">
          <RowActions
            :actions="[{ label: 'Lihat detail', onSelect: () => openDetail(row.original) }]"
          />
        </template>
      </template>
    </AdminDataTable>

    <AdminDialog
      v-model:open="detailOpen"
      title="Detail perpindahan stok"
      :description="detailMovement?.sku"
    >
      <dl v-if="detailMovement" class="grid gap-3 text-sm">
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Jenis</dt>
          <dd class="text-right">
            <Badge :variant="movementTypeVariant(detailMovement.type)">
              {{ humanizeStatus(detailMovement.type) }}
            </Badge>
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">SKU</dt>
          <dd class="text-right font-mono text-sm">{{ detailMovement.sku }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Varian</dt>
          <dd class="text-right">{{ detailMovement.variant_name }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Jumlah</dt>
          <dd class="text-right font-medium tabular-nums">
            {{ formatNumber(detailMovement.quantity) }}
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Catatan</dt>
          <dd class="text-right">{{ detailMovement.note || "-" }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Referensi</dt>
          <dd class="text-right">
            {{ detailMovement.reference_type || "-" }}
            <span v-if="detailMovement.reference_id" class="font-mono text-sm text-muted-foreground">
              {{ detailMovement.reference_id }}
            </span>
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Waktu</dt>
          <dd class="text-right">{{ formatDateTime(detailMovement.created_at) }}</dd>
        </div>
      </dl>
    </AdminDialog>

    <AdminFormDialog
      v-model:open="formOpen"
      title="Catat perpindahan stok"
      description="Stok varian berubah saat perpindahan stok dicatat."
      submit-label="Catat"
      :pending="createMutation.isPending.value"
      :error="createMutation.error.value"
      @submit="submit"
    >
      <div class="grid gap-2">
        <Label for="movement-product">Produk</Label>
        <Select v-model="form.product_id">
          <SelectTrigger id="movement-product">
            <SelectValue placeholder="Pilih produk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="grid gap-2">
        <Label for="movement-variant">Varian</Label>
        <Select v-model="form.variant_id">
          <SelectTrigger id="movement-variant">
            <SelectValue placeholder="Pilih varian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="variant in variants" :key="variant.id" :value="variant.id">
              {{ variant.sku }} · {{ variant.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="grid gap-2">
        <Label for="movement-type">Jenis</Label>
        <Select v-model="form.type">
          <SelectTrigger id="movement-type">
            <SelectValue placeholder="Pilih jenis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="option in typeOptions.filter((item) => item !== 'RESERVE')"
              :key="option"
              :value="option"
            >
              {{ humanizeStatus(option) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="grid gap-2">
        <Label for="movement-quantity">Jumlah</Label>
        <Input id="movement-quantity" v-model.number="form.quantity" type="number" required />
      </div>
      <div class="grid gap-2">
        <Label for="movement-note">Catatan</Label>
        <Input id="movement-note" v-model="form.note" />
      </div>
    </AdminFormDialog>
  </div>
</template>
