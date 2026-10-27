<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AdminDataTable from "@/components/admin/AdminDataTable.vue";
import ProductVariantsPanel from "@/components/admin/ProductVariantsPanel.vue";
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
import { useAdminCategoriesQuery } from "@/api/features/admin/categories/category.queries";
import { useAdminProductsQuery } from "@/api/features/admin/products/product.queries";
import type { ProductSort } from "@/api/features/admin/products/product.types";
import { column, expanderColumn } from "@/lib/table-columns";
import { formatDateTime, formatIDRRange } from "@/lib/format";

const PAGE_SIZE = 20;

const pageIndex = ref(0);
const search = ref("");
const categoryId = ref("all");
const activeFilter = ref<"all" | "true" | "false">("all");
const sort = ref<ProductSort>("newest");
const expanded = ref<Record<string, boolean>>({});

const categoriesQuery = useAdminCategoriesQuery();
const categories = computed(() => categoriesQuery.data.value ?? []);

const params = computed(() => ({
  q: search.value.trim() || undefined,
  category_id: categoryId.value === "all" ? undefined : categoryId.value,
  is_active: activeFilter.value === "all" ? undefined : activeFilter.value === "true",
  sort: sort.value,
  page: pageIndex.value + 1,
  page_size: PAGE_SIZE,
}));

const productsQuery = useAdminProductsQuery(() => params.value);
const products = computed(() => productsQuery.data.value?.products ?? []);
const total = computed(() => productsQuery.data.value?.meta.total ?? 0);

watch([search, categoryId, activeFilter, sort], () => {
  pageIndex.value = 0;
});

const sortOptions: Array<{ value: ProductSort; label: string }> = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "name", label: "Nama A-Z" },
  { value: "name_desc", label: "Nama Z-A" },
  { value: "price_asc", label: "Harga termurah" },
  { value: "price_desc", label: "Harga termahal" },
];

const columns = [
  expanderColumn(),
  column("name", "Produk"),
  column("category", "Kategori"),
  column("variants", "Varian", "right"),
  column("price", "Harga varian", "right"),
  column("is_active", "Status"),
  column("updated_at", "Diperbarui"),
];

function pricesOf(variants: Array<{ price: string }>): Array<string | null | undefined> {
  return variants.map((variant) => variant.price);
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <TableFilterBar label="Filter produk">
      <div class="grid flex-1 gap-2 sm:min-w-56">
        <label class="text-xs font-semibold text-muted-foreground" for="product-search">Cari produk</label>
        <Input id="product-search" v-model="search" type="search" placeholder="Nama atau deskripsi produk" />
      </div>
      <div class="grid gap-2 sm:w-48">
        <span class="text-xs font-semibold text-muted-foreground">Kategori</span>
        <Select v-model="categoryId">
          <SelectTrigger>
            <SelectValue placeholder="Semua kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua kategori</SelectItem>
            <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="grid gap-2 sm:w-40">
        <span class="text-xs font-semibold text-muted-foreground">Status</span>
        <Select v-model="activeFilter">
          <SelectTrigger>
            <SelectValue placeholder="Semua status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua status</SelectItem>
            <SelectItem value="true">Aktif</SelectItem>
            <SelectItem value="false">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="grid gap-2 sm:w-52">
        <span class="text-xs font-semibold text-muted-foreground">Urutkan</span>
        <Select v-model="sort">
          <SelectTrigger>
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </TableFilterBar>

    <AdminDataTable
      :data="products"
      :columns="columns"
      :loading="productsQuery.isPending.value"
      :error="productsQuery.error.value"
      :total="total"
      :page-index="pageIndex"
      :page-size="PAGE_SIZE"
      :expanded="expanded"
      expandable
      empty-title="Belum ada produk yang cocok"
      empty-hint="Ubah kata kunci atau longgarkan filter untuk melihat produk lain."
      loading-label="Memuat produk"
      error-title="Produk gagal dimuat"
      @retry="productsQuery.refetch()"
      @update:page-index="pageIndex = $event"
      @update:expanded="expanded = $event"
    >
      <template #expanded="{ row }">
        <ProductVariantsPanel :product-id="row.original.id" :product-name="row.original.name" />
      </template>
      <template #cell="{ columnId, row }">
        <template v-if="columnId === 'name'">
          <div class="min-w-0">
            <p class="truncate font-medium">{{ row.original.name }}</p>
            <p class="truncate text-xs text-muted-foreground">{{ row.original.slug }}</p>
          </div>
        </template>
        <template v-else-if="columnId === 'category'">
          <span class="text-sm">{{ row.original.category.name }}</span>
        </template>
        <template v-else-if="columnId === 'variants'">
          <span class="text-sm tabular-nums">{{ row.original.variants.length }}</span>
        </template>
        <template v-else-if="columnId === 'price'">
          <span class="text-sm tabular-nums">{{ formatIDRRange(pricesOf(row.original.variants)) }}</span>
        </template>
        <template v-else-if="columnId === 'is_active'">
          <Badge :variant="row.original.is_active ? 'secondary' : 'outline'">
            {{ row.original.is_active ? "Aktif" : "Nonaktif" }}
          </Badge>
        </template>
        <template v-else-if="columnId === 'updated_at'">
          <span class="text-sm text-muted-foreground">{{ formatDateTime(row.original.updated_at) }}</span>
        </template>
      </template>
    </AdminDataTable>
  </div>
</template>
