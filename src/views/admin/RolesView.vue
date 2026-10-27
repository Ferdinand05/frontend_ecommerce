<script setup lang="ts">
import { computed } from "vue";
import AdminDataTable from "@/components/admin/AdminDataTable.vue";
import { Badge } from "@/components/ui/badge";
import { useAdminRolesQuery } from "@/api/features/admin/roles/role.queries";
import { column } from "@/lib/table-columns";
import { formatDateTime } from "@/lib/format";

const rolesQuery = useAdminRolesQuery();
const roles = computed(() => rolesQuery.data.value ?? []);

const columns = [column("name", "Peran"), column("created_at", "Dibuat")];
</script>

<template>
  <AdminDataTable
    :data="roles"
    :columns="columns"
    :loading="rolesQuery.isPending.value"
    :error="rolesQuery.error.value"
    :show-pagination="false"
    empty-title="Belum ada peran"
    empty-hint="Peran baru akan muncul di sini setelah dibuat dari panel admin."
    loading-label="Memuat peran"
    error-title="Peran gagal dimuat"
    @retry="rolesQuery.refetch()"
  >
    <template #cell="{ columnId, row }">
      <template v-if="columnId === 'name'">
        <Badge variant="outline">{{ row.original.name }}</Badge>
      </template>
      <template v-else-if="columnId === 'created_at'">
        <span class="text-sm text-muted-foreground">{{ formatDateTime(row.original.created_at) }}</span>
      </template>
    </template>
  </AdminDataTable>
</template>
