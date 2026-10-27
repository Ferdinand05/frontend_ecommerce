<script setup lang="ts">
import { computed } from "vue";
import AdminDataTable from "@/components/admin/AdminDataTable.vue";
import { Badge } from "@/components/ui/badge";
import { useAdminUsersQuery } from "@/api/features/admin/users/user.queries";
import { column } from "@/lib/table-columns";
import { formatDateTime } from "@/lib/format";
import { humanizeStatus, statusVariant } from "@/lib/table";

const usersQuery = useAdminUsersQuery();
const users = computed(() => usersQuery.data.value ?? []);

const columns = [
  column("email", "Email"),
  column("name", "Nama"),
  column("role", "Peran"),
  column("status", "Status"),
  column("created_at", "Terdaftar"),
];
</script>

<template>
  <AdminDataTable
    :data="users"
    :columns="columns"
    :loading="usersQuery.isPending.value"
    :error="usersQuery.error.value"
    :show-pagination="false"
    empty-title="Belum ada pengguna"
    empty-hint="Pengguna baru akan muncul di sini setelah mendaftar lewat storefront."
    loading-label="Memuat pengguna"
    error-title="Pengguna gagal dimuat"
    @retry="usersQuery.refetch()"
  >
    <template #cell="{ columnId, row }">
      <template v-if="columnId === 'email'">
        <span class="text-sm font-medium">{{ row.original.email }}</span>
      </template>
      <template v-else-if="columnId === 'name'">
        <span class="text-sm">
          {{ [row.original.first_name, row.original.last_name].filter(Boolean).join(" ") || "-" }}
        </span>
      </template>
      <template v-else-if="columnId === 'role'">
        <Badge variant="outline">{{ row.original.role.name }}</Badge>
      </template>
      <template v-else-if="columnId === 'status'">
        <Badge :variant="statusVariant(row.original.status)">
          {{ humanizeStatus(row.original.status) }}
        </Badge>
      </template>
      <template v-else-if="columnId === 'created_at'">
        <span class="text-sm text-muted-foreground">{{ formatDateTime(row.original.created_at) }}</span>
      </template>
    </template>
  </AdminDataTable>
</template>
