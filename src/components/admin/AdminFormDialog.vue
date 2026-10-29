<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getApiErrorMessage } from "@/api/errors";

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description?: string;
    submitLabel?: string;
    pending?: boolean;
    error?: unknown;
  }>(),
  {
    description: undefined,
    submitLabel: "Simpan",
    pending: false,
    error: undefined,
  },
);

const emit = defineEmits<{
  "update:open": [value: boolean];
  submit: [];
}>();

const errorMessage = computed(() =>
  props.error ? getApiErrorMessage(props.error, "Perubahan gagal disimpan.") : "",
);
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{{ props.title }}</DialogTitle>
        <DialogDescription v-if="props.description">{{ props.description }}</DialogDescription>
      </DialogHeader>

      <form class="grid gap-4" @submit.prevent="emit('submit')">
        <slot />

        <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

        <DialogFooter>
          <Button type="button" variant="outline" @click="emit('update:open', false)">Batal</Button>
          <Button type="submit" :disabled="props.pending">
            {{ props.pending ? "Menyimpan..." : props.submitLabel }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
