# AGENTS.md

Vue 3 + Vite storefront/admin for "Bread & Circus" e-commerce. Frontend only; the Go backend is a **separate repo** (`../backend_ecommerce`) and is already deployed at `http://13.211.208.214/api/v1`.

## Commands

```bash
npm run dev          # vite dev server
npm run build        # runs type-check + vite build in parallel (type-check = vue-tsc --build)
npm run type-check   # vue-tsc --build
npm run test:unit    # vitest (jsdom); excludes e2e/**
npm run test:e2e     # playwright; auto-starts `npm run dev` on :5173 (reuseExistingServer)
```

There is **no lint or format script**. Don't invent one; `npm run type-check` is the gate.

## Environment

- `.env` is committed and holds the only env var: `VITE_API_BASE_URL=http://13.211.208.214/api/v1`. The app talks to the **remote** backend — there is no local API to start.
- `docs/api-docs.yaml` is the checked-in OpenAPI spec (copy of the backend repo's). `DOCS.md` points at a SwaggerHub URL instead; prefer the local YAML, it is what the deployed server matches.
- Admin seed account: `admin@ecommerce.test` / `admin123`.

## API layer

- `src/api/client.ts` — axios instance, 15s timeout, base URL from `VITE_API_BASE_URL`.
- `src/api/interceptors.ts` — attaches `Bearer` token from the Pinia auth store. On 401 it calls `POST /auth/refresh` and **queues** concurrent requests behind a single refresh. If there is no refresh token the original error propagates untouched (this is why the login form shows "invalid credentials").
- `src/api/features/<area>/{x.api.ts, x.queries.ts, x.types.ts}` — public areas (`features/products`, `features/categories`) are separate from admin areas (`features/admin/products`, `features/admin/categories`, …). Match the existing 3-file split when adding an endpoint.
- **Money arrives as a string** (`"99000"`), not a number, even though the OpenAPI schema says `number`. Local types declare `price: string`; always format through `src/lib/format.ts` (`formatIDR`, `formatIDRRange`) which accepts both.
- Error bodies are `{ "error": ... }` or `{ "message": ... }`. Use `getApiErrorMessage()` from `src/api/errors.ts` instead of reading `error.response` directly.
- Multipart image upload (`POST /admin/products/:id/images`, `.../variants/:id/images`) needs a real file body. Under PowerShell 5.1 use `curl.exe -F` — `Invoke-RestMethod` has no `-Form`.

## Data fetching vs state (hard rules from DOCS.md)

- Server state → **TanStack Query** only. Never `ref` + `onMounted` for API data.
- Client state (auth) → **Pinia**; `pinia-plugin-persistedstate` is registered in `src/main.ts`.
- The cart is **server state**: `GET /cart`, `POST /cart/items`, `POST /cart/items/{id}/increase|decrease`, `DELETE /cart/items/{id}`, `DELETE /cart` (all need a Bearer token). See `src/api/features/cart/`.
- Query keys follow `["admin", "<area>", params]` for admin and `["<area>", params]` for public. Params are passed as a getter so the key tracks reactivity.
- `GET /products` and `GET /products/{id}` return money as strings and `GET /products/{id}` wraps the product in a `{ product: ... }` envelope. The public catalogue uses `useInfiniteProductsQuery` (12 per page, `Load more` button); the product page uses `useProductQuery`.

## Router

- Four route files under `src/router/` (`public`, `auth`, `customer`, `admin`), each with a layout component from `src/views/layouts/` as the parent. Views are injected as children — **never duplicate a header/sidebar inside a view**.
- Guard flags live in `meta`: `requiresAuth`, `requiresAdmin`, `guestOnly`. Admin check is `user.role.name === "admin"` (string compare, not role id).
- `RouteMeta` is augmented in `src/router/guards.ts` — extend it there when adding a meta field.

## UI conventions

- Tailwind v4 via `@tailwindcss/vite`; theme tokens live in `src/assets/main.css` under `@theme` (no `tailwind.config.js`).
- Brand red `#F44336` fails WCAG AA on white text. Use `--color-ember` (`#c62828`) for red surfaces carrying white text; keep `#F44336` for red text/borders on dark.
- shadcn-vue owns `src/components/ui/**` (see `components.json`: new-york, zinc, aliases `@/components/ui`, utils `@/lib/utils`). Add primitives through the shadcnVue MCP tool; don't hand-roll accessible dropdowns/modals/selects.
- Class merging: existing UI primitives import `cn` from the **`cn` npm package** (`import { cn } from "cn"`), not from a local util. `components.json` still declares the utils alias `@/lib/utils`, but `src/lib/utils.ts` does not exist (the leftover `lib/utils.ts` at repo root is outside the `@` alias) — so MCP-generated components that import `@/lib/utils` will not resolve. Either import from `"cn"` or create `src/lib/utils.ts` re-exporting it.
- Icons: import from `@lucide/vue` (what the code actually uses — `DOCS.md` says `lucide-vue-next`, ignore that).
- Admin tables are TanStack Vue Table. Use `column(id, header, align)` from `src/lib/table-columns.ts` (no accessor — render via the `#cell` slot) and the `adminTableFeatures` / `statusVariant` / `humanizeStatus` helpers in `src/lib/table.ts`.
- `tsconfig.app.json` sets `noUncheckedIndexedAccess: true` — array index access yields `T | undefined`, so guard or use `!`.

## Tests

- Unit specs live in `src/**/__tests__/*.spec.ts` and are **excluded** from `tsconfig.app.json`; `tsconfig.vitest.json` covers them. `npm run build` does not type-check test files.
- `e2e/vue.spec.ts` runs against the live remote API and asserts exact user-facing copy ("Feed your style. Enjoy the show.", "The catalogue did not load.", "Enter the Stage"). Changing that copy breaks the e2e suite — update both.
- No mocks/fixtures for the API; tests rely on real seeded data.

## Seeding admin data

`scripts/seed-admin-data.ps1` creates categories → products + images → variants + images → stock (via `POST .../inventory/movements` type `RESTOCK`, the only way to set quantity).

```bash
powershell -ExecutionPolicy Bypass -File scripts/seed-admin-data.ps1 -ProductsPerCategory 5 -ImageDir <folder-with-jpgs>
```

- Idempotent: existing categories and products are reused, and missing variant images/stock are backfilled.
- Images come from a folder of jpgs passed via `-ImageDir` (the working set currently lives outside the repo, e.g. `C:\Users\ferdinand\Downloads\img_temp`). It is not committed.
- PowerShell 5.1 traps: `$pid` is a reserved read-only variable (use `$prodId`), and `-f` formatting needs exactly one argument per placeholder.

## Git

- Branches: `main` plus `feature/*`; changes land via PR merge.
- `.gitignore` excludes `opencode.json`, `.agents/`, `.impeccable/`, `dist`, `test-results/`, `playwright-report/`.
