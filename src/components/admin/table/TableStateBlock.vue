<script setup lang="ts">
import { CircleAlert, Inbox, RotateCw } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/api/errors";

const props = withDefaults(
  defineProps<{
    loading: boolean;
    error: unknown;
    emptyTitle: string;
    emptyHint: string;
    loadingLabel?: string;
    errorTitle?: string;
    columns?: number;
  }>(),
  {
    loadingLabel: "Memuat data",
    errorTitle: "Data gagal dimuat",
    columns: 5,
  },
);

const emit = defineEmits<{ retry: [] }>();
</script>

<template>
  <div v-if="props.loading" class="px-4 py-6" aria-live="polite" aria-busy="true">
    <p class="sr-only">{{ props.loadingLabel }}</p>
    <div class="space-y-3">
      <div v-for="row in 4" :key="row" class="flex items-center gap-4">
        <Skeleton class="h-4 w-1/4" />
        <Skeleton class="h-4 flex-1" />
        <Skeleton class="h-4 w-20" />
      </div>
    </div>
  </div>

  <div v-else-if="props.error" class="flex flex-col items-center gap-3 px-4 py-12 text-center">
    <span class="grid size-10 place-items-center rounded-lg bg-destructive/15 text-destructive">
      <CircleAlert :size="19" aria-hidden="true" />
    </span>
    <p class="text-sm font-semibold">{{ props.errorTitle }}</p>
    <p class="max-w-md text-sm text-muted-foreground">{{ getApiErrorMessage(props.error) }}</p>
    <Button variant="outline" size="sm" class="mt-1" @click="emit('retry')">
      <RotateCw :size="15" aria-hidden="true" />
      Coba lagi
    </Button>
  </div>

  <div v-else class="flex flex-col items-center gap-3 px-4 py-12 text-center">
    <span class="grid size-10 place-items-center rounded-lg bg-muted text-muted-foreground">
      <Inbox :size="19" aria-hidden="true" />
    </span>
    <p class="text-sm font-semibold">{{ props.emptyTitle }}</p>
    <p class="max-w-md text-sm text-muted-foreground">{{ props.emptyHint }}</p>
    <slot name="empty-action" />
  </div>
</template>
