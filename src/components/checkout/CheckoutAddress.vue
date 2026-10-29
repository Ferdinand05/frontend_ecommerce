<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { getApiErrorMessage } from "@/api/errors";
import { useShippingAreasQuery } from "@/api/features/shipping/shipping.queries";
import type { ShippingArea } from "@/api/features/shipping/shipping.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseAreaName } from "@/lib/area";

export interface CheckoutAddressValue {
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  destination_area_id: string;
  destination_area_name: string;
}

const props = defineProps<{
  modelValue: CheckoutAddressValue;
  disabled?: boolean;
}>();
const emit = defineEmits<{
  "update:modelValue": [value: CheckoutAddressValue];
  valid: [value: boolean];
}>();

const search = ref("");
const suggestionsOpen = ref(false);
const activeIndex = ref(-1);
const areasQuery = useShippingAreasQuery(search);
const areas = computed(() => areasQuery.data.value ?? []);
const searching = computed(() => areasQuery.isFetching.value && search.value.trim().length >= 3);
const areaError = computed(() => (areasQuery.isError.value ? getApiErrorMessage(areasQuery.error.value) : ""));
const showSuggestions = computed(() => suggestionsOpen.value && search.value.trim().length >= 3);

function update(field: keyof CheckoutAddressValue, value: string) {
  emit("update:modelValue", { ...props.modelValue, [field]: value });
}

function onFieldInput(field: keyof CheckoutAddressValue, event: Event) {
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    update(field, target.value);
  }
}

function chooseArea(area: ShippingArea) {
  const { city, province } = parseAreaName(area.name);
  search.value = area.name;
  suggestionsOpen.value = false;
  activeIndex.value = -1;
  emit("update:modelValue", {
    ...props.modelValue,
    city,
    province,
    postal_code: String(area.postal_code),
    destination_area_id: area.id,
    destination_area_name: area.name,
  });
}

function onSearchInput(value: string | number) {
  const input = String(value);
  search.value = input;
  suggestionsOpen.value = true;
  activeIndex.value = -1;
  if (input !== props.modelValue.destination_area_name) {
    emit("update:modelValue", {
      ...props.modelValue,
      destination_area_id: "",
      destination_area_name: "",
      city: "",
      province: "",
      postal_code: "",
    });
  }
}

function onSearchKeydown(event: KeyboardEvent) {
  if (!showSuggestions.value || areas.value.length === 0) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % areas.value.length;
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    activeIndex.value = activeIndex.value <= 0 ? areas.value.length - 1 : activeIndex.value - 1;
  } else if (event.key === "Enter") {
    const active = areas.value[activeIndex.value];
    if (active) {
      event.preventDefault();
      chooseArea(active);
    }
  } else if (event.key === "Escape") {
    suggestionsOpen.value = false;
  }
}

function closeSuggestionsSoon() {
  window.setTimeout(() => {
    suggestionsOpen.value = false;
  }, 150);
}

const valid = computed(
  () =>
    props.modelValue.recipient_name.trim().length >= 2 &&
    /^[+\d][\d\s().-]{7,29}$/.test(props.modelValue.phone.trim()) &&
    props.modelValue.address.trim().length >= 5 &&
    props.modelValue.city.trim().length > 0 &&
    props.modelValue.province.trim().length > 0 &&
    props.modelValue.postal_code.trim().length > 0 &&
    props.modelValue.destination_area_id.length > 0,
);
watch(valid, (value) => emit("valid", value), { immediate: true });
</script>

<template>
  <form class="grid gap-x-5 gap-y-4 sm:grid-cols-2" @submit.prevent>
    <div class="grid gap-2 sm:col-span-2">
      <Label for="checkout-recipient">Full name</Label>
      <Input
        id="checkout-recipient"
        :model-value="modelValue.recipient_name"
        autocomplete="name"
        required
        :disabled="disabled"
        placeholder="Who receives the parcel"
        class="min-h-12 border-white/25 bg-white/5 text-white placeholder:text-white/55"
        @update:model-value="update('recipient_name', String($event ?? ''))"
      />
    </div>
    <div class="grid gap-2 sm:col-span-2">
      <Label for="checkout-phone">Phone number</Label>
      <Input
        id="checkout-phone"
        :model-value="modelValue.phone"
        autocomplete="tel"
        inputmode="tel"
        required
        :disabled="disabled"
        placeholder="08xxxxxxxxxx"
        class="min-h-12 border-white/25 bg-white/5 text-white placeholder:text-white/55"
        @update:model-value="update('phone', String($event ?? ''))"
      />
    </div>
    <div class="grid gap-2 sm:col-span-2">
      <Label for="checkout-area">Delivery area</Label>
      <div class="relative">
        <Input
          id="checkout-area"
          :model-value="search"
          autocomplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="checkout-area-options"
          :aria-expanded="showSuggestions"
          :aria-activedescendant="activeIndex >= 0 ? `checkout-area-option-${activeIndex}` : undefined"
          :disabled="disabled"
          placeholder="Search district, city, or postal code"
          class="min-h-12 border-white/25 bg-white/5 text-white placeholder:text-white/55"
          @focus="suggestionsOpen = true"
          @blur="closeSuggestionsSoon"
          @keydown="onSearchKeydown"
          @update:model-value="onSearchInput"
        />
        <ul
          v-if="showSuggestions"
          id="checkout-area-options"
          class="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto border border-white/20 bg-[#17171A] py-1 shadow-xl"
          role="listbox"
          aria-label="Delivery area"
        >
          <li v-if="searching" class="px-3 py-3 text-sm text-white/75" role="status">Searching areas…</li>
          <li v-else-if="areaError" class="px-3 py-3 text-sm text-[#ff958e]" role="alert">{{ areaError }}</li>
          <li v-else-if="areas.length === 0" class="px-3 py-3 text-sm text-white/75">No area matches that search.</li>
          <li
            v-for="(area, index) in areas"
            :id="`checkout-area-option-${index}`"
            :key="area.id"
            role="option"
            :aria-selected="modelValue.destination_area_id === area.id"
          >
            <button
              class="min-h-11 w-full px-3 text-left text-sm text-white hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#F44336]"
              :class="index === activeIndex ? 'bg-white/10' : ''"
              type="button"
              @mousedown.prevent="chooseArea(area)"
            >
              {{ area.name }}
            </button>
          </li>
        </ul>
      </div>
      <p class="text-xs leading-5 text-white/70">Pick one of the search results so shipping rates can be calculated.</p>
    </div>
    <div class="grid gap-2 sm:col-span-2">
      <Label for="checkout-address">Street address</Label>
      <textarea
        id="checkout-address"
        :value="modelValue.address"
        class="min-h-24 w-full resize-y border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336] disabled:opacity-50"
        autocomplete="street-address"
        required
        :disabled="disabled"
        placeholder="Street, number, building, floor, landmark"
        @input="onFieldInput('address', $event)"
      ></textarea>
    </div>
    <div class="grid gap-2">
      <Label for="checkout-city">City</Label>
      <Input
        id="checkout-city"
        :model-value="modelValue.city"
        autocomplete="address-level2"
        required
        :disabled="disabled"
        class="min-h-12 border-white/25 bg-white/5 text-white placeholder:text-white/55"
        @update:model-value="update('city', String($event ?? ''))"
      />
    </div>
    <div class="grid gap-2">
      <Label for="checkout-province">Province</Label>
      <Input
        id="checkout-province"
        :model-value="modelValue.province"
        autocomplete="address-level1"
        required
        :disabled="disabled"
        class="min-h-12 border-white/25 bg-white/5 text-white placeholder:text-white/55"
        @update:model-value="update('province', String($event ?? ''))"
      />
    </div>
    <div class="grid gap-2 sm:col-span-2">
      <Label for="checkout-postal">Postal code</Label>
      <Input
        id="checkout-postal"
        :model-value="modelValue.postal_code"
        inputmode="numeric"
        autocomplete="postal-code"
        required
        :disabled="disabled"
        class="min-h-12 border-white/25 bg-white/5 text-white placeholder:text-white/55"
        @update:model-value="update('postal_code', String($event ?? ''))"
      />
    </div>
  </form>
</template>
