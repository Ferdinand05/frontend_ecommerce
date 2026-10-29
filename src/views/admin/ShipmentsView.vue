<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ExternalLink } from "@lucide/vue";
import AdminDataTable from "@/components/admin/AdminDataTable.vue";
import AdminDialog from "@/components/admin/AdminDialog.vue";
import RowActions from "@/components/admin/RowActions.vue";
import TableFilterBar from "@/components/admin/table/TableFilterBar.vue";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminShipmentQuery,
  useAdminShipmentTrackingQuery,
  useAdminShipmentsQuery,
} from "@/api/features/admin/shipments/shipment.queries";
import type { AdminShipment } from "@/api/features/admin/shipments/shipment.types";
import { column } from "@/lib/table-columns";
import { formatDateTime, formatIDR } from "@/lib/format";
import { humanizeStatus, statusVariant } from "@/lib/table";

const PAGE_SIZE = 20;

const pageIndex = ref(0);
const status = ref("all");

const params = computed(() => ({
  status: status.value === "all" ? undefined : status.value,
  page: pageIndex.value + 1,
  page_size: PAGE_SIZE,
}));

const shipmentsQuery = useAdminShipmentsQuery(() => params.value);
const shipments = computed(() => shipmentsQuery.data.value?.shipments ?? []);
const total = computed(() => shipmentsQuery.data.value?.meta.total ?? 0);

watch(status, () => {
  pageIndex.value = 0;
});

const statusOptions = ["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED", "FAILED"];

const columns = [
  column("tracking_number", "Nomor resi"),
  column("courier", "Kurir"),
  column("status", "Status"),
  column("shipping_cost", "Ongkir", "right"),
  column("created_at", "Dibuat"),
  column("actions", "Aksi"),
];

const detailOpen = ref(false);
const detailShipment = ref<AdminShipment | null>(null);

const detailQuery = useAdminShipmentQuery(() => (detailOpen.value ? detailShipment.value?.id ?? null : null));
const trackingQuery = useAdminShipmentTrackingQuery(
  () => (detailOpen.value ? detailShipment.value?.id ?? null : null),
);

function openDetail(shipment: AdminShipment) {
  detailShipment.value = shipment;
  detailOpen.value = true;
}

// Backend mengirim tahun 0 kalau penyedia belum memberi perkiraan tiba.
const hasEstimate = computed(() => {
  const value = trackingQuery.data.value?.estimated_delivery;
  if (!value) return false;
  return Number(value.slice(0, 4)) > 1;
});
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <TableFilterBar label="Filter pengiriman">
      <div class="grid gap-2 sm:w-48">
        <span class="text-sm font-medium text-muted-foreground">Status</span>
        <Select v-model="status">
          <SelectTrigger>
            <SelectValue placeholder="Semua status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua status</SelectItem>
            <SelectItem v-for="option in statusOptions" :key="option" :value="option">
              {{ humanizeStatus(option) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </TableFilterBar>

    <AdminDataTable
      :data="shipments"
      :columns="columns"
      :loading="shipmentsQuery.isPending.value"
      :error="shipmentsQuery.error.value"
      :total="total"
      :page-index="pageIndex"
      :page-size="PAGE_SIZE"
      empty-title="Belum ada pengiriman"
      empty-hint="Pilih status lain atau tunggu ada pengiriman baru dibuat."
      loading-label="Memuat pengiriman"
      error-title="Pengiriman gagal dimuat"
      @retry="shipmentsQuery.refetch()"
      @update:page-index="pageIndex = $event"
    >
      <template #cell="{ columnId, row }">
        <template v-if="columnId === 'tracking_number'">
          <a
            :href="row.original.tracking_url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 font-mono text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {{ row.original.tracking_number }}
            <ExternalLink :size="12" aria-hidden="true" />
          </a>
        </template>
        <template v-else-if="columnId === 'courier'">
          <span class="text-sm">
            {{ row.original.courier_company.toUpperCase() }} {{ row.original.courier_type }}
          </span>
        </template>
        <template v-else-if="columnId === 'status'">
          <Badge :variant="statusVariant(row.original.status)">
            {{ humanizeStatus(row.original.status) }}
          </Badge>
        </template>
        <template v-else-if="columnId === 'shipping_cost'">
          <span class="text-sm tabular-nums">{{ formatIDR(row.original.shipping_cost) }}</span>
        </template>
        <template v-else-if="columnId === 'created_at'">
          <span class="text-sm text-muted-foreground">{{ formatDateTime(row.original.created_at) }}</span>
        </template>
        <template v-else-if="columnId === 'actions'">
          <RowActions
            :actions="[{ label: 'Lihat detail', onSelect: () => openDetail(row.original) }]"
          />
        </template>
      </template>
    </AdminDataTable>

    <AdminDialog
      v-model:open="detailOpen"
      title="Detail pengiriman"
      :description="detailShipment?.tracking_number"
      wide
    >
      <div v-if="detailQuery.data.value" class="grid gap-6">
        <section class="grid gap-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-sm font-medium text-muted-foreground">Pengiriman</h3>
            <a
              v-if="detailQuery.data.value.shipment.tracking_url"
              :href="detailQuery.data.value.shipment.tracking_url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Lacak di penyedia
              <ExternalLink :size="13" aria-hidden="true" />
            </a>
          </div>
          <dl class="grid gap-3 text-sm sm:grid-cols-2">
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Status</dt>
              <dd class="text-right">
                <Badge :variant="statusVariant(detailQuery.data.value.shipment.status)">
                  {{ humanizeStatus(detailQuery.data.value.shipment.status) }}
                </Badge>
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Status penyedia</dt>
              <dd class="text-right">
                {{ humanizeStatus(detailQuery.data.value.shipment.provider_status) }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Kurir</dt>
              <dd class="text-right">
                {{ detailQuery.data.value.shipment.courier_company.toUpperCase() }}
                {{ detailQuery.data.value.shipment.courier_type }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Ongkir</dt>
              <dd class="text-right tabular-nums">
                {{ formatIDR(detailQuery.data.value.shipment.shipping_cost) }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Penyedia</dt>
              <dd class="text-right">{{ detailQuery.data.value.shipment.provider }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Nomor resi</dt>
              <dd class="text-right font-mono text-sm">
                {{ detailQuery.data.value.shipment.tracking_number }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">ID pesanan penyedia</dt>
              <dd class="text-right font-mono text-sm text-muted-foreground">
                {{ detailQuery.data.value.shipment.provider_order_id || "-" }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Dibuat</dt>
              <dd class="text-right">{{ formatDateTime(detailQuery.data.value.shipment.created_at) }}</dd>
            </div>
          </dl>
        </section>

        <section class="grid gap-3">
          <h3 class="text-sm font-medium text-muted-foreground">Pesanan</h3>
          <dl class="grid gap-3 text-sm sm:grid-cols-2">
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Nomor pesanan</dt>
              <dd class="text-right font-mono text-sm">{{ detailQuery.data.value.order.order_number }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Status pesanan</dt>
              <dd class="text-right">
                <Badge :variant="statusVariant(detailQuery.data.value.order.status)">
                  {{ humanizeStatus(detailQuery.data.value.order.status) }}
                </Badge>
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Total</dt>
              <dd class="text-right font-medium tabular-nums">
                {{ formatIDR(detailQuery.data.value.order.total_amount) }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Dibuat</dt>
              <dd class="text-right">{{ formatDateTime(detailQuery.data.value.order.created_at) }}</dd>
            </div>
          </dl>
        </section>

        <section v-if="trackingQuery.data.value" class="grid gap-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-sm font-medium text-muted-foreground">Lacakan</h3>
            <p v-if="hasEstimate" class="text-sm text-muted-foreground">
              Estimasi tiba {{ formatDateTime(trackingQuery.data.value.estimated_delivery) }}
            </p>
          </div>
          <dl class="grid gap-3 text-sm sm:grid-cols-2">
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Status pelacakan</dt>
              <dd class="text-right">{{ humanizeStatus(trackingQuery.data.value.status) }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Nomor resi</dt>
              <dd class="text-right font-mono text-sm">{{ trackingQuery.data.value.waybill_id }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Kurir</dt>
              <dd class="text-right">
                {{ trackingQuery.data.value.courier?.driver_name || "-" }}
                <span v-if="trackingQuery.data.value.courier?.driver_phone" class="text-muted-foreground">
                  · {{ trackingQuery.data.value.courier.driver_phone }}
                </span>
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Asal</dt>
              <dd class="text-right">{{ trackingQuery.data.value.origin?.address || "-" }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted-foreground">Tujuan</dt>
              <dd class="text-right">{{ trackingQuery.data.value.destination?.address || "-" }}</dd>
            </div>
          </dl>

          <ol class="grid gap-3">
            <li
              v-for="event in trackingQuery.data.value.history"
              :key="`${event.status}-${event.updated_at}`"
              class="grid gap-1 border-l-2 border-border pl-3 text-sm"
            >
              <div class="flex flex-wrap items-center gap-2">
                <Badge :variant="statusVariant(event.status)">
                  {{ humanizeStatus(event.status) }}
                </Badge>
                <span class="text-muted-foreground">{{ formatDateTime(event.updated_at) }}</span>
              </div>
              <p class="text-muted-foreground">{{ event.description }}</p>
            </li>
          </ol>
        </section>
      </div>
    </AdminDialog>
  </div>
</template>
