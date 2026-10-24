<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('')
const password = ref('')
const message = ref('')

function submit() {
  message.value = 'We could not sign you in. Check your details and try again.'
}
</script>

<template>
  <section class="grid w-full max-w-[960px] overflow-hidden border border-[#e4ddda] bg-white text-[#201b1b] md:grid-cols-[1fr_0.9fr]" aria-labelledby="login-title">
    <div class="relative hidden min-h-[580px] overflow-hidden md:block">
      <img class="absolute inset-0 h-full w-full object-cover" src="/img/auth/login.jfif" alt="Editorial streetwear portrait" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#0f0f11]/85 via-[#0f0f11]/20 to-transparent"></div>
      <p class="absolute bottom-9 left-9 max-w-[15ch] font-heading text-4xl font-bold leading-[0.98] tracking-[-0.035em] text-white">The night is yours.</p>
    </div>
    <div class="p-7 sm:p-10 lg:p-12">
    <h1 id="login-title" class="font-heading text-[clamp(32px,7vw,42px)] font-bold leading-none tracking-[-0.04em]">Take your place.</h1>
    <p class="mb-7 mt-3.5 text-sm leading-6 text-[#625b59]">Sign in to pick up where your style left off.</p>
    <form class="grid gap-2.5" @submit.prevent="submit">
      <label class="text-[13px] font-semibold" for="login-email">Email address</label>
      <input id="login-email" v-model="email" class="min-h-12 w-full border border-[#d9d2cd] bg-white px-3 text-sm text-[#201b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="email" autocomplete="email" required placeholder="name@example.com" />
      <div class="mt-2 flex items-baseline justify-between">
        <label class="text-[13px] font-semibold" for="login-password">Password</label>
        <RouterLink class="text-xs font-semibold text-[#5e1b9e] underline decoration-transparent underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-[#F44336]" to="/forgot-password">Forgot password?</RouterLink>
      </div>
      <input id="login-password" v-model="password" class="min-h-12 w-full border border-[#d9d2cd] bg-white px-3 text-sm text-[#201b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="password" autocomplete="current-password" required minlength="8" placeholder="At least 8 characters" />
      <button class="mt-3 min-h-12 bg-[#F44336] text-sm font-bold text-white hover:bg-[#d93429] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="submit">Sign in</button>
      <p v-if="message" class="mt-1 text-[13px] leading-5 text-[#544c4c]" role="status">{{ message }}</p>
    </form>
    <p class="mt-7 text-center text-[13px] text-[#544c4c]">New to the show? <RouterLink class="font-semibold text-[#5e1b9e] underline underline-offset-4" to="/register">Create an account</RouterLink></p>
    </div>
  </section>
</template>
