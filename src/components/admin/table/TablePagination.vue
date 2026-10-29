<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";

const props = defineProps<{
  pageIndex: number;
  pageSize: number;
  rowCount: number;
  disabled?: boolean;
}>();

const emit = defineEmits<{ "update:pageIndex": [value: number] }>();

const pageCount = computed(() => Math.max(1, Math.ceil(props.rowCount / props.pageSize)));
const from = computed(() => (props.rowCount === 0 ? 0 : props.pageIndex * props.pageSize + 1));
const to = computed(() => Math.min(props.rowCount, (props.pageIndex + 1) * props.pageSize));

function go(delta: number) {
  const next = props.pageIndex + delta;
  if (next < 0 || next >= pageCount.value) return;
  emit("update:pageIndex", next);
}
</script>

<template>
  <div class="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
    <p class="text-sm text-muted-foreground">
      Menampilkan <span class="tabular-nums text-foreground">{{ formatNumber(from) }}</span> sampai
      <span class="tabular-nums text-foreground">{{ formatNumber(to) }}</span> dari
      <span class="tabular-nums text-foreground">{{ formatNumber(rowCount) }}</span> data
    </p>
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">
        Halaman <span class="tabular-nums text-foreground">{{ pageIndex + 1 }}</span> dari
        <span class="tabular-nums text-foreground">{{ pageCount }}</span>
      </span>
      <Button
        variant="outline"
        size="icon"
        class="size-8"
        :disabled="disabled || pageIndex === 0"
        aria-label="Halaman sebelumnya"
        @click="go(-1)"
      >
        <ChevronLeft :size="16" aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="size-8"
        :disabled="disabled || pageIndex + 1 >= pageCount"
        aria-label="Halaman berikutnya"
        @click="go(1)"
      >
        <ChevronRight :size="16" aria-hidden="true" />
      </Button>
    </div>
  </div>
</template>
