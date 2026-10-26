<script setup lang="ts">
import { BookmarkCheck } from '@lucide/vue'
import { accountUser } from '@/data/account'
</script>

<template>
  <section aria-labelledby="details-title">
    <div class="flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-5">
      <div>
        <h2 id="details-title" class="font-heading text-2xl font-bold">Account details</h2>
        <p class="mt-1 text-sm text-white/70">Your details, ready for the next order.</p>
      </div>
      <span class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#ff958e]"><BookmarkCheck :size="16" aria-hidden="true" /> Member since {{ accountUser.memberSince }}</span>
    </div>
    <dl class="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
      <div><dt class="text-xs font-bold uppercase tracking-[0.12em] text-white/60">Full name</dt><dd class="mt-2 text-base font-semibold">{{ accountUser.name }}</dd></div>
      <div><dt class="text-xs font-bold uppercase tracking-[0.12em] text-white/60">Email address</dt><dd class="mt-2 break-all text-base font-semibold">{{ accountUser.email }}</dd></div>
      <div><dt class="text-xs font-bold uppercase tracking-[0.12em] text-white/60">Phone number</dt><dd class="mt-2 text-base font-semibold">{{ accountUser.phone }}</dd></div>
    </dl>
  </section>
</template>
