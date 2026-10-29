<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { getApiErrorMessage, getApiErrorStatus } from "@/api/errors";
import { useCheckoutPreviewMutation, usePlaceOrderMutation } from "@/api/features/checkout/checkout.queries";
import type { CreateOrderRequest } from "@/api/features/checkout/checkout.types";
import { useShippingRatesMutation } from "@/api/features/shipping/shipping.queries";
import type { ShippingRate } from "@/api/features/shipping/shipping.types";
import CheckoutAddress, { type CheckoutAddressValue } from "@/components/checkout/CheckoutAddress.vue";
import CheckoutShipping from "@/components/checkout/CheckoutShipping.vue";
import CheckoutSummary from "@/components/checkout/CheckoutSummary.vue";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Check, MapPin, Truck } from "@lucide/vue";

const router = useRouter();
const previewMutation = useCheckoutPreviewMutation();
const placeOrderMutation = usePlaceOrderMutation();
const address = reactive<CheckoutAddressValue>({
  recipient_name: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  postal_code: "",
  destination_area_id: "",
  destination_area_name: "",
});
const addressValid = ref(false);
const accordionValue = ref("address");
const ratesMutation = useShippingRatesMutation();
const rates = computed<ShippingRate[]>(() => ratesMutation.data.value ?? []);
const selectedRateKey = ref("");
const ratesError = computed(() => (ratesMutation.isError.value ? getApiErrorMessage(ratesMutation.error.value) : ""));
const ratesPending = computed(() => ratesMutation.isPending.value);
const submitError = ref("");

const preview = computed(() => previewMutation.data.value);
const items = computed(() => preview.value?.items ?? []);
const subtotal = computed(() => preview.value?.subtotal ?? "0");
const weight = computed(() => items.value.reduce((total, item) => total + item.weight_grams * item.quantity, 0));
const selectedRate = computed(() => rates.value.find((rate) => `${rate.courier_code}:${rate.courier_service_code}` === selectedRateKey.value));
const shippingCost = computed(() => selectedRate.value?.price ?? null);
const placing = computed(() => placeOrderMutation.isPending.value);
const placeStage = computed(() => placeOrderMutation.stage.value);
const previewPending = computed(() => previewMutation.isPending.value);
const previewFailed = computed(() => previewMutation.isError.value);
const previewError = computed(() => (previewMutation.isError.value ? getApiErrorMessage(previewMutation.error.value) : ""));
const canPlaceOrder = computed(() => addressValid.value && !!selectedRate.value && !!preview.value && !ratesPending.value);

function fetchRates() {
  if (!address.destination_area_id || items.value.length === 0) return;
  selectedRateKey.value = "";
  ratesMutation.mutate({
    destination_area_id: address.destination_area_id,
    items: items.value.map((item) => ({ product_variant_id: item.product_variant_id, quantity: item.quantity })),
  });
}

watch(() => address.destination_area_id, (areaId, previousAreaId) => {
  if (!areaId || areaId === previousAreaId) return;
  fetchRates();
  if (addressValid.value) accordionValue.value = "shipping";
});

function applyAddress(value: CheckoutAddressValue) {
  Object.assign(address, value);
}

function stepShipping() {
  if (!addressValid.value) return;
  if (rates.value.length === 0 && !ratesPending.value && !ratesError.value) fetchRates();
  accordionValue.value = "shipping";
}

function placeOrder() {
  const rate = selectedRate.value;
  if (!rate || !addressValid.value || placing.value) return;
  submitError.value = "";
  const payload: CreateOrderRequest = {
    recipient_name: address.recipient_name.trim(),
    phone: address.phone.trim(),
    address: address.address.trim(),
    city: address.city.trim(),
    province: address.province.trim(),
    postal_code: address.postal_code.trim(),
    destination_area_id: address.destination_area_id,
    destination_area_name: address.destination_area_name,
    courier_code: rate.courier_code,
    courier_service_code: rate.courier_service_code,
  };
  placeOrderMutation.mutate(payload, {
    onSuccess: (payment) => {
      if (!payment.checkout_url) {
        submitError.value = "The order was saved but no payment link came back. Contact support before paying again.";
        return;
      }
      window.location.href = payment.checkout_url;
    },
    onError: (error: unknown) => {
      submitError.value = getApiErrorMessage(error);
    },
  });
}

function loadPreview() {
  previewMutation.mutate(undefined, {
    onSuccess: (data) => {
      if (data.items.length === 0) {
        toast.error("Your bag is empty. Pick a piece before checking out.");
        void router.replace("/cart");
      }
    },
    onError: (error: unknown) => {
      const status = getApiErrorStatus(error);
      if (status === 422) {
        toast.error("Some pieces ran out of stock. Check your bag again.");
        void router.replace("/cart");
      } else if (status === 400 || status === 409) {
        toast.error(getApiErrorMessage(error));
        void router.replace("/cart");
      }
    },
  });
}

onMounted(loadPreview);
</script>

<template>
  <section class="mx-auto min-h-[65vh] max-w-[1200px] px-4 py-12 text-white sm:px-6 lg:px-10 lg:py-16" aria-labelledby="checkout-title">
    <RouterLink class="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/75 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F44336]" to="/cart">
      <ArrowLeft :size="16" aria-hidden="true" /> Back to your bag
    </RouterLink>

    <div class="mt-6 border-b border-white/20 pb-6">
      <h1 id="checkout-title" class="font-heading text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">Checkout<span class="text-[#F44336]">.</span></h1>
      <p class="mt-3 max-w-[60ch] text-sm leading-6 text-white/75">Where it goes, how it travels, then you pay.</p>
    </div>

    <div v-if="previewPending" class="grid gap-4 py-10" aria-live="polite">
      <p class="text-sm text-white/75">Checking the pieces in your bag…</p>
      <div class="h-20 animate-pulse bg-white/10 motion-reduce:animate-none"></div>
      <div class="h-20 animate-pulse bg-white/10 motion-reduce:animate-none"></div>
    </div>

    <div v-else-if="previewFailed" class="grid justify-items-start gap-4 py-10">
      <p class="font-heading text-xl font-bold">Checkout did not load.</p>
      <p class="max-w-[58ch] text-sm leading-6 text-white/75">{{ previewError }}</p>
      <button class="inline-flex min-h-11 items-center border border-white/40 px-5 text-sm font-bold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" @click="loadPreview">
        Try loading checkout again
      </button>
    </div>

    <div v-else-if="preview" class="grid items-start gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
      <div class="min-w-0">
        <Accordion v-model="accordionValue" type="single" collapsible class="w-full">
          <AccordionItem value="address" class="border-white/20">
            <AccordionTrigger class="min-h-16 text-base font-bold hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]">
              <span class="flex items-center gap-3">
                <span class="grid size-8 place-items-center border border-white/30 text-xs tabular-nums">01</span>
                <span class="grid text-left">
                  <span>Delivery address</span>
                  <span v-if="address.destination_area_name" class="mt-1 max-w-[52ch] truncate text-xs font-normal text-white/70">{{ address.destination_area_name }}</span>
                </span>
                <Check v-if="addressValid" class="ml-1 size-4 text-[#ff958e]" aria-label="Address is complete" />
              </span>
            </AccordionTrigger>
            <AccordionContent class="pb-5">
              <CheckoutAddress :model-value="address" @update:model-value="applyAddress" @valid="addressValid = $event" />
              <button
                class="mt-5 inline-flex min-h-12 items-center justify-center bg-ember px-5 text-sm font-bold text-white hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/50"
                type="button"
                :disabled="!addressValid"
                @click="stepShipping"
              >
                Continue to shipping
              </button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping" class="border-white/20">
            <AccordionTrigger class="min-h-16 text-base font-bold hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]">
              <span class="flex items-center gap-3">
                <span class="grid size-8 place-items-center border border-white/30 text-xs tabular-nums">02</span>
                <span class="grid text-left">
                  <span>Courier and shipping</span>
                  <span v-if="selectedRate" class="mt-1 text-xs font-normal text-white/70">{{ selectedRate.courier_name }} · {{ selectedRate.courier_service_name }}</span>
                </span>
                <Truck v-if="selectedRate" class="ml-1 size-4 text-[#ff958e]" aria-label="Courier chosen" />
              </span>
            </AccordionTrigger>
            <AccordionContent class="pb-5">
              <p v-if="!addressValid" class="mb-4 text-sm text-white/75">Finish the address first so shipping rates can load.</p>
              <CheckoutShipping
                v-else
                :rates="rates"
                :model-value="selectedRateKey"
                :loading="ratesPending"
                :error="ratesError"
                :disabled="placing"
                :weight-grams="weight"
                @update:model-value="selectedRateKey = $event"
              />
              <button
                v-if="ratesError"
                class="mt-4 min-h-11 border border-white/40 px-4 text-sm font-semibold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]"
                type="button"
                @click="fetchRates"
              >
                Calculate rates again
              </button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div class="grid gap-4 lg:sticky lg:top-24">
        <CheckoutSummary
          :items="items"
          :subtotal="subtotal"
          :shipping-cost="shippingCost"
          :placing="placing"
          :place-stage="placeStage"
          :error="submitError"
          :can-place-order="canPlaceOrder"
          @place-order="placeOrder"
        />
        <p class="flex items-center gap-2 text-xs text-white/70"><MapPin :size="14" aria-hidden="true" /> {{ items.length }} {{ items.length === 1 ? "piece" : "pieces" }} in this order</p>
      </div>
    </div>
  </section>
</template>
