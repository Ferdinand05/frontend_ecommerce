<script setup lang="ts">
import { computed, ref } from "vue";
import AdminDataTable from "@/components/admin/AdminDataTable.vue";
import AdminDialog from "@/components/admin/AdminDialog.vue";
import AdminFormDialog from "@/components/admin/AdminFormDialog.vue";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog.vue";
import RowActions from "@/components/admin/RowActions.vue";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAdminRolesQuery,
  useDeleteAdminRoleMutation,
  useUpdateAdminRoleMutation,
} from "@/api/features/admin/roles/role.queries";
import type { AdminRole } from "@/api/features/admin/roles/role.types";
import { column } from "@/lib/table-columns";
import { formatDateTime } from "@/lib/format";

const rolesQuery = useAdminRolesQuery();
const roles = computed(() => rolesQuery.data.value ?? []);

const columns = [
  column("name", "Peran"),
  column("created_at", "Dibuat"),
  column("actions", "Aksi"),
];

const detailOpen = ref(false);
const detailRole = ref<AdminRole | null>(null);

const formOpen = ref(false);
const editing = ref<AdminRole | null>(null);
const name = ref("");

const deleteOpen = ref(false);
const deleting = ref<AdminRole | null>(null);

const updateMutation = useUpdateAdminRoleMutation();
const deleteMutation = useDeleteAdminRoleMutation();

function openDetail(role: AdminRole) {
  detailRole.value = role;
  detailOpen.value = true;
}

function openEdit(role: AdminRole) {
  editing.value = role;
  name.value = role.name;
  updateMutation.reset();
  formOpen.value = true;
}

function openDelete(role: AdminRole) {
  deleting.value = role;
  deleteMutation.reset();
  deleteOpen.value = true;
}

async function submit() {
  if (!editing.value) return;
  await updateMutation.mutateAsync({ roleId: editing.value.id, name: name.value });
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
    <AdminDataTable
      :data="roles"
      :columns="columns"
      :loading="rolesQuery.isPending.value"
      :error="rolesQuery.error.value"
      :show-pagination="false"
      empty-title="Belum ada peran"
      empty-hint="Peran baru akan muncul di sini setelah dibuat."
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
        <template v-else-if="columnId === 'actions'">
          <RowActions
            :actions="[
              { label: 'Lihat detail', onSelect: () => openDetail(row.original) },
              { label: 'Ubah nama', onSelect: () => openEdit(row.original) },
              {
                label: 'Hapus peran',
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
      title="Detail peran"
      :description="detailRole?.name"
    >
      <dl v-if="detailRole" class="grid gap-3 text-sm">
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Nama</dt>
          <dd class="text-right">{{ detailRole.name }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Dibuat</dt>
          <dd class="text-right">{{ formatDateTime(detailRole.created_at) }}</dd>
        </div>
      </dl>
    </AdminDialog>

    <AdminFormDialog
      v-model:open="formOpen"
      title="Ubah nama peran"
      description="Peran yang masih dipakai pengguna tidak bisa dihapus."
      :pending="updateMutation.isPending.value"
      :error="updateMutation.error.value"
      @submit="submit"
    >
      <div class="grid gap-2">
        <Label for="role-name">Nama peran</Label>
        <Input id="role-name" v-model="name" required />
      </div>
    </AdminFormDialog>

    <ConfirmDeleteDialog
      v-model:open="deleteOpen"
      title="Hapus peran?"
      :description="
        deleting
          ? `Peran ${deleting.name} akan dihapus. Pengguna yang masih memakai peran ini akan gagal dihapus.`
          : ''
      "
      :pending="deleteMutation.isPending.value"
      :error="deleteMutation.error.value"
      @confirm="confirmDelete"
    />
  </div>
</template>
