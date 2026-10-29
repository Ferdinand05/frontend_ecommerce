<script setup lang="ts">
import { computed } from "vue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getApiErrorMessage } from "@/api/errors";

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    pending?: boolean;
    error?: unknown;
  }>(),
  {
    description: undefined,
    confirmLabel: "Hapus",
    pending: false,
    error: undefined,
  },
);

const emit = defineEmits<{
  "update:open": [value: boolean];
  confirm: [];
}>();

const errorMessage = computed(() =>
  props.error ? getApiErrorMessage(props.error, "Data gagal dihapus.") : "",
);
</script>

<template>
  <AlertDialog :open="props.open" @update:open="emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ props.title }}</AlertDialogTitle>
        <AlertDialogDescription>{{ props.description }}</AlertDialogDescription>
      </AlertDialogHeader>

      <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

      <AlertDialogFooter>
        <AlertDialogCancel>Batal</AlertDialogCancel>
        <AlertDialogAction
          class="bg-destructive text-white hover:bg-destructive/90"
          :disabled="props.pending"
          @click="emit('confirm')"
        >
          {{ props.pending ? "Menghapus..." : props.confirmLabel }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
