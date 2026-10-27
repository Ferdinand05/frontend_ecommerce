<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  Package,
  Receipt,
  ScrollText,
  ShieldCheck,
  Tags,
  Truck,
  Users,
  Warehouse,
} from '@lucide/vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()

const adminName = computed(() => {
  const user = authStore.user
  if (!user) return 'Administrator'
  return [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email
})

const initials = computed(() => {
  const user = authStore.user
  const source = user?.first_name || user?.email || 'AD'
  return source.slice(0, 2).toUpperCase()
})

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
}

interface NavGroup {
  key: string
  label: string
  icon: typeof LayoutDashboard
  items: NavItem[]
}

const topItems: NavItem[] = [
  { to: '/admin/dashboard', label: 'Dasbor', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Pengguna', icon: Users },
  { to: '/admin/roles', label: 'Peran', icon: ShieldCheck },
]

const groups: NavGroup[] = [
  {
    key: 'orders',
    label: 'Pesanan',
    icon: Receipt,
    items: [
      { to: '/admin/orders', label: 'Daftar pesanan', icon: Receipt },
      { to: '/admin/order-status-histories', label: 'Riwayat status', icon: ScrollText },
    ],
  },
  {
    key: 'catalog',
    label: 'Katalog',
    icon: Package,
    items: [
      { to: '/admin/categories', label: 'Kategori', icon: Tags },
      { to: '/admin/products', label: 'Produk', icon: Package },
    ],
  },
]

const bottomItems: NavItem[] = [
  { to: '/admin/stock-movements', label: 'Perpindahan stok', icon: Warehouse },
  { to: '/admin/payments', label: 'Pembayaran', icon: CreditCard },
  { to: '/admin/shipments', label: 'Pengiriman', icon: Truck },
]

const openGroups = ref<Record<string, boolean>>(
  Object.fromEntries(groups.map((group) => [group.key, group.items.some((item) => isActive(item.to))])),
)

function isActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}

function groupActive(group: NavGroup) {
  return group.items.some((item) => isActive(item.to))
}

// keep the group containing the current page expanded while navigating
watch(
  () => route.path,
  (path) => {
    for (const group of groups) {
      if (group.items.some((item) => path === item.to || path.startsWith(`${item.to}/`))) {
        openGroups.value[group.key] = true
      }
    }
  },
)
</script>

<template>
  <div class="flex h-full flex-col gap-5 bg-sidebar p-4 text-sidebar-foreground">
    <RouterLink class="px-2 font-heading text-lg font-extrabold tracking-[-0.06em]" to="/admin/dashboard" aria-label="Bread & Circus admin">
      BREAD <span class="text-primary">&</span> CIRCUS
    </RouterLink>

    <div class="flex items-center gap-2.5 rounded-md px-2 py-1.5">
      <Avatar class="size-8 shrink-0">
        <AvatarFallback class="bg-primary/15 text-xs font-bold text-primary">{{ initials }}</AvatarFallback>
      </Avatar>
      <p class="min-w-0 flex-1 truncate text-sm font-semibold" :title="authStore.user?.email ?? undefined">{{ adminName }}</p>
      <Badge variant="outline" class="shrink-0 text-[11px] uppercase">{{ authStore.user?.role?.name ?? 'admin' }}</Badge>
    </div>

    <nav class="flex-1 overflow-y-auto" aria-label="Admin navigation">
      <ul class="grid gap-0.5">
        <li v-for="item in topItems" :key="item.to">
          <RouterLink
            class="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-primary"
            :class="isActive(item.to) ? 'bg-primary/15 text-primary' : 'text-muted-foreground'"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            :to="item.to"
          >
            <component :is="item.icon" :size="16" aria-hidden="true" />
            {{ item.label }}
          </RouterLink>
        </li>

        <li v-for="group in groups" :key="group.key">
          <Collapsible :open="openGroups[group.key]" @update:open="openGroups[group.key] = $event">
            <CollapsibleTrigger
              class="flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-semibold transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-primary"
              :class="groupActive(group) ? 'text-primary' : 'text-muted-foreground'"
            >
              <component :is="group.icon" :size="16" aria-hidden="true" />
              {{ group.label }}
              <ChevronDown :size="15" class="ml-auto shrink-0 transition-transform duration-200" :class="openGroups[group.key] ? 'rotate-180' : ''" aria-hidden="true" />
            </CollapsibleTrigger>
            <CollapsibleContent class="grid gap-0.5 pl-4 pt-0.5">
              <RouterLink
                v-for="item in group.items"
                :key="item.to"
                class="flex min-h-9 items-center gap-2.5 rounded-md px-3 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-primary"
                :class="isActive(item.to) ? 'bg-primary/15 font-semibold text-primary' : 'text-muted-foreground'"
                :aria-current="isActive(item.to) ? 'page' : undefined"
                :to="item.to"
              >
                <component :is="item.icon" :size="14" aria-hidden="true" />
                {{ item.label }}
              </RouterLink>
            </CollapsibleContent>
          </Collapsible>
        </li>

        <li v-for="item in bottomItems" :key="item.to">
          <RouterLink
            class="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-primary"
            :class="isActive(item.to) ? 'bg-primary/15 text-primary' : 'text-muted-foreground'"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            :to="item.to"
          >
            <component :is="item.icon" :size="16" aria-hidden="true" />
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <RouterLink class="flex min-h-10 items-center gap-2 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground" to="/">
      <ScrollText :size="14" aria-hidden="true" />
      Kembali ke storefront
    </RouterLink>
  </div>
</template>
