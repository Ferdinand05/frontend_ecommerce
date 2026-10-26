<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ChevronDown, LogOut } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import { useLogoutMutation } from '@/api/features/auth/auth.queries'

const authStore = useAuthStore()
const { mutate: logout } = useLogoutMutation()

const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.39C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.39 2.12.66.67 1.33 1.09 2.12 1.39.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.12-1.39.67-.66 1.09-1.33 1.39-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.39-2.12C21.32 1.35 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm7.85-10.4a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/',
    path: 'M16.6 5.82A4.28 4.28 0 0115.54 3h-3.09v12.4a2.59 2.59 0 01-2.59 2.5 2.59 2.59 0 110-5.18c.27 0 .52.04.76.12v-3.2a5.9 5.9 0 00-.76-.05 5.72 5.72 0 00-5.72 5.72 5.72 5.72 0 005.72 5.72 5.72 5.72 0 005.72-5.72V9.01a7.34 7.34 0 004.28 1.37V7.3a4.28 4.28 0 01-1.36-1.48z',
  },
]
</script>

<template>
  <footer class="border-t border-white/15 bg-[#0F0F11] text-white">
    <div class="mx-auto max-w-[1440px] px-5 pb-7 pt-14 sm:px-8 lg:px-12">
      <div class="grid gap-12 border-b border-white/15 pb-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div class="max-w-sm">
          <div class="flex items-center gap-4">
            <RouterLink class="inline-flex shrink-0" to="/" aria-label="Bread & Circus home"><img class="h-24 w-auto object-contain object-left" src="/img/logo.jfif" alt="Bread & Circus" loading="lazy" /></RouterLink>
            <p class="max-w-[26ch] text-sm leading-6 text-white/80">Everyday essentials with main-tent energy. Made for your life off-script.</p>
          </div>
          <p class="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#ff7770]">Feed your style. Enjoy the show.</p>
        </div>
        <div>
          <h2 class="font-heading text-sm font-bold uppercase tracking-[0.12em]">The shop</h2>
          <nav class="mt-4 grid gap-3 text-sm text-white/80" aria-label="Shop links">
            <RouterLink class="w-fit hover:text-white" to="/#collection">Shop all</RouterLink>
            <RouterLink class="w-fit hover:text-white" to="/#collection">New pieces</RouterLink>
            <RouterLink class="w-fit hover:text-white" to="/#collection">Browse categories</RouterLink>
          </nav>
        </div>
        <div>
          <h2 class="font-heading text-sm font-bold uppercase tracking-[0.12em]">Your account</h2>
          <details class="group relative mt-4">
            <summary class="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm text-white/80 hover:text-white focus-visible:outline-2 focus-visible:outline-[#F44336]">
              Profile <ChevronDown :size="16" class="transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div class="absolute bottom-full left-0 z-40 mb-1 min-w-56 border border-white/20 bg-[#0F0F11] py-2 shadow-lg">
              <RouterLink class="flex min-h-11 items-center px-4 text-sm text-white/80 hover:bg-white/10 hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" to="/account">Account details</RouterLink>
              <RouterLink class="flex min-h-11 items-center px-4 text-sm text-white/80 hover:bg-white/10 hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" to="/account/orders">Orders</RouterLink>
              <RouterLink class="flex min-h-11 items-center px-4 text-sm text-white/80 hover:bg-white/10 hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" to="/account/order-history">Order history</RouterLink>
              <template v-if="authStore.isAuthenticated">
                <button class="flex min-h-11 w-full items-center gap-2 border-t border-white/15 px-4 text-sm text-white/80 hover:bg-white/10 hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" @click="logout()">
                  <LogOut :size="16" aria-hidden="true" /> Sign out
                </button>
              </template>
              <template v-else>
                <RouterLink class="flex min-h-11 items-center border-t border-white/15 px-4 text-sm text-white/80 hover:bg-white/10 hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" to="/login">Sign in</RouterLink>
                <RouterLink class="flex min-h-11 items-center px-4 text-sm text-white/80 hover:bg-white/10 hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" to="/register">Create account</RouterLink>
              </template>
            </div>
          </details>
        </div>
        <div>
          <h2 class="font-heading text-sm font-bold uppercase tracking-[0.12em]">The fine print</h2>
          <p class="mt-4 max-w-xs text-sm leading-6 text-white/80">Questions before you order? Our crew knows the fit, the fabric, and the fits that run small.</p>
          <div class="mt-5 flex flex-wrap gap-2.5">
            <a v-for="social in socials" :key="social.label" class="inline-flex min-h-11 items-center gap-2 border border-white/40 px-3 text-xs font-semibold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" :href="social.href" :aria-label="`Visit ${social.label}`" target="_blank" rel="noreferrer">
              <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="social.path" /></svg>
              {{ social.label }}
            </a>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2 pt-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Bread & Circus. Demo storefront.</span>
        <span>Built for the everyday and the entrance.</span>
      </div>
    </div>
  </footer>
</template>
