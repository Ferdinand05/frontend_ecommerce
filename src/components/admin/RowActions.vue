<script setup lang="ts">
import { MoreHorizontal } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface RowAction {
  label: string;
  onSelect: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

defineProps<{
  actions: RowAction[];
  label?: string;
}>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="icon-sm" :aria-label="label ?? 'Aksi baris'">
        <MoreHorizontal aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="action in actions"
        :key="action.label"
        :variant="action.variant ?? 'default'"
        :disabled="action.disabled"
        @select="action.onSelect()"
      >
        {{ action.label }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
