<script setup lang="ts">
import { ref } from "vue";
import { ImagePlus, X } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AdminImage } from "@/api/features/admin/admin.types";

const props = withDefaults(
  defineProps<{
    images: AdminImage[];
    queued?: File[];
    alt?: string;
    pending?: boolean;
    disabled?: boolean;
  }>(),
  {
    queued: () => [],
    alt: undefined,
    pending: false,
    disabled: false,
  },
);

const emit = defineEmits<{
  select: [files: File[]];
  remove: [imageId: string];
  unqueue: [index: number];
}>();

const input = ref<HTMLInputElement | null>(null);
const inputId = `image-input-${Math.random().toString(36).slice(2, 9)}`;

// Object URL dibuat sekali per file, bukan tiap render, supaya tidak bocor.
const previewCache = new WeakMap<File, string>();

function previewOf(file: File) {
  let url = previewCache.get(file);
  if (!url) {
    url = URL.createObjectURL(file);
    previewCache.set(file, url);
  }
  return url;
}

function onPick(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files ?? []);
  if (files.length > 0) emit("select", files);
  target.value = "";
}
</script>

<template>
  <div class="grid gap-3">
    <div class="flex flex-wrap items-center gap-3">
      <Label :for="inputId" class="text-sm font-medium">Foto</Label>
      <input
        :id="inputId"
        ref="input"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        :disabled="props.disabled || props.pending"
        @change="onPick"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        :disabled="props.disabled || props.pending"
        @click="input?.click()"
      >
        <ImagePlus aria-hidden="true" />
        {{ props.pending ? "Mengunggah..." : "Pilih foto" }}
      </Button>
    </div>

    <ul v-if="props.images.length > 0 || props.queued.length > 0" class="flex flex-wrap gap-2">
      <li v-for="image in props.images" :key="image.id" class="relative">
        <img
          :src="image.url"
          :alt="image.alt || ''"
          class="size-20 rounded-md border border-border object-cover"
          loading="lazy"
        />
        <button
          type="button"
          class="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
          :disabled="props.pending"
          :aria-label="`Hapus foto ${image.alt || image.id}`"
          @click="emit('remove', image.id)"
        >
          <X :size="13" aria-hidden="true" />
        </button>
      </li>

      <li
        v-for="(file, index) in props.queued"
        :key="`${file.name}-${index}`"
        class="relative"
      >
        <img
          :src="previewOf(file)"
          :alt="file.name"
          class="size-20 rounded-md border border-dashed border-border object-cover opacity-80"
        />
        <button
          type="button"
          class="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
          :disabled="props.pending"
          :aria-label="`Batalkan ${file.name}`"
          @click="emit('unqueue', index)"
        >
          <X :size="13" aria-hidden="true" />
        </button>
      </li>
    </ul>

    <p v-else class="text-sm text-muted-foreground">Belum ada foto.</p>
  </div>
</template>
