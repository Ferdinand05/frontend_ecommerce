<script setup lang="ts">
import { Boxes, CircleAlert, CreditCard, Package, TrendingDown, TrendingUp, Truck } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { adminLowStock, adminMetrics, adminRecentOrders, adminRevenue, type AdminOrderStatus } from '@/data/admin'

const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

const metricIcons = [CreditCard, Package, Truck, CircleAlert]

const statusVariant: Record<AdminOrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Pending: 'outline',
  Processing: 'default',
  Shipped: 'secondary',
  Completed: 'secondary',
  Cancelled: 'destructive',
}

const peak = Math.max(...adminRevenue.map((point) => point.revenue))
</script>

<template>
  <div class="grid min-w-0 gap-6">
    <section class="min-w-0" aria-labelledby="metrics-title">
      <h2 id="metrics-title" class="sr-only">Summary metrics</h2>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card v-for="(metric, index) in adminMetrics" :key="metric.label">
          <CardHeader>
            <CardDescription>{{ metric.label }}</CardDescription>
            <CardTitle class="font-heading text-2xl font-extrabold tabular-nums">{{ metric.value }}</CardTitle>
            <CardAction>
              <span class="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <component :is="metricIcons[index]" :size="19" aria-hidden="true" />
              </span>
            </CardAction>
          </CardHeader>
          <CardContent class="flex items-center gap-2 text-sm">
            <span class="inline-flex items-center gap-1 font-semibold" :class="metric.delta >= 0 ? 'text-primary' : 'text-muted-foreground'">
              <TrendingUp v-if="metric.delta >= 0" :size="15" aria-hidden="true" />
              <TrendingDown v-else :size="15" aria-hidden="true" />
              {{ metric.delta >= 0 ? '+' : '' }}{{ metric.delta }}%
            </span>
            <span class="text-muted-foreground">{{ metric.hint }}</span>
          </CardContent>
        </Card>
      </div>
    </section>

    <div class="grid min-w-0 gap-6 xl:grid-cols-[1.6fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Revenue, last 7 days</CardTitle>
          <CardDescription>Daily gross in millions of rupiah</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex h-44 items-end gap-2" role="img" aria-label="Bar chart of daily revenue for the last 7 days">
            <div v-for="point in adminRevenue" :key="point.day" class="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div
                class="w-full rounded-t bg-primary/85 transition-colors hover:bg-primary"
                :style="{ height: `${Math.round((point.revenue / peak) * 100)}%` }"
                :title="`${point.day}: ${point.revenue}M`"
              ></div>
              <span class="text-xs text-muted-foreground">{{ point.day }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Low stock</CardTitle>
          <CardDescription>Variants below reorder point</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-3">
          <div v-for="item in adminLowStock" :key="item.sku" class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold">{{ item.product }}</p>
              <p class="truncate text-xs text-muted-foreground">{{ item.sku }} · {{ item.variant }}</p>
            </div>
            <Badge :variant="item.remaining <= 2 ? 'destructive' : 'outline'">{{ item.remaining }} left</Badge>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card class="min-w-0">
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
        <CardDescription>Latest orders placed in the storefront</CardDescription>
        <CardAction>
          <span class="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Boxes :size="15" aria-hidden="true" />{{ adminRecentOrders.length }} shown
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead class="text-right">Items</TableHead>
              <TableHead class="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">Placed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="order in adminRecentOrders" :key="order.id">
              <TableCell class="font-medium">{{ order.id }}</TableCell>
              <TableCell>{{ order.customer }}</TableCell>
              <TableCell class="text-right tabular-nums">{{ order.items }}</TableCell>
              <TableCell class="text-right tabular-nums">{{ formatter.format(order.total) }}</TableCell>
              <TableCell><Badge :variant="statusVariant[order.status]">{{ order.status }}</Badge></TableCell>
              <TableCell class="text-right text-muted-foreground">{{ order.placedAt }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
