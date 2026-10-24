export interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  description?: string;
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  page_size: number;
}
