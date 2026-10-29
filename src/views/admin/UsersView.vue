<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Plus } from "@lucide/vue";
import AdminDataTable from "@/components/admin/AdminDataTable.vue";
import AdminDialog from "@/components/admin/AdminDialog.vue";
import AdminFormDialog from "@/components/admin/AdminFormDialog.vue";
import RowActions from "@/components/admin/RowActions.vue";
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
import {
  useAdminRolesQuery,
} from "@/api/features/admin/roles/role.queries";
import {
  useAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserProfileMutation,
  useUpdateAdminUserRoleMutation,
  useUpdateAdminUserStatusMutation,
} from "@/api/features/admin/users/user.queries";
import type { AdminUser } from "@/api/features/admin/users/user.types";
import { column } from "@/lib/table-columns";
import { formatDateTime } from "@/lib/format";
import { humanizeStatus, statusVariant } from "@/lib/table";

const usersQuery = useAdminUsersQuery();
const rolesQuery = useAdminRolesQuery();
const users = computed(() => usersQuery.data.value ?? []);
const roles = computed(() => rolesQuery.data.value ?? []);

const columns = [
  column("email", "Email"),
  column("name", "Nama"),
  column("role", "Peran"),
  column("status", "Status"),
  column("created_at", "Terdaftar"),
  column("actions", "Aksi"),
];

const detailOpen = ref(false);
const detailUser = ref<AdminUser | null>(null);

const formOpen = ref(false);
const editing = ref<AdminUser | null>(null);
const form = ref({
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
  role_id: "",
  status: "active",
});

const createMutation = useCreateAdminUserMutation();
const profileMutation = useUpdateAdminUserProfileMutation();
const roleMutation = useUpdateAdminUserRoleMutation();
const statusMutation = useUpdateAdminUserStatusMutation();

const formError = computed(() => {
  if (createMutation.isError.value) return createMutation.error.value;
  if (profileMutation.isError.value) return profileMutation.error.value;
  if (roleMutation.isError.value) return roleMutation.error.value;
  if (statusMutation.isError.value) return statusMutation.error.value;
  return undefined;
});

const formPending = computed(
  () =>
    createMutation.isPending.value ||
    profileMutation.isPending.value ||
    roleMutation.isPending.value ||
    statusMutation.isPending.value,
);

function resetForm() {
  createMutation.reset();
  profileMutation.reset();
  roleMutation.reset();
  statusMutation.reset();
  form.value = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    role_id: roles.value[0]?.id ?? "",
    status: "active",
  };
}

function openCreate() {
  editing.value = null;
  resetForm();
  formOpen.value = true;
}

function openEdit(user: AdminUser) {
  editing.value = user;
  resetForm();
  form.value = {
    email: user.email,
    password: "",
    first_name: user.first_name ?? "",
    last_name: user.last_name ?? "",
    phone: user.phone ?? "",
    role_id: user.role?.id ?? "",
    status: user.status,
  };
  formOpen.value = true;
}

function openDetail(user: AdminUser) {
  detailUser.value = user;
  detailOpen.value = true;
}

async function submit() {
  if (editing.value) {
    await profileMutation.mutateAsync({
      userId: editing.value.id,
      payload: {
        first_name: form.value.first_name,
        last_name: form.value.last_name || null,
        phone: form.value.phone || null,
      },
    });

    if (form.value.role_id && form.value.role_id !== editing.value.role?.id) {
      await roleMutation.mutateAsync({ userId: editing.value.id, roleId: form.value.role_id });
    }

    if (form.value.status !== editing.value.status) {
      await statusMutation.mutateAsync({
        userId: editing.value.id,
        status: form.value.status as "active" | "blocked",
      });
    }

    formOpen.value = false;
    return;
  }

  await createMutation.mutateAsync({
    email: form.value.email,
    password: form.value.password,
    first_name: form.value.first_name,
    last_name: form.value.last_name || null,
    phone: form.value.phone || null,
    role_id: form.value.role_id,
  });

  formOpen.value = false;
}

watch(
  () => roles.value.length,
  (count) => {
    if (count > 0 && !form.value.role_id) form.value.role_id = roles.value[0]?.id ?? "";
  },
);
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-muted-foreground">
        {{ users.length }} pengguna terdaftar.
      </p>
      <Button @click="openCreate">
        <Plus aria-hidden="true" />
        Tambah pengguna
      </Button>
    </div>

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
          <Badge variant="outline">{{ row.original.role?.name ?? "-" }}</Badge>
        </template>
        <template v-else-if="columnId === 'status'">
          <Badge :variant="statusVariant(row.original.status)">
            {{ humanizeStatus(row.original.status) }}
          </Badge>
        </template>
        <template v-else-if="columnId === 'created_at'">
          <span class="text-sm text-muted-foreground">{{ formatDateTime(row.original.created_at) }}</span>
        </template>
        <template v-else-if="columnId === 'actions'">
          <RowActions
            :actions="[
              { label: 'Lihat detail', onSelect: () => openDetail(row.original) },
              { label: 'Ubah pengguna', onSelect: () => openEdit(row.original) },
            ]"
          />
        </template>
      </template>
    </AdminDataTable>

    <AdminDialog
      v-model:open="detailOpen"
      title="Detail pengguna"
      :description="detailUser?.email"
    >
      <dl v-if="detailUser" class="grid gap-3 text-sm">
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Nama</dt>
          <dd class="text-right">
            {{
              [detailUser.first_name, detailUser.last_name].filter(Boolean).join(" ") || "-"
            }}
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Telepon</dt>
          <dd class="text-right">{{ detailUser.phone || "-" }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Peran</dt>
          <dd class="text-right">{{ detailUser.role?.name ?? "-" }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Status</dt>
          <dd class="text-right">
            <Badge :variant="statusVariant(detailUser.status)">
              {{ humanizeStatus(detailUser.status) }}
            </Badge>
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Terdaftar</dt>
          <dd class="text-right">{{ formatDateTime(detailUser.created_at) }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Terakhir diubah</dt>
          <dd class="text-right">{{ formatDateTime(detailUser.updated_at) }}</dd>
        </div>
      </dl>
    </AdminDialog>

    <AdminFormDialog
      v-model:open="formOpen"
      :title="editing ? 'Ubah pengguna' : 'Tambah pengguna'"
      :description="
        editing
          ? 'Perubahan peran butuh login ulang sebelum berlaku.'
          : 'Pengguna baru bisa langsung masuk dengan email dan kata sandi ini.'
      "
      :pending="formPending"
      :error="formError"
      @submit="submit"
    >
      <template v-if="!editing">
        <div class="grid gap-2">
          <Label for="user-email">Email</Label>
          <Input id="user-email" v-model="form.email" type="email" required />
        </div>
        <div class="grid gap-2">
          <Label for="user-password">Kata sandi</Label>
          <Input id="user-password" v-model="form.password" type="password" required minlength="8" />
        </div>
      </template>

      <div class="grid gap-2">
        <Label for="user-first-name">Nama depan</Label>
        <Input id="user-first-name" v-model="form.first_name" required />
      </div>
      <div class="grid gap-2">
        <Label for="user-last-name">Nama belakang</Label>
        <Input id="user-last-name" v-model="form.last_name" />
      </div>
      <div class="grid gap-2">
        <Label for="user-phone">Telepon</Label>
        <Input id="user-phone" v-model="form.phone" type="tel" />
      </div>
      <div class="grid gap-2">
        <Label for="user-role">Peran</Label>
        <Select v-model="form.role_id">
          <SelectTrigger id="user-role">
            <SelectValue placeholder="Pilih peran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div v-if="editing" class="grid gap-2">
        <Label for="user-status">Status</Label>
        <Select v-model="form.status">
          <SelectTrigger id="user-status">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="blocked">Diblokir</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </AdminFormDialog>
  </div>
</template>
