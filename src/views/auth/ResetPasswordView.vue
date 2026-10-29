<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { getApiErrorMessage } from "@/api/errors";
import { useResetPasswordMutation } from "@/api/features/auth/auth.queries";

const route = useRoute();

const token = computed(() => {
  const raw = route.query.token;
  return typeof raw === "string" ? raw.trim() : "";
});

const form = reactive({
  password: "",
  confirmation: "",
});

const mismatch = ref(false);
const done = ref(false);

const { mutate: resetPassword, isPending, isError, error } = useResetPasswordMutation();

function submit() {
  mismatch.value = form.password !== form.confirmation;
  if (mismatch.value) return;

  resetPassword(
    { token: token.value, new_password: form.password },
    {
      onSuccess: () => {
        done.value = true;
      },
    },
  );
}
</script>

<template>
  <section class="w-full max-w-[460px] border border-[#e4ddda] bg-white p-7 text-[#201b1b] sm:p-10 lg:p-12" aria-labelledby="reset-title">
    <RouterLink class="mb-8 inline-flex rounded-md border border-[#e4ddda] bg-[#0F0F11] p-2" to="/" aria-label="Bread & Circus home">
      <img class="h-16 w-auto object-contain" src="/img/logo.jfif" alt="Bread & Circus" />
    </RouterLink>

    <template v-if="!token">
      <h1 id="reset-title" class="font-heading text-[clamp(32px,7vw,42px)] font-bold leading-none tracking-[-0.04em]">Link incomplete<span class="text-ember">.</span></h1>
      <p class="mt-3.5 text-sm leading-6 text-[#625b59]">This reset link is missing its token. Request a fresh one and try again.</p>
      <RouterLink class="mt-7 inline-flex min-h-12 w-full items-center justify-center bg-ember px-4 text-sm font-bold text-white hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" to="/forgot-password">
        Request a new link
      </RouterLink>
    </template>

    <template v-else-if="done">
      <h1 id="reset-title" class="font-heading text-[clamp(32px,7vw,42px)] font-bold leading-none tracking-[-0.04em]">Password reset<span class="text-ember">.</span></h1>
      <p class="mt-3.5 text-sm leading-6 text-[#625b59]" role="status">Your new password is in place. Sign in with it and the show goes on.</p>
      <RouterLink class="mt-7 inline-flex min-h-12 w-full items-center justify-center bg-ember px-4 text-sm font-bold text-white hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" to="/login">
        Continue to sign in
      </RouterLink>
    </template>

    <template v-else>
      <h1 id="reset-title" class="font-heading text-[clamp(32px,7vw,42px)] font-bold leading-none tracking-[-0.04em]">New password<span class="text-ember">.</span></h1>
      <p class="mb-7 mt-3.5 text-sm leading-6 text-[#625b59]">Choose a new password for your account. At least 8 characters.</p>
      <form class="grid gap-2.5" @submit.prevent="submit">
        <label class="text-[13px] font-semibold" for="reset-password">New password</label>
        <input id="reset-password" v-model="form.password" class="min-h-12 w-full border border-[#d9d2cd] bg-white px-3 text-sm text-[#201b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="password" autocomplete="new-password" required minlength="8" placeholder="At least 8 characters" />

        <label class="mt-1 text-[13px] font-semibold" for="reset-confirmation">Confirm new password</label>
        <input id="reset-confirmation" v-model="form.confirmation" class="min-h-12 w-full border border-[#d9d2cd] bg-white px-3 text-sm text-[#201b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="password" autocomplete="new-password" required minlength="8" placeholder="Type it once more" />

        <p v-if="mismatch" class="mt-1 text-[13px] leading-5 text-ember" role="alert">The two passwords do not match yet.</p>
        <p v-if="isError" class="mt-1 text-[13px] leading-5 text-ember" role="alert">{{ getApiErrorMessage(error) }}</p>

        <button class="mt-3 min-h-12 bg-ember text-sm font-bold text-white hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336] disabled:cursor-not-allowed disabled:opacity-60" type="submit" :disabled="isPending">
          {{ isPending ? "Saving..." : "Save new password" }}
        </button>
      </form>
      <p class="mt-7 text-center text-[13px] text-[#544c4c]">Changed your mind? <RouterLink class="font-semibold text-[#5e1b9e] underline underline-offset-4" to="/login">Back to sign in</RouterLink></p>
    </template>
  </section>
</template>
