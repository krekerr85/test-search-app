export interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  createdAt: string;
}

export interface ItemsResponse {
  items: Item[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}

export interface ItemsQuery {
  offset?: number;
  limit?: number;
  search?: string;
  sortBy?: keyof Item;
  sortOrder?: 'asc' | 'desc';
}

export interface UserState {
  selectedItems: number[];
  sortOrder: number[];
}

export interface SortRequest {
  itemId: number;
  newPosition: number;
}

// Новые типы для drag & drop
export interface DragEndEvent {
  active: {
    id: string | number;
  };
  over: {
    id: string | number;
  } | null;
}

export interface ReorderRequest {
  toIndex: number;
  itemId: number;
}
