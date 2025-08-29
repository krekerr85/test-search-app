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
  selectedItems: Set<number>;
  sortOrder: number[];
  sessionId: string;
}

export interface SortRequest {
  itemId: number;
  newPosition: number;
}

export interface ReorderRequest {
  toIndex: number;
  itemId: number;
}
