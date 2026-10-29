<script setup lang="ts">
import { computed } from "vue";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ShippingRate } from "@/api/features/shipping/shipping.types";
import { formatIDR } from "@/lib/format";

const props = defineProps<{
  rates: ShippingRate[];
  modelValue: string;
  loading: boolean;
  error: string;
  disabled?: boolean;
  weightGrams: number;
}>();
const emit = defineEmits<{ "update:modelValue": [value: string] }>();

function rateKey(rate: ShippingRate): string {
  return `${rate.courier_code}:${rate.courier_service_code}`;
}

function rateId(rate: ShippingRate): string {
  return `checkout-rate-${rate.courier_code}-${rate.courier_service_code}`;
}

const selected = computed(() => props.rates.find((rate) => rateKey(rate) === props.modelValue));
</script>

<template>
  <div class="grid gap-4">
    <p v-if="weightGrams > 0" class="text-xs leading-5 text-white/70">
      Total weight {{ weightGrams.toLocaleString("en-US") }} g. Couriers price the parcel from that.
    </p>

    <div v-if="loading" class="grid gap-3" aria-live="polite">
      <div class="h-20 animate-pulse bg-white/10 motion-reduce:animate-none"></div>
      <div class="h-20 animate-pulse bg-white/10 motion-reduce:animate-none"></div>
      <p class="text-sm text-white/75">Asking the couriers for a rate…</p>
    </div>

    <p v-else-if="error" class="border-l-2 border-[#F44336] pl-4 text-sm text-[#ff958e]" role="alert">
      {{ error }}
    </p>

    <p v-else-if="rates.length === 0" class="text-sm text-white/75">
      No courier serves that area yet. Try another delivery area.
    </p>

    <RadioGroup
      v-else
      :model-value="modelValue"
      :disabled="disabled"
      class="gap-2"
      aria-label="Shipping courier"
      @update:model-value="emit('update:modelValue', String($event ?? ''))"
    >
      <div
        v-for="rate in rates"
        :key="rateKey(rate)"
        class="flex items-start gap-3 border px-4 py-3 transition-colors"
        :class="modelValue === rateKey(rate) ? 'border-[#F44336] bg-white/[0.06]' : 'border-white/20 hover:border-white/40'"
      >
        <RadioGroupItem :id="rateId(rate)" :value="rateKey(rate)" class="mt-1 border-white/40" />
        <label :for="rateId(rate)" class="flex flex-1 cursor-pointer items-start gap-3">
          <span class="flex-1">
            <span class="block text-sm font-semibold">{{ rate.courier_name }} · {{ rate.courier_service_name }}</span>
            <span class="mt-1 block text-xs leading-5 text-white/75">
              {{ rate.description }} · {{ rate.shipment_duration_range }} {{ rate.shipment_duration_unit }}
            </span>
          </span>
          <span class="text-sm font-semibold tabular-nums">{{ formatIDR(rate.price) }}</span>
        </label>
      </div>
    </RadioGroup>

    <p v-if="selected" class="text-xs leading-5 text-white/70">
      {{ formatIDR(selected.price) }} shipping is added to the order total.
    </p>
  </div>
</template>
