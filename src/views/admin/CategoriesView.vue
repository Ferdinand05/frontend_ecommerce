<script setup lang="ts">
import { computed } from "vue";
import AdminDataTable from "@/components/admin/AdminDataTable.vue";
import { useAdminCategoriesQuery } from "@/api/features/admin/categories/category.queries";
import { column } from "@/lib/table-columns";
import { formatDateTime } from "@/lib/format";

const categoriesQuery = useAdminCategoriesQuery();
const categories = computed(() => categoriesQuery.data.value ?? []);

const columns = [
  column("name", "Kategori"),
  column("slug", "Slug"),
  column("description", "Deskripsi"),
  column("created_at", "Dibuat"),
];
</script>

<template>
  <AdminDataTable
    :data="categories"
    :columns="columns"
    :loading="categoriesQuery.isPending.value"
    :error="categoriesQuery.error.value"
    :show-pagination="false"
    empty-title="Belum ada kategori"
    empty-hint="Kategori baru akan muncul di sini setelah dibuat dari panel admin."
    loading-label="Memuat kategori"
    error-title="Kategori gagal dimuat"
    @retry="categoriesQuery.refetch()"
  >
    <template #cell="{ columnId, row }">
      <template v-if="columnId === 'name'">
        <span class="text-sm font-medium">{{ row.original.name }}</span>
      </template>
      <template v-else-if="columnId === 'slug'">
        <span class="font-mono text-xs">{{ row.original.slug }}</span>
      </template>
      <template v-else-if="columnId === 'description'">
        <span class="text-sm text-muted-foreground">{{ row.original.description || "-" }}</span>
      </template>
      <template v-else-if="columnId === 'created_at'">
        <span class="text-sm text-muted-foreground">{{ formatDateTime(row.original.created_at) }}</span>
      </template>
    </template>
  </AdminDataTable>
</template>
