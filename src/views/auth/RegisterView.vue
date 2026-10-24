<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const message = ref('')

function submit() {
  message.value = 'We could not create your account. Please try again shortly.'
}
</script>

<template>
  <section class="grid w-full max-w-[960px] overflow-hidden border border-[#e4ddda] bg-white text-[#201b1b] md:grid-cols-[0.9fr_1fr]" aria-labelledby="register-title">
    <div class="relative hidden min-h-[580px] overflow-hidden md:block">
      <img class="absolute inset-0 h-full w-full object-cover" src="/img/auth/register.jfif" alt="Expressive fashion portrait for Bread & Circus" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#0f0f11]/85 via-[#0f0f11]/20 to-transparent"></div>
      <p class="absolute bottom-9 left-9 max-w-[15ch] font-heading text-4xl font-bold leading-[0.98] tracking-[-0.035em] text-white">Make an entrance.</p>
    </div>
    <div class="p-7 sm:p-10 lg:p-12">
    <h1 id="register-title" class="font-heading text-[clamp(32px,7vw,42px)] font-bold leading-none tracking-[-0.04em]">Join the show.</h1>
    <p class="mb-6 mt-3.5 text-sm leading-6 text-[#625b59]">Create an account for first access to drops, restocks, and member pricing.</p>
    <form class="grid gap-2.5" @submit.prevent="submit">
      <label class="mt-1 text-[13px] font-semibold" for="register-name">Name</label>
      <input id="register-name" v-model="name" class="min-h-12 w-full border border-[#d9d2cd] bg-white px-3 text-sm text-[#201b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="text" autocomplete="name" required placeholder="Your name" />
      <label class="mt-1 text-[13px] font-semibold" for="register-email">Email address</label>
      <input id="register-email" v-model="email" class="min-h-12 w-full border border-[#d9d2cd] bg-white px-3 text-sm text-[#201b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="email" autocomplete="email" required placeholder="name@example.com" />
      <label class="mt-1 text-[13px] font-semibold" for="register-password">Password</label>
      <input id="register-password" v-model="password" class="min-h-12 w-full border border-[#d9d2cd] bg-white px-3 text-sm text-[#201b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="password" autocomplete="new-password" required minlength="8" placeholder="At least 8 characters" />
      <button class="mt-3 min-h-12 bg-[#F44336] text-sm font-bold text-white hover:bg-[#d93429] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="submit">Create account</button>
      <p v-if="message" class="mt-1 text-[13px] leading-5 text-[#544c4c]" role="status">{{ message }}</p>
    </form>
    <p class="mt-6 text-center text-[13px] text-[#544c4c]">Already have an account? <RouterLink class="font-semibold text-[#5e1b9e] underline underline-offset-4" to="/login">Sign in</RouterLink></p>
    </div>
  </section>
</template>
