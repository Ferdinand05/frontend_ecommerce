// ponytail: temporary account and order data for the frontend-only dashboard; replace with API when the backend exists
export interface OrderItem {
  productId: number
  name: string
  variantName: string
  price: number
  qty: number
}

export interface Order {
  id: string
  placedAt: string
  status: 'Processing' | 'Shipped' | 'Completed' | 'Cancelled'
  items: OrderItem[]
  total: number
}

export interface AccountUser {
  name: string
  email: string
  phone: string
  memberSince: string
}

export const accountUser: AccountUser = {
  name: 'Raka Pratama',
  email: 'raka.pratama@example.com',
  phone: '+62 812 3456 7890',
  memberSince: 'March 2026',
}

export const activeOrders: Order[] = [
  {
    id: 'ORD-2041',
    placedAt: '18 Oct 2026',
    status: 'Processing',
    items: [
      { productId: 1, name: 'Grandstand Tee', variantName: 'L / Ink', price: 199000, qty: 1 },
      { productId: 3, name: 'Trapeze Cargo Pants', variantName: '30 / Olive', price: 389000, qty: 1 },
    ],
    total: 588000,
  },
  {
    id: 'ORD-2038',
    placedAt: '15 Oct 2026',
    status: 'Shipped',
    items: [
      { productId: 2, name: 'Ringmaster Hoodie', variantName: 'M / Charcoal', price: 429000, qty: 1 },
      { productId: 7, name: 'Circus Knit Polo', variantName: 'M / Aubergine', price: 289000, qty: 2 },
    ],
    total: 1007000,
  },
]

export const orderHistory: Order[] = [
  {
    id: 'ORD-1877',
    placedAt: '2 Sep 2026',
    status: 'Completed',
    items: [{ productId: 5, name: 'Spotlight Varsity Jacket', variantName: 'M / Red', price: 749000, qty: 1 }],
    total: 749000,
  },
  {
    id: 'ORD-1654',
    placedAt: '9 Aug 2026',
    status: 'Completed',
    items: [
      { productId: 4, name: 'Panem Graphic Tee', variantName: 'S / White', price: 199000, qty: 2 },
      { productId: 6, name: 'Encore Wide Shorts', variantName: 'M / Sand', price: 219000, qty: 1 },
    ],
    total: 617000,
  },
  {
    id: 'ORD-1502',
    placedAt: '21 Jul 2026',
    status: 'Cancelled',
    items: [{ productId: 8, name: 'Main Tent Coach Jacket', variantName: 'M / Black', price: 539000, qty: 1 }],
    total: 539000,
  },
]
