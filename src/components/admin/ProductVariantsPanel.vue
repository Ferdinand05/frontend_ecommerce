<script setup lang="ts">
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminProductVariantsQuery } from "@/api/features/admin/products/product.queries";
import { formatIDR, formatNumber } from "@/lib/format";

const props = defineProps<{
  productId: string;
  productName: string;
}>();

const variantsQuery = useAdminProductVariantsQuery(() => props.productId);
const variants = computed(() => variantsQuery.data.value?.variants ?? []);
</script>

<template>
  <div class="p-4">
    <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      Varian {{ props.productName }}
    </p>

    <div v-if="variantsQuery.isPending.value" class="space-y-2" aria-busy="true">
      <p class="sr-only">Memuat varian</p>
      <div v-for="row in 3" :key="row" class="h-8 rounded-md bg-muted" />
    </div>

    <p v-else-if="variantsQuery.error.value" class="text-sm text-destructive">
      Gagal memuat varian produk ini. Tutup dan buka lagi barisnya untuk mencoba ulang.
    </p>

    <p v-else-if="variants.length === 0" class="text-sm text-muted-foreground">
      Produk ini belum punya varian.
    </p>

    <div v-else class="overflow-x-auto rounded-md border border-border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Nama varian</TableHead>
            <TableHead class="text-right">Harga</TableHead>
            <TableHead class="text-right">Stok</TableHead>
            <TableHead class="text-right">Dipesan</TableHead>
            <TableHead class="text-right">Berat</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="variant in variants" :key="variant.id">
            <TableCell class="font-mono text-xs">{{ variant.sku }}</TableCell>
            <TableCell class="text-sm">{{ variant.name }}</TableCell>
            <TableCell class="text-right text-sm tabular-nums">{{ formatIDR(variant.price) }}</TableCell>
            <TableCell class="text-right text-sm tabular-nums">{{ formatNumber(variant.inventory.quantity) }}</TableCell>
            <TableCell class="text-right text-sm tabular-nums">
              {{ formatNumber(variant.inventory.reserved_quantity) }}
            </TableCell>
            <TableCell class="text-right text-sm tabular-nums">{{ formatNumber(variant.weight_grams) }} g</TableCell>
            <TableCell>
              <Badge :variant="variant.is_active ? 'secondary' : 'outline'">
                {{ variant.is_active ? "Aktif" : "Nonaktif" }}
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
