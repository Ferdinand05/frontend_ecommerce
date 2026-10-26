// ponytail: temporary admin dashboard data for the frontend-only build; replace with API queries when the backend endpoints are wired
export type AdminOrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled'

export interface AdminMetric {
  label: string
  value: string
  delta: number
  hint: string
}

export interface AdminOrder {
  id: string
  customer: string
  items: number
  total: number
  status: AdminOrderStatus
  placedAt: string
}

export interface AdminStatusHistory {
  id: string
  orderNumber: string
  status: AdminOrderStatus
  note: string
  changedBy: string
  changedAt: string
}

export interface AdminLowStock {
  sku: string
  product: string
  variant: string
  remaining: number
}

export interface AdminRevenuePoint {
  day: string
  revenue: number
}

export const adminMetrics: AdminMetric[] = [
  { label: 'Total revenue', value: 'Rp 48,26M', delta: 12.4, hint: 'vs last 30 days' },
  { label: 'Orders', value: '318', delta: 8.1, hint: 'vs last 30 days' },
  { label: 'Pending shipments', value: '27', delta: -4.6, hint: 'awaiting handover' },
  { label: 'Low stock variants', value: '9', delta: 3.2, hint: 'below reorder point' },
]

export const adminRevenue: AdminRevenuePoint[] = [
  { day: 'Mon', revenue: 5.2 },
  { day: 'Tue', revenue: 7.8 },
  { day: 'Wed', revenue: 6.1 },
  { day: 'Thu', revenue: 9.4 },
  { day: 'Fri', revenue: 8.3 },
  { day: 'Sat', revenue: 12.6 },
  { day: 'Sun', revenue: 10.9 },
]

export const adminRecentOrders: AdminOrder[] = [
  { id: 'ORD-2041', customer: 'Raka Pratama', items: 2, total: 588000, status: 'Processing', placedAt: '18 Oct 2026' },
  { id: 'ORD-2040', customer: 'Sinta Halim', items: 1, total: 749000, status: 'Shipped', placedAt: '18 Oct 2026' },
  { id: 'ORD-2039', customer: 'Bagas Wicak', items: 3, total: 1152000, status: 'Pending', placedAt: '17 Oct 2026' },
  { id: 'ORD-2038', customer: 'Dewi Anggraini', items: 3, total: 1007000, status: 'Completed', placedAt: '15 Oct 2026' },
  { id: 'ORD-2037', customer: 'Yoga Saputra', items: 1, total: 219000, status: 'Cancelled', placedAt: '14 Oct 2026' },
]

export const adminStatusHistories: AdminStatusHistory[] = [
  { id: 'HST-901', orderNumber: 'ORD-2041', status: 'Processing', note: 'Payment confirmed, packing started', changedBy: 'System', changedAt: '18 Oct 2026, 10:12' },
  { id: 'HST-900', orderNumber: 'ORD-2040', status: 'Shipped', note: 'Handed to courier JNE', changedBy: 'Bagas (Ops)', changedAt: '18 Oct 2026, 08:40' },
  { id: 'HST-899', orderNumber: 'ORD-2038', status: 'Completed', note: 'Delivered and confirmed by customer', changedBy: 'System', changedAt: '17 Oct 2026, 16:05' },
  { id: 'HST-898', orderNumber: 'ORD-2039', status: 'Pending', note: 'Awaiting payment confirmation', changedBy: 'System', changedAt: '17 Oct 2026, 14:22' },
  { id: 'HST-897', orderNumber: 'ORD-2037', status: 'Cancelled', note: 'Cancelled by customer before payment', changedBy: 'Dewi (CS)', changedAt: '14 Oct 2026, 09:31' },
]

export const adminLowStock: AdminLowStock[] = [
  { sku: 'BC-TEE-001', product: 'Grandstand Tee', variant: 'L / Ink', remaining: 3 },
  { sku: 'BC-HOD-004', product: 'Ringmaster Hoodie', variant: 'M / Charcoal', remaining: 5 },
  { sku: 'BC-CAR-002', product: 'Trapeze Cargo Pants', variant: '30 / Olive', remaining: 2 },
  { sku: 'BC-POL-007', product: 'Circus Knit Polo', variant: 'M / Aubergine', remaining: 6 },
  { sku: 'BC-JKT-009', product: 'Spotlight Varsity Jacket', variant: 'M / Red', remaining: 1 },
]
