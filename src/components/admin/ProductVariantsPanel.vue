<script setup lang="ts">
import { computed, ref } from "vue";
import { Plus } from "@lucide/vue";
import AdminFormDialog from "@/components/admin/AdminFormDialog.vue";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog.vue";
import ImageUploader from "@/components/admin/ImageUploader.vue";
import RowActions from "@/components/admin/RowActions.vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useAdminProductVariantsQuery,
  useCreateAdminProductVariantMutation,
  useDeleteAdminProductVariantMutation,
  useDeleteAdminVariantImageMutation,
  useUpdateAdminProductVariantMutation,
  useUploadAdminVariantImageMutation,
} from "@/api/features/admin/products/product.queries";
import type { AdminProductVariant } from "@/api/features/admin/products/product.types";
import { formatIDR, formatNumber } from "@/lib/format";

const props = defineProps<{
  productId: string;
  productName: string;
}>();

const variantsQuery = useAdminProductVariantsQuery(() => props.productId);
const variants = computed(() => variantsQuery.data.value?.variants ?? []);

const formOpen = ref(false);
const editing = ref<AdminProductVariant | null>(null);
const form = ref({ sku: "", name: "", price: "", weight_grams: 100 });
const queuedImages = ref<File[]>([]);

const deleteOpen = ref(false);
const deleting = ref<AdminProductVariant | null>(null);

const createMutation = useCreateAdminProductVariantMutation();
const updateMutation = useUpdateAdminProductVariantMutation();
const deleteMutation = useDeleteAdminProductVariantMutation();
const uploadMutation = useUploadAdminVariantImageMutation();
const deleteImageMutation = useDeleteAdminVariantImageMutation();

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

function openCreate() {
  editing.value = null;
  createMutation.reset();
  updateMutation.reset();
  uploadMutation.reset();
  form.value = { sku: "", name: "", price: "", weight_grams: 100 };
  queuedImages.value = [];
  formOpen.value = true;
}

function openEdit(variant: AdminProductVariant) {
  editing.value = variant;
  createMutation.reset();
  updateMutation.reset();
  uploadMutation.reset();
  form.value = {
    sku: variant.sku,
    name: variant.name,
    price: variant.price,
    weight_grams: variant.weight_grams,
  };
  queuedImages.value = [];
  formOpen.value = true;
}

function openDelete(variant: AdminProductVariant) {
  deleting.value = variant;
  deleteMutation.reset();
  deleteOpen.value = true;
}

async function submit() {
  const payload = {
    sku: form.value.sku.trim(),
    name: form.value.name.trim(),
    price: form.value.price.trim(),
    weight_grams: Number(form.value.weight_grams),
  };

  if (editing.value) {
    await updateMutation.mutateAsync({
      productId: props.productId,
      variantId: editing.value.id,
      payload,
    });

    for (const file of queuedImages.value) {
      await uploadMutation.mutateAsync({
        productId: props.productId,
        variantId: editing.value.id,
        file,
        alt: editing.value.name,
      });
    }
  } else {
    const created = await createMutation.mutateAsync({
      productId: props.productId,
      payload,
    });

    // Varian baru belum punya id saat form diisi, jadi fotonya diunggah
    // setelah server mengembalikan varian yang baru dibuat.
    for (const file of queuedImages.value) {
      await uploadMutation.mutateAsync({
        productId: props.productId,
        variantId: created.id,
        file,
        alt: created.name,
      });
    }
  }

  formOpen.value = false;
}

async function confirmDelete() {
  if (!deleting.value) return;
  await deleteMutation.mutateAsync({
    productId: props.productId,
    variantId: deleting.value.id,
  });
  deleteOpen.value = false;
}

async function removeVariantImage(imageId: string) {
  if (!editing.value) return;
  await deleteImageMutation.mutateAsync({
    productId: props.productId,
    variantId: editing.value.id,
    imageId,
  });
}
</script>

<template>
  <div class="grid gap-3">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-muted-foreground">
        {{ variants.length }} varian pada {{ props.productName }}.
      </p>
      <Button size="sm" @click="openCreate">
        <Plus aria-hidden="true" />
        Tambah varian
      </Button>
    </div>

    <div v-if="variantsQuery.isPending.value" class="grid gap-2" aria-busy="true">
      <span class="sr-only">Memuat varian</span>
      <div v-for="row in 3" :key="row" class="h-8 rounded-md bg-muted" />
    </div>

    <p v-else-if="variantsQuery.error.value" class="text-sm text-destructive">
      Gagal memuat varian produk ini.
    </p>

    <p v-else-if="variants.length === 0" class="text-sm text-muted-foreground">
      Produk ini belum punya varian.
    </p>

    <div v-else class="overflow-x-auto rounded-md border border-border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-16">Foto</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Varian</TableHead>
            <TableHead class="w-28 text-right">Harga</TableHead>
            <TableHead class="w-24 text-right">Stok</TableHead>
            <TableHead class="w-28">Status</TableHead>
            <TableHead class="w-16">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="variant in variants" :key="variant.id">
            <TableCell>
              <img
                v-if="variant.images[0]"
                :src="variant.images[0].url"
                :alt="variant.images[0].alt || variant.name"
                class="size-10 rounded-md border border-border object-cover"
                loading="lazy"
              />
              <span v-else class="text-sm text-muted-foreground">-</span>
            </TableCell>
            <TableCell class="font-mono text-sm whitespace-nowrap">{{ variant.sku }}</TableCell>
            <TableCell class="truncate text-sm">{{ variant.name }}</TableCell>
            <TableCell class="text-right text-sm tabular-nums whitespace-nowrap">
              {{ formatIDR(variant.price) }}
            </TableCell>
            <TableCell class="text-right text-sm tabular-nums">
              {{ formatNumber(variant.inventory?.quantity ?? 0) }}
            </TableCell>
            <TableCell>
              <Badge :variant="variant.is_active ? 'secondary' : 'outline'">
                {{ variant.is_active ? "Aktif" : "Nonaktif" }}
              </Badge>
            </TableCell>
            <TableCell>
              <RowActions
                :actions="[
                  { label: 'Ubah varian', onSelect: () => openEdit(variant) },
                  {
                    label: 'Hapus varian',
                    variant: 'destructive',
                    onSelect: () => openDelete(variant),
                  },
                ]"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <AdminFormDialog
      v-model:open="formOpen"
      :title="editing ? 'Ubah varian' : 'Tambah varian'"
      :description="`Varian untuk ${props.productName}.`"
      :pending="formPending"
      :error="formError"
      @submit="submit"
    >
      <div class="grid gap-2">
        <Label for="variant-form-sku">SKU</Label>
        <Input id="variant-form-sku" v-model="form.sku" required maxlength="100" />
      </div>
      <div class="grid gap-2">
        <Label for="variant-form-name">Nama varian</Label>
        <Input id="variant-form-name" v-model="form.name" required maxlength="150" />
      </div>
      <div class="grid gap-2">
        <Label for="variant-form-price">Harga</Label>
        <Input id="variant-form-price" v-model="form.price" required inputmode="numeric" />
      </div>
      <div class="grid gap-2">
        <Label for="variant-form-weight">Berat (gram)</Label>
        <Input
          id="variant-form-weight"
          v-model.number="form.weight_grams"
          type="number"
          min="1"
          max="100000"
          required
        />
      </div>
      <ImageUploader
        :images="editing?.images ?? []"
        :queued="queuedImages"
        :alt="editing?.name ?? 'varian'"
        :pending="uploadMutation.isPending.value"
        @select="queuedImages = [...queuedImages, ...$event]"
        @unqueue="queuedImages.splice($event, 1)"
        @remove="removeVariantImage"
      />
    </AdminFormDialog>

    <ConfirmDeleteDialog
      v-model:open="deleteOpen"
      title="Hapus varian?"
      :description="
        deleting
          ? `Varian ${deleting.sku} akan dihapus beserta foto dan riwayat stoknya.`
          : ''
      "
      :pending="deleteMutation.isPending.value"
      :error="deleteMutation.error.value"
      @confirm="confirmDelete"
    />
  </div>
</template>
