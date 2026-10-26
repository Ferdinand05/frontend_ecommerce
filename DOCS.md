# 🤖 AI System Instructions & Tech Stack Reference

**CRITICAL RULE FOR AI:** Do not hallucinate syntax, library versions, or API endpoints. You MUST use the provided official documentation links below as your primary source of truth. Sesuaikan penggunaan referensi dengan konteks tugas yang diberikan.

## 1. Frontend Core & Styling

- **Vue 3:** Wajib menggunakan _Composition API_ dengan sintaks `<script setup>`.
- **TailwindCSS (Vite Setup):** Gunakan utilitas bawaan Tailwind untuk _styling_. Hindari _custom CSS_ di dalam tag `<style>` kecuali sangat mendesak.
  - [Tailwind Vite Docs](https://tailwindcss.com/docs/installation/using-vite)
- **Shadcn Vue [MCP CONNECTED]:** Server MCP sudah terhubung. **Gunakan MCP tool Anda** untuk _scaffold_ atau memanggil komponen UI Shadcn. Jangan membuat komponen _accessible_ (seperti Dropdown, Modal, Select) dari nol jika Shadcn menyediakannya.
- **Icons:** Gunakan `lucide-vue-next`.
  - [Lucide Icons Directory](https://lucide.dev/icons/)

## 2. State Management & Data Fetching (Strict Separation)

AI harus memisahkan _Server State_ dan _Client State_ sesuai aturan berikut:

- **Server State (API Data):** Wajib menggunakan **TanStack Query (Vue)** untuk _fetching_, _caching_, dan sinkronisasi data dari backend. Jangan gunakan `ref` biasa dipadukan dengan `onMounted` untuk memanggil API.
  - [TanStack Vue Queries (GET)](https://tanstack.com/query/latest/docs/framework/vue/guides/queries)
  - [TanStack Vue Mutations (POST/PUT/DELETE)](https://tanstack.com/query/latest/docs/framework/vue/guides/mutations)
- **Client State (Global UI/Cart):** Gunakan **Pinia** dipadukan dengan plugin _persisted state_ HANYA untuk _state_ lokal (seperti _Cart items_, status _Login_, atau UI _toggles_).
  - [Pinia Core Concepts](https://pinia.vuejs.org/core-concepts/)
- **Data Grids:** Untuk tabel kompleks di User Dashboard (seperti _Order History_), gunakan **TanStack Vue Table**.
  - [TanStack Vue Table Docs](https://tanstack.com/table/latest/docs/framework/vue/vue-table)

## 3. API Documentation & Integration Protocol

**Official Swagger / OpenAPI URL:**
👉 <https://app.swaggerhub.com/apis/FKORYANTO/GO-BACKEND-ECOMMERCE/1.0.0>

**AI Action Protocol untuk Integrasi API:**

1. **Scout First:** Sebelum menulis fungsi _fetch_ atau TanStack Query, Anda **DIWAJIBKAN** untuk membaca dan menganalisis spesifikasi OpenAPI pada URL Swagger di atas.
2. **Type Safety:** Selalu buat _TypeScript Interfaces_ atau _Types_ yang secara presisi mencerminkan skema _Request Body_ dan _Response JSON_ dari Swagger sebelum membangun UI.
3. **Zero Assumptions:** Jangan pernah menebak atau berhalusinasi tentang URL _endpoint_, parameter, atau _key_ dari JSON _response_. Jika URL gagal diakses atau struktur data tidak jelas, Anda harus meminta pengguna untuk memberikan _sample JSON response_ dari _endpoint_ terkait.

## 4. Layouting & Router Architecture (STRICT WIRING RULE)

**CRITICAL:** JANGAN PERNAH menduplikasi komponen `Sidebar` atau `Header` di dalam setiap file _View_ (halaman). Terapkan arsitektur _Nested Routes_ Vue Router
Instruksi ini "mengunci" arsitektur AI agar wajib menggunakan satu Layout Parent dan menyuntikkan Child Views ke dalamnya.
Jadi jangan mendesign tiap view dari awal gunakan konsep DRY. jadi design parent kemudian wrapping/bungkus children, bungkus otomatis lewat vue router di /router
