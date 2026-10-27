<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('')
const message = ref('')

function submit() {
  message.value = 'We could not send a reset link. Please try again shortly.'
}
</script>

<template>
  <section class="w-full max-w-[460px] border border-[#e4ddda] bg-white p-7 text-[#201b1b] sm:p-10 lg:p-12" aria-labelledby="forgot-title">
    <RouterLink class="mb-8 inline-flex rounded-md border border-[#e4ddda] bg-[#0F0F11] p-2" to="/" aria-label="Bread & Circus home">
      <img class="h-16 w-auto object-contain" src="/img/logo.jfif" alt="Bread & Circus" />
    </RouterLink>
    <h1 id="forgot-title" class="font-heading text-[clamp(32px,7vw,42px)] font-bold leading-none tracking-[-0.04em]">Lost the key?</h1>
    <p class="mb-7 mt-3.5 text-sm leading-6 text-[#625b59]">Enter the email linked to your account and we’ll send instructions to help you back in.</p>
    <form class="grid gap-2.5" @submit.prevent="submit">
      <label class="text-[13px] font-semibold" for="forgot-email">Email address</label>
      <input id="forgot-email" v-model="email" class="min-h-12 w-full border border-[#d9d2cd] bg-white px-3 text-sm text-[#201b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="email" autocomplete="email" required placeholder="name@example.com" />
      <button class="mt-3 min-h-12 bg-ember text-sm font-bold text-white hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="submit">Send reset link</button>
      <p v-if="message" class="mt-1 text-[13px] leading-5 text-[#544c4c]" role="status">{{ message }}</p>
    </form>
    <p class="mt-7 text-center text-[13px] text-[#544c4c]">Remembered it after all? <RouterLink class="font-semibold text-[#5e1b9e] underline underline-offset-4" to="/login">Back to sign in</RouterLink></p>
  </section>
</template>
