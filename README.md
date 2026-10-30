# Bread & Circus

Bread & Circus is an online fashion storefront with customer account and order tools, plus an admin area for managing the shop. This repository contains the Vue frontend. It connects to a separate Go backend for authentication, product data, cart, checkout, payments, and order operations.

## What it does

- Browse products and view product details.
- Register, sign in, verify email, and reset a forgotten password.
- Manage a customer account, cart, checkout, and orders.
- Open an admin area for store and order management.

## Tech stack

- Vue 3, TypeScript, and Vite
- Vue Router for navigation
- Pinia for client-side authentication state
- TanStack Vue Query for backend data and mutations
- Axios for API requests
- Tailwind CSS v4 and shadcn-vue components
- Vitest for unit tests and Playwright for end-to-end tests

## Run locally

Requirements: Node.js `^22.18.0` or `>=24.12.0`.

```bash
npm install
npm run dev
```

The frontend reads `VITE_API_BASE_URL` from `.env` to connect to the backend. Set it to a reachable API v1 URL before running the app. The backend is maintained separately from this repository.

## Checks

```bash
npm run type-check
npm run test:unit
npm run test:e2e
npm run build
```
## Backend Repository
See [`https://github.com/Ferdinand05/backend_ecommerce`](Backend Repository)

See [`docs/api-docs.yaml`](docs/api-docs.yaml) for the API contract and [`DESIGN.md`](DESIGN.md) for the storefront design direction.
