<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Plus } from "@lucide/vue";
import AdminDataTable from "@/components/admin/AdminDataTable.vue";
import AdminDialog from "@/components/admin/AdminDialog.vue";
import AdminFormDialog from "@/components/admin/AdminFormDialog.vue";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog.vue";
import ImageUploader from "@/components/admin/ImageUploader.vue";
import ProductVariantsAccordion from "@/components/admin/ProductVariantsAccordion.vue";
import ProductVariantsPanel from "@/components/admin/ProductVariantsPanel.vue";
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
  useAdminCategoriesQuery,
} from "@/api/features/admin/categories/category.queries";
import {
  useAdminProductVariantsQuery,
  useAdminProductsQuery,
  useCreateAdminProductMutation,
  useDeleteAdminProductImageMutation,
  useDeleteAdminProductMutation,
  useUpdateAdminProductMutation,
  useUploadAdminProductImageMutation,
} from "@/api/features/admin/products/product.queries";
import type { AdminProduct } from "@/api/features/admin/products/product.types";
import type { ProductSort } from "@/api/features/admin/products/product.types";
import { column, expanderColumn } from "@/lib/table-columns";
import { formatDateTime, formatIDRRange } from "@/lib/format";

const PAGE_SIZE = 20;

const pageIndex = ref(0);
const expanded = ref<Record<string, boolean>>({});
const search = ref("");
const categoryId = ref("all");
const activeFilter = ref<"all" | "true" | "false">("all");
const sort = ref<ProductSort>("newest");

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
  column("actions", "Aksi"),
];

const detailOpen = ref(false);
const detailProduct = ref<AdminProduct | null>(null);

const formOpen = ref(false);
const editing = ref<AdminProduct | null>(null);
const form = ref({ category_id: "", name: "", description: "" });
const queuedImages = ref<File[]>([]);

const deleteOpen = ref(false);
const deleting = ref<AdminProduct | null>(null);

const createMutation = useCreateAdminProductMutation();
const updateMutation = useUpdateAdminProductMutation();
const deleteMutation = useDeleteAdminProductMutation();
const uploadMutation = useUploadAdminProductImageMutation();
const deleteImageMutation = useDeleteAdminProductImageMutation();

const formError = computed(() =>
  createMutation.isError.value
    ? createMutation.error.value
    : updateMutation.isError.value
      ? updateMutation.error.value
      : undefined,
);

const formPending = computed(
  () =>
    createMutation.isPending.value ||
    updateMutation.isPending.value ||
    uploadMutation.isPending.value,
);

function pricesOf(variants: Array<{ price: string }>): Array<string | null | undefined> {
  return variants.map((variant) => variant.price);
}

// Foto varian ikut tercampur di daftar foto produk dan tidak ditandai,
// jadi foto varian disaring lewat daftar varian agar tidak salah dihapus
// lewat endpoint foto produk.
const detailVariantsQuery = useAdminProductVariantsQuery(() => detailProduct.value?.id ?? null);
const editingVariantsQuery = useAdminProductVariantsQuery(() => editing.value?.id ?? null);

function variantImageIdsOf(
  variants: Array<{ images: Array<{ id: string }> }> | undefined,
) {
  const ids = new Set<string>();
  for (const variant of variants ?? []) {
    for (const image of variant.images) ids.add(image.id);
  }
  return ids;
}

function productImagesOf(product: AdminProduct | null) {
  if (!product) return [];
  const variantIds = new Set([
    ...variantImageIdsOf(detailVariantsQuery.data.value?.variants),
    ...variantImageIdsOf(editingVariantsQuery.data.value?.variants),
  ]);
  return product.images.filter((image) => !variantIds.has(image.id));
}

function openDetail(product: AdminProduct) {
  detailProduct.value = product;
  detailOpen.value = true;
}

function openCreate() {
  editing.value = null;
  createMutation.reset();
  updateMutation.reset();
  uploadMutation.reset();
  form.value = {
    category_id: categories.value[0]?.id ?? "",
    name: "",
    description: "",
  };
  queuedImages.value = [];
  formOpen.value = true;
}

function openEdit(product: AdminProduct) {
  editing.value = product;
  createMutation.reset();
  updateMutation.reset();
  uploadMutation.reset();
  form.value = {
    category_id: product.category_id,
    name: product.name,
    description: product.description ?? "",
  };
  queuedImages.value = [];
  formOpen.value = true;
}

function openDelete(product: AdminProduct) {
  deleting.value = product;
  deleteMutation.reset();
  deleteOpen.value = true;
}

async function submit() {
  const payload = {
    category_id: form.value.category_id,
    name: form.value.name,
    description: form.value.description || null,
  };

  if (editing.value) {
    await updateMutation.mutateAsync({ productId: editing.value.id, payload });

    for (const file of queuedImages.value) {
      await uploadMutation.mutateAsync({
        productId: editing.value.id,
        file,
        alt: editing.value.name,
      });
    }
  } else {
    const created = await createMutation.mutateAsync(payload);

    // Produk baru belum punya id saat form diisi, jadi fotonya diunggah
    // setelah server mengembalikan produk yang baru dibuat.
    for (const file of queuedImages.value) {
      await uploadMutation.mutateAsync({
        productId: created.id,
        file,
        alt: created.name,
      });
    }
  }

  formOpen.value = false;
}

async function removeProductImage(imageId: string) {
  if (!editing.value) return;
  await deleteImageMutation.mutateAsync({ productId: editing.value.id, imageId });
}

async function confirmDelete() {
  if (!deleting.value) return;
  await deleteMutation.mutateAsync(deleting.value.id);
  deleteOpen.value = false;
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <TableFilterBar label="Filter produk">
      <div class="grid flex-1 gap-2 sm:min-w-56">
        <label class="text-sm font-medium text-muted-foreground" for="product-search">Cari produk</label>
        <Input id="product-search" v-model="search" type="search" placeholder="Nama atau deskripsi produk" />
      </div>
      <div class="grid gap-2 sm:w-48">
        <span class="text-sm font-medium text-muted-foreground">Kategori</span>
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
        <span class="text-sm font-medium text-muted-foreground">Status</span>
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
        <span class="text-sm font-medium text-muted-foreground">Urutkan</span>
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
      <div class="flex items-end">
        <Button @click="openCreate">
          <Plus aria-hidden="true" />
          Tambah produk
        </Button>
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
        <ProductVariantsAccordion :product-id="row.original.id" :product-name="row.original.name" />
      </template>
      <template #cell="{ columnId, row }">
        <template v-if="columnId === 'name'">
          <div class="min-w-0">
            <p class="truncate font-medium">{{ row.original.name }}</p>
            <p class="truncate text-sm text-muted-foreground">{{ row.original.slug }}</p>
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
        <template v-else-if="columnId === 'actions'">
          <RowActions
            :actions="[
              { label: 'Lihat detail', onSelect: () => openDetail(row.original) },
              { label: 'Ubah produk', onSelect: () => openEdit(row.original) },
              {
                label: 'Hapus produk',
                variant: 'destructive',
                onSelect: () => openDelete(row.original),
              },
            ]"
          />
        </template>
      </template>
    </AdminDataTable>

    <AdminDialog
      v-model:open="detailOpen"
      title="Detail produk"
      :description="detailProduct?.name"
      wide
    >
      <div v-if="detailProduct" class="grid gap-5">
        <dl class="grid gap-3 text-sm sm:grid-cols-2">
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Kategori</dt>
            <dd class="text-right">{{ detailProduct.category.name }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Slug</dt>
            <dd class="text-right font-mono text-sm">{{ detailProduct.slug }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Status</dt>
            <dd class="text-right">
              <Badge :variant="detailProduct.is_active ? 'secondary' : 'outline'">
                {{ detailProduct.is_active ? "Aktif" : "Nonaktif" }}
              </Badge>
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-muted-foreground">Diperbarui</dt>
            <dd class="text-right">{{ formatDateTime(detailProduct.updated_at) }}</dd>
          </div>
        </dl>

        <p v-if="detailProduct.description" class="text-sm text-muted-foreground">
          {{ detailProduct.description }}
        </p>

        <div v-if="productImagesOf(detailProduct).length > 0" class="grid gap-2">
          <h3 class="mb-2 text-sm font-medium text-muted-foreground">Foto produk</h3>
          <div class="flex flex-wrap gap-2">
            <img
              v-for="image in productImagesOf(detailProduct)"
              :key="image.id"
              :src="image.url"
              :alt="image.alt || detailProduct.name"
              class="size-24 rounded-md border border-border object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div class="grid gap-2">
          <h3 class="text-sm font-medium text-muted-foreground">Varian</h3>
          <ProductVariantsPanel :product-id="detailProduct.id" :product-name="detailProduct.name" />
        </div>
      </div>
    </AdminDialog>

    <AdminFormDialog
      v-model:open="formOpen"
      :title="editing ? 'Ubah produk' : 'Tambah produk'"
      :description="editing ? 'Slug mengikuti nama produk.' : 'Slug dibuat otomatis dari nama produk.'"
      :pending="formPending"
      :error="formError"
      @submit="submit"
    >
      <div class="grid gap-2">
        <Label for="product-form-category">Kategori</Label>
        <Select v-model="form.category_id">
          <SelectTrigger id="product-form-category">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="grid gap-2">
        <Label for="product-form-name">Nama produk</Label>
        <Input id="product-form-name" v-model="form.name" required maxlength="150" />
      </div>
      <div class="grid gap-2">
        <Label for="product-form-description">Deskripsi</Label>
        <Textarea id="product-form-description" v-model="form.description" rows="4" />
      </div>
      <ImageUploader
        :images="productImagesOf(editing)"
        :queued="queuedImages"
        :alt="editing?.name ?? 'produk'"
        :pending="uploadMutation.isPending.value"
        @select="queuedImages = [...queuedImages, ...$event]"
        @unqueue="queuedImages.splice($event, 1)"
        @remove="removeProductImage"
      />
    </AdminFormDialog>

    <ConfirmDeleteDialog
      v-model:open="deleteOpen"
      title="Hapus produk?"
      :description="
        deleting
          ? `Produk ${deleting.name} beserta variannya akan dihapus.`
          : ''
      "
      :pending="deleteMutation.isPending.value"
      :error="deleteMutation.error.value"
      @confirm="confirmDelete"
    />
  </div>
</template>
