<script setup lang="ts">
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { getApiErrorMessage } from '@/api/errors'
import { useRegisterMutation } from '@/api/features/auth/auth.queries'
import Button from '@/components/ui/button/Button.vue'

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
})

const { mutate: doRegister, isPending, isError, error } = useRegisterMutation()

const onSubmit = () => {
  doRegister({ ...form })
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
      <RouterLink class="mb-8 inline-flex rounded-md border border-[#e4ddda] bg-[#0F0F11] p-2" to="/" aria-label="Bread & Circus home">
        <img class="h-16 w-auto object-contain" src="/img/logo.jfif" alt="Bread & Circus" />
      </RouterLink>
      <h1 id="register-title" class="font-heading text-[clamp(32px,7vw,42px)] font-bold leading-none tracking-[-0.04em]">Join the show.</h1>
      <p class="mb-6 mt-3.5 text-sm leading-6 text-[#625b59]">Create an account to review your orders and account details.</p>
      <form class="grid gap-2.5" @submit.prevent="onSubmit">
        <div class="mt-1 grid gap-2.5 sm:grid-cols-2">
          <div class="grid gap-2.5">
            <label class="text-[13px] font-semibold" for="register-first-name">First name</label>
            <input id="register-first-name" v-model="form.first_name" class="min-h-12 w-full border border-[#d9d2cd] bg-white px-3 text-sm text-[#201b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="text" autocomplete="given-name" required placeholder="Ada" />
          </div>
          <div class="grid gap-2.5">
            <label class="text-[13px] font-semibold" for="register-last-name">Last name</label>
            <input id="register-last-name" v-model="form.last_name" class="min-h-12 w-full border border-[#d9d2cd] bg-white px-3 text-sm text-[#201b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="text" autocomplete="family-name" required placeholder="Lovelace" />
          </div>
        </div>
        <label class="mt-1 text-[13px] font-semibold" for="register-email">Email address</label>
        <input id="register-email" v-model="form.email" class="min-h-12 w-full border border-[#d9d2cd] bg-white px-3 text-sm text-[#201b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="email" autocomplete="email" required placeholder="name@example.com" />
        <label class="mt-1 text-[13px] font-semibold" for="register-phone">Phone number</label>
        <input id="register-phone" v-model="form.phone" class="min-h-12 w-full border border-[#d9d2cd] bg-white px-3 text-sm text-[#201b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="tel" autocomplete="tel" required placeholder="+62 812 3456 7890" />
        <label class="mt-1 text-[13px] font-semibold" for="register-password">Password</label>
        <input id="register-password" v-model="form.password" class="min-h-12 w-full border border-[#d9d2cd] bg-white px-3 text-sm text-[#201b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="password" autocomplete="new-password" required minlength="8" placeholder="At least 8 characters" />
        <Button :disabled="isPending" class="mt-3 min-h-12 bg-ember text-sm font-bold text-white hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F44336]" type="submit">
          <span v-if="isPending">Memproses...</span>
          <span v-else>Create account</span>
        </Button>
        <p v-if="isError" class="text-[13px] leading-5 text-ember" role="alert">{{ getApiErrorMessage(error) }}</p>
      </form>
      <p class="mt-6 text-center text-[13px] text-[#544c4c]">Already have an account? <RouterLink class="font-semibold text-[#5e1b9e] underline underline-offset-4" to="/login">Sign in</RouterLink></p>
    </div>
  </section>
</template>
