<script setup lang="ts">
import { computed } from "vue";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminProductVariantsQuery } from "@/api/features/admin/products/product.queries";
import type { AdminProductVariant } from "@/api/features/admin/products/product.types";
import { formatNumber } from "@/lib/format";

const props = defineProps<{
  productId: string;
  productName: string;
}>();

const variantsQuery = useAdminProductVariantsQuery(() => props.productId);
const variants = computed(() => variantsQuery.data.value?.variants ?? []);

function availableOf(quantity: number, reserved: number) {
  return quantity - reserved;
}

function stockOf(variant: AdminProductVariant) {
  return {
    quantity: variant.inventory?.quantity ?? 0,
    reserved: variant.inventory?.reserved_quantity ?? 0,
  };
}
</script>

<template>
  <div class="px-3 py-2">
    <div v-if="variantsQuery.isPending.value" class="grid gap-1.5" aria-busy="true">
      <span class="sr-only">Memuat varian {{ props.productName }}</span>
      <div v-for="row in 2" :key="row" class="h-7 rounded-md bg-muted" />
    </div>

    <p v-else-if="variantsQuery.error.value" class="text-sm text-destructive">
      Gagal memuat varian {{ props.productName }}.
    </p>

    <p v-else-if="variants.length === 0" class="text-sm text-muted-foreground">
      {{ props.productName }} belum punya varian.
    </p>

    <div v-else class="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Varian</TableHead>
            <TableHead class="w-24 text-right">Stok</TableHead>
            <TableHead class="w-24 text-right">Dipesan</TableHead>
            <TableHead class="w-24 text-right">Tersedia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="variant in variants" :key="variant.id">
            <TableCell class="truncate text-sm">{{ variant.name }}</TableCell>
            <TableCell class="text-right text-sm tabular-nums">
              {{ formatNumber(stockOf(variant).quantity) }}
            </TableCell>
            <TableCell class="text-right text-sm tabular-nums text-muted-foreground">
              {{ formatNumber(stockOf(variant).reserved) }}
            </TableCell>
            <TableCell class="text-right text-sm font-medium tabular-nums">
              {{ formatNumber(availableOf(stockOf(variant).quantity, stockOf(variant).reserved)) }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
