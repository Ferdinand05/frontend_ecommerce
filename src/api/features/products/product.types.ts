// {
//   "products": [
//     {
//       "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
//       "category_id": "8de4c9fd-61a4-4c0b-bf88-0ed3a0fe3fa2",
//       "name": "string",
//       "slug": "string",
//       "description": "string",
//       "is_active": true,
//       "category": {
//         "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
//         "name": "string",
//         "slug": "string"
//       },
//       "images": [
//         {
//           "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
//           "url": "http://example.com",
//           "alt": "string",
//           "sort_order": 0
//         }
//       ],
//       "variants": [
//         {
//           "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
//           "sku": "string",
//           "name": "string",
//           "price": 0,
//           "is_active": true
//         }
//       ],
//       "created_at": "2019-08-24T14:15:22Z",
//       "updated_at": "2019-08-24T14:15:22Z"
//     }
//   ]
// }

import type { Category } from "../categories/category.types";

export interface Image {
  id: string;
  url: string;
  alt: string;
  sort_order: number;
}

export interface Inventory {
  quantity: number;
  reserved_quantity: number;
}

export interface Variant {
  id: string;
  sku: string;
  name: string;
  price: number;
  is_active: boolean;
  weight_grams: number;
  inventory?: Inventory;
  images?: Image[];
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  price: string;
  description?: string;
  is_active: boolean;
  category: Category;
  images: Image[];
  inventory: Inventory;
  variants?: Variant[];
  created_at: string;
}

export interface ProductsResponse {
  products: Product[];
  total?: number;
  page?: number;
  page_size?: number;
}

export interface ProductDetailResponse {
  product: Product;
}
