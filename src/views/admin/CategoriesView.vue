<script setup lang="ts">
import { computed, ref } from "vue";
import { Plus } from "@lucide/vue";
import AdminDataTable from "@/components/admin/AdminDataTable.vue";
import AdminDialog from "@/components/admin/AdminDialog.vue";
import AdminFormDialog from "@/components/admin/AdminFormDialog.vue";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog.vue";
import RowActions from "@/components/admin/RowActions.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminCategoriesQuery,
  useCreateAdminCategoryMutation,
  useDeleteAdminCategoryMutation,
  useUpdateAdminCategoryMutation,
} from "@/api/features/admin/categories/category.queries";
import type { AdminCategory } from "@/api/features/admin/categories/category.types";
import { column } from "@/lib/table-columns";
import { formatDateTime } from "@/lib/format";

const categoriesQuery = useAdminCategoriesQuery();
const categories = computed(() => categoriesQuery.data.value ?? []);

const columns = [
  column("name", "Kategori"),
  column("slug", "Slug"),
  column("description", "Deskripsi"),
  column("created_at", "Dibuat"),
  column("actions", "Aksi"),
];

const detailOpen = ref(false);
const detailCategory = ref<AdminCategory | null>(null);

const formOpen = ref(false);
const editing = ref<AdminCategory | null>(null);
const form = ref({ name: "", description: "" });

const deleteOpen = ref(false);
const deleting = ref<AdminCategory | null>(null);

const createMutation = useCreateAdminCategoryMutation();
const updateMutation = useUpdateAdminCategoryMutation();
const deleteMutation = useDeleteAdminCategoryMutation();

const formError = computed(() =>
  createMutation.isError.value
    ? createMutation.error.value
    : updateMutation.isError.value
      ? updateMutation.error.value
      : undefined,
);

const formPending = computed(
  () => createMutation.isPending.value || updateMutation.isPending.value,
);

function openDetail(category: AdminCategory) {
  detailCategory.value = category;
  detailOpen.value = true;
}

function openCreate() {
  editing.value = null;
  createMutation.reset();
  updateMutation.reset();
  form.value = { name: "", description: "" };
  formOpen.value = true;
}

function openEdit(category: AdminCategory) {
  editing.value = category;
  createMutation.reset();
  updateMutation.reset();
  form.value = { name: category.name, description: category.description ?? "" };
  formOpen.value = true;
}

function openDelete(category: AdminCategory) {
  deleting.value = category;
  deleteMutation.reset();
  deleteOpen.value = true;
}

async function submit() {
  const payload = { name: form.value.name, description: form.value.description || null };

  if (editing.value) {
    await updateMutation.mutateAsync({ categoryId: editing.value.id, payload });
  } else {
    await createMutation.mutateAsync(payload);
  }

  formOpen.value = false;
}

async function confirmDelete() {
  if (!deleting.value) return;
  await deleteMutation.mutateAsync(deleting.value.id);
  deleteOpen.value = false;
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-muted-foreground">{{ categories.length }} kategori tersedia.</p>
      <Button @click="openCreate">
        <Plus aria-hidden="true" />
        Tambah kategori
      </Button>
    </div>

    <AdminDataTable
      :data="categories"
      :columns="columns"
      :loading="categoriesQuery.isPending.value"
      :error="categoriesQuery.error.value"
      :show-pagination="false"
      empty-title="Belum ada kategori"
      empty-hint="Kategori baru akan muncul di sini setelah dibuat."
      loading-label="Memuat kategori"
      error-title="Kategori gagal dimuat"
      @retry="categoriesQuery.refetch()"
    >
      <template #cell="{ columnId, row }">
        <template v-if="columnId === 'name'">
          <span class="text-sm font-medium">{{ row.original.name }}</span>
        </template>
        <template v-else-if="columnId === 'slug'">
          <span class="font-mono text-sm">{{ row.original.slug }}</span>
        </template>
        <template v-else-if="columnId === 'description'">
          <span class="text-sm text-muted-foreground">{{ row.original.description || "-" }}</span>
        </template>
        <template v-else-if="columnId === 'created_at'">
          <span class="text-sm text-muted-foreground">{{ formatDateTime(row.original.created_at) }}</span>
        </template>
        <template v-else-if="columnId === 'actions'">
          <RowActions
            :actions="[
              { label: 'Lihat detail', onSelect: () => openDetail(row.original) },
              { label: 'Ubah kategori', onSelect: () => openEdit(row.original) },
              {
                label: 'Hapus kategori',
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
      title="Detail kategori"
      :description="detailCategory?.name"
    >
      <dl v-if="detailCategory" class="grid gap-3 text-sm">
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Nama</dt>
          <dd class="text-right">{{ detailCategory.name }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Slug</dt>
          <dd class="text-right font-mono text-sm">{{ detailCategory.slug }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Deskripsi</dt>
          <dd class="text-right">{{ detailCategory.description || "-" }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Dibuat</dt>
          <dd class="text-right">{{ formatDateTime(detailCategory.created_at) }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Terakhir diubah</dt>
          <dd class="text-right">{{ formatDateTime(detailCategory.updated_at) }}</dd>
        </div>
      </dl>
    </AdminDialog>

    <AdminFormDialog
      v-model:open="formOpen"
      :title="editing ? 'Ubah kategori' : 'Tambah kategori'"
      :description="editing ? 'Slug mengikuti nama kategori.' : 'Slug dibuat otomatis dari nama.'"
      :pending="formPending"
      :error="formError"
      @submit="submit"
    >
      <div class="grid gap-2">
        <Label for="category-name">Nama kategori</Label>
        <Input id="category-name" v-model="form.name" required maxlength="100" />
      </div>
      <div class="grid gap-2">
        <Label for="category-description">Deskripsi</Label>
        <Textarea id="category-description" v-model="form.description" rows="3" />
      </div>
    </AdminFormDialog>

    <ConfirmDeleteDialog
      v-model:open="deleteOpen"
      title="Hapus kategori?"
      :description="
        deleting
          ? `Kategori ${deleting.name} akan dihapus. Kategori yang masih dipakai produk tidak bisa dihapus.`
          : ''
      "
      :pending="deleteMutation.isPending.value"
      :error="deleteMutation.error.value"
      @confirm="confirmDelete"
    />
  </div>
</template>
