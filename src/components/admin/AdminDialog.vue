<script setup lang="ts">
import { computed } from "vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/api/errors";

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description?: string;
    loading?: boolean;
    error?: unknown;
    wide?: boolean;
  }>(),
  {
    description: undefined,
    loading: false,
    error: undefined,
    wide: false,
  },
);

const emit = defineEmits<{ "update:open": [value: boolean] }>();

const errorMessage = computed(() =>
  props.error ? getApiErrorMessage(props.error, "Data gagal dimuat.") : "",
);
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-h-[85vh] overflow-y-auto" :class="props.wide ? 'sm:max-w-3xl' : undefined">
      <DialogHeader>
        <DialogTitle>{{ props.title }}</DialogTitle>
        <DialogDescription v-if="props.description">{{ props.description }}</DialogDescription>
      </DialogHeader>

      <div v-if="props.loading" class="grid gap-2" aria-busy="true">
        <span class="sr-only">Memuat data</span>
        <Skeleton v-for="row in 4" :key="row" class="h-6 w-full" />
      </div>

      <p v-else-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

      <slot v-else />

      <DialogFooter>
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
