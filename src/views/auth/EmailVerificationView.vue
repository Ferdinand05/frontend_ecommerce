<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { getApiErrorMessage } from "@/api/errors";
import { useResendVerificationMutation, useVerifyEmailMutation } from "@/api/features/auth/auth.queries";

const route = useRoute();

const token = computed(() => {
  const raw = route.query.token;
  return typeof raw === "string" ? raw.trim() : "";
});

const status = ref<"idle" | "verifying" | "verified" | "failed">("idle");
const failureMessage = ref("");
const resendEmail = ref("");
const resendMessage = ref("");
const resendFailed = ref(false);

const { mutate: verify } = useVerifyEmailMutation();
const { mutate: resend, isPending: isResending } = useResendVerificationMutation();

onMounted(() => {
  if (!token.value) {
    status.value = "failed";
    failureMessage.value = "This link is missing its verification token.";
    return;
  }

  status.value = "verifying";
  verify(
    { token: token.value },
    {
      onSuccess: () => {
        status.value = "verified";
      },
      onError: (error) => {
        status.value = "failed";
        failureMessage.value = getApiErrorMessage(error, "The verification link could not be used.");
      },
    },
  );
});

function submitResend() {
  resendMessage.value = "";
  resendFailed.value = false;
  resend(resendEmail.value.trim(), {
    onSuccess: () => {
      resendMessage.value = "A fresh verification link is on its way. Check your inbox.";
    },
    onError: (error) => {
      resendFailed.value = true;
      resendMessage.value = getApiErrorMessage(error, "We could not send a new link. Try again shortly.");
    },
  });
}
</script>

<template>
  <section class="w-full max-w-115 border border-[#e4ddda] bg-white p-7 text-[#201b1b] sm:p-10 lg:p-12" aria-labelledby="verify-title">
    <RouterLink class="mb-8 inline-flex rounded-md border border-[#e4ddda] bg-[#0F0F11] p-2" to="/" aria-label="Bread & Circus home">
      <img class="h-16 w-auto object-contain" src="/img/logo.jfif" alt="Bread & Circus" />
    </RouterLink>

    <template v-if="status === 'verifying'">
      <h1 id="verify-title" class="font-heading text-[clamp(32px,7vw,42px)] font-bold leading-none tracking-[-0.04em]">Checking your link<span class="text-ember">.</span></h1>
      <p class="mt-3.5 text-sm leading-6 text-[#625b59]" role="status">One moment while we confirm your email address.</p>
    </template>

    <template v-else-if="status === 'verified'">
      <h1 id="verify-title" class="font-heading text-[clamp(32px,7vw,42px)] font-bold leading-none tracking-[-0.04em]">Email confirmed<span class="text-ember">.</span></h1>
      <p class="mt-3.5 text-sm leading-6 text-[#625b59]" role="status">Your email address is verified. The show is yours.</p>
      <RouterLink
        class="mt-7 inline-flex min-h-12 w-full items-center justify-center bg-ember px-4 text-sm font-bold text-white hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
        to="/login"
      >
        Continue to sign in
      </RouterLink>
    </template>

    <template v-else>
      <h1 id="verify-title" class="font-heading text-[clamp(32px,7vw,42px)] font-bold leading-none tracking-[-0.04em]">Link expired<span class="text-ember">.</span></h1>
      <p class="mt-3.5 text-sm leading-6 text-[#625b59]">{{ failureMessage || "We could not verify your email with this link." }}</p>

      <form class="mt-7 grid gap-2.5" @submit.prevent="submitResend">
        <label class="text-[13px] font-semibold" for="resend-email">Email address</label>
        <input
          id="resend-email"
          v-model="resendEmail"
          class="min-h-12 w-full border border-[#d9d2cd] bg-white px-3 text-sm text-[#201b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]"
          type="email"
          autocomplete="email"
          required
          placeholder="name@example.com"
        />
        <button
          class="mt-3 min-h-12 bg-ember text-sm font-bold text-white hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          :disabled="isResending"
        >
          {{ isResending ? "Sending..." : "Send a new link" }}
        </button>
        <p v-if="resendMessage" class="mt-1 text-[13px] leading-5" :class="resendFailed ? 'text-ember' : 'text-[#544c4c]'" role="status">{{ resendMessage }}</p>
      </form>

      <p class="mt-7 text-center text-[13px] text-[#544c4c]">Already verified? <RouterLink class="font-semibold text-[#5e1b9e] underline underline-offset-4" to="/login">Back to sign in</RouterLink></p>
    </template>
  </section>
</template>
