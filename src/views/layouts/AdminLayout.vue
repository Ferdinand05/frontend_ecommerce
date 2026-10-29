<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { LogOut, Menu, Store } from '@lucide/vue'
import SidebarDashboard from '@/components/admin/SidebarDashboard.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAuthStore } from '@/stores/auth'
import { useLogoutMutation } from '@/api/features/auth/auth.queries'

const route = useRoute()
const authStore = useAuthStore()
const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation()

const pageTitle = computed(() => (route.meta.title as string | undefined) ?? 'Dashboard')
const initials = computed(() => (authStore.user?.first_name || authStore.user?.email || 'AD').slice(0, 2).toUpperCase())

// Huruf admin punya scope sendiri. Kelasnya ditaruh di body supaya dialog,
// dropdown, dan select yang di-portal ke body ikut mewarisi huruf yang sama.
onMounted(() => {
  document.body.classList.add('admin-scope')
})

onBeforeUnmount(() => {
  document.body.classList.remove('admin-scope')
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <aside class="fixed inset-y-0 left-0 hidden w-64 border-r border-border lg:block">
      <SidebarDashboard />
    </aside>

    <div class="lg:pl-64">
      <header class="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline" size="icon" class="lg:hidden" aria-label="Buka navigasi admin">
              <Menu :size="19" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="w-72 border-border bg-background p-0">
            <SheetTitle class="sr-only">Navigasi admin</SheetTitle>
            <SheetDescription class="sr-only">Navigasi dasbor admin Bread &amp; Circus</SheetDescription>
            <SidebarDashboard />
          </SheetContent>
        </Sheet>

        <div class="min-w-0">
          <h1 class="truncate text-lg font-semibold tracking-tight">{{ pageTitle }}</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="ml-auto gap-2 px-2" aria-label="Menu akun">
              <Avatar class="size-8">
                <AvatarFallback class="bg-primary/15 text-xs font-bold text-primary">{{ initials }}</AvatarFallback>
              </Avatar>
              <span class="hidden text-sm font-semibold sm:inline">{{ authStore.user?.first_name ?? 'Admin' }}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-56">
            <DropdownMenuLabel class="truncate">{{ authStore.user?.email ?? 'admin@breadcircus.co' }}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem as-child>
              <RouterLink to="/">
                <Store :size="16" aria-hidden="true" />
                Kembali ke storefront
              </RouterLink>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" :disabled="isLoggingOut" @click="logout({ refresh_token: authStore.refreshToken ?? '' })">
              <LogOut :size="16" aria-hidden="true" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main class="px-4 py-6 sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
