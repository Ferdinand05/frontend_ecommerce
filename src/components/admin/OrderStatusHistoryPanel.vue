<script setup lang="ts">
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminOrderHistories } from "@/api/features/admin/orders/order.queries";
import { formatDateTime } from "@/lib/format";
import { humanizeStatus, statusVariant } from "@/lib/table";

const props = defineProps<{
  orderId: string;
}>();

const historiesQuery = useAdminOrderHistories(() => props.orderId);
const histories = computed(() => historiesQuery.data.value?.histories ?? []);
</script>

<template>
  <div class="p-4">
    <p v-if="historiesQuery.isPending.value" class="text-sm text-muted-foreground" aria-busy="true">
      Memuat riwayat status
    </p>

    <p v-else-if="historiesQuery.error.value" class="text-sm text-destructive">
      Gagal memuat riwayat status pesanan ini. Tutup dan buka lagi barisnya untuk mencoba ulang.
    </p>

    <p v-else-if="histories.length === 0" class="text-sm text-muted-foreground">
      Pesanan ini belum punya riwayat status.
    </p>

    <div v-else class="overflow-x-auto rounded-md border border-border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead>Catatan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="history in histories" :key="history.id">
            <TableCell>
              <Badge :variant="statusVariant(history.status)">{{ humanizeStatus(history.status) }}</Badge>
            </TableCell>
            <TableCell class="text-sm text-muted-foreground">{{ formatDateTime(history.created_at) }}</TableCell>
            <TableCell class="text-sm">{{ history.note ?? "-" }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
