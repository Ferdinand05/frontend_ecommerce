# 🎪 Project Design Requirements: Bread & Circus E-Commerce

## 1. Project Overview

- **Project Name:** Bread & Circus
- **Tech Stack:** Vue.js 3 (Composition API), Tailwind CSS (Styling), Vite (Bundler).
- **Core Concept:** E-commerce fashion modern yang memadukan pakaian kasual esensial dengan estetika streetwear yang edgy, artsy, dan berkarakter.
- **Tagline:** _"Feed your style, enjoy the show."_

## 2. Target Audience & Theme

- **Demographic:** Gen Z dan Milenial, inklusif (Unisex / Gender-neutral).
- **Theme:** **"Editorial & Theatrical Streetwear"**. Tampilan menyerupai _magazine layout_ digital yang dinamis, asimetris, dan berani.

## 3. Design System (Tailwind Configuration)

Gunakan palet **'Bold & Bright'** yang memberikan kontras dinamis:

- **Primary (The Energy):** `#F44336` (CTA utama, sale tags, status alert, out of stock badge).
- **Secondary (The Art):** `#9C27B0` (Aksen, hover states, active variant border).
- **Tertiary (The Mystery):** `#673AB7` (Elemen dekoratif, background section khusus).
- **Background:** `#0F0F11` (Kesan streetwear gelap).
- **Surface:** `#F8F8F8` (Untuk section clean/basic).
- **Typography:** `Syne` atau `Clash Display` (Headings/Display) & `Inter` atau `Space Grotesk` (Body).

## 4. Backend Data Integration (JSON Mapping)

Aplikasi akan mengkonsumsi API (Detail by ID/Slug) dengan struktur data berikut. _AI Developer wajib membuat TypeScript interfaces (misal: `Product`, `Variant`, `Inventory`, `Image`) berdasarkan struktur ini untuk type safety._

```json
{
  "product": {
    "id": "uuid",
    "category_id": "uuid",
    "name": "string",
    "slug": "string",
    "description": "string",
    "is_active": true,
    "category": {
      "id": "uuid",
      "name": "string",
      "slug": "string"
    },
    "images": [
      {
        "id": "uuid",
        "url": "[http://example.com](http://example.com)",
        "alt": "string",
        "sort_order": 0
      }
    ],
    "variants": [
      {
        "id": "uuid",
        "sku": "string",
        "name": "string",
        "price": 0,
        "is_active": true,
        "weight_grams": 0,
        "inventory": {
          "quantity": 0,
          "reserved_quantity": 0
        },
        "images": [
          {
            "id": "uuid",
            "url": "[http://example.com](http://example.com)",
            "alt": "string",
            "sort_order": 0
          }
        ]
      }
    ],
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

## Docs

Dokumen referensi, jangan digunakan semua, gunakan sesuai tujuan dan kegunaannya.
TailwindCSS : <https://tailwindcss.com/docs/installation/using-vite>
Shadcn vue : sudah connect MCP
tanstack vue queries : <https://tanstack.com/query/latest/docs/framework/vue/guides/queries>
tanstack vue mutations :<https://tanstack.com/query/latest/docs/framework/vue/guides/mutations>
tanstack vue table : <https://tanstack.com/table/latest/docs/framework/vue/vue-table>
icons : <https://lucide.dev/icons/>
state management : <https://pinia.vuejs.org/core-concepts/> + plugin persisted state
