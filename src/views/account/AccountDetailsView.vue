<script setup lang="ts">
import { BookmarkCheck } from '@lucide/vue'
import { useAccountProfileQuery } from '@/api/features/account/account.queries'
import { formatDate } from '@/lib/format'

const { data: profile, isPending, isError, refetch } = useAccountProfileQuery()
</script>

<template>
  <section aria-labelledby="details-title">
    <div class="flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-5">
      <div>
        <h2 id="details-title" class="font-heading text-2xl font-bold">Account details</h2>
        <p class="mt-1 text-sm text-white/70">Your details, ready for the next order.</p>
      </div>
      <span v-if="profile" class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#ff958e]"><BookmarkCheck :size="16" aria-hidden="true" /> Member since {{ formatDate(profile.created_at) }}</span>
    </div>

    <p v-if="isPending" class="mt-6 text-sm text-white/70">Loading your details&hellip;</p>

    <div v-else-if="isError" class="mt-6 grid gap-3 border-y border-white/15 py-8">
      <p class="text-sm text-white/75">Your profile could not be loaded, so the details below are unavailable right now.</p>
      <button class="inline-flex min-h-11 w-fit items-center border border-white/40 px-4 text-sm font-semibold hover:border-[#F44336] hover:text-[#ff958e] focus-visible:outline-2 focus-visible:outline-[#F44336]" type="button" @click="refetch()">
        Load my details again
      </button>
    </div>

    <dl v-else-if="profile" class="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
      <div>
        <dt class="text-xs font-bold uppercase tracking-[0.12em] text-white/60">Full name</dt>
        <dd class="mt-2 text-base font-semibold">{{ [profile.first_name, profile.last_name].filter(Boolean).join(" ") }}</dd>
      </div>
      <div>
        <dt class="text-xs font-bold uppercase tracking-[0.12em] text-white/60">Email address</dt>
        <dd class="mt-2 break-all text-base font-semibold">{{ profile.email }}</dd>
      </div>
      <div>
        <dt class="text-xs font-bold uppercase tracking-[0.12em] text-white/60">Phone number</dt>
        <dd class="mt-2 text-base font-semibold">{{ profile.phone || "Not set on your account" }}</dd>
      </div>
      <div>
        <dt class="text-xs font-bold uppercase tracking-[0.12em] text-white/60">Account type</dt>
        <dd class="mt-2 text-base font-semibold capitalize">{{ profile.role.name }}</dd>
      </div>
    </dl>
  </section>
</template>
