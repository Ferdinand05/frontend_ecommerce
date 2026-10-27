export interface PaginationMeta {
  total: number;
  page: number;
  page_size: number;
}

export interface RoleRef {
  id: string;
  name: string;
}

export interface AdminImage {
  id: string;
  url: string;
  alt: string;
  sort_order: number;
}

export interface AdminInventory {
  quantity: number;
  reserved_quantity: number;
}
