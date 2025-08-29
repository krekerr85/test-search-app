import axios from 'axios';
import { ItemsQuery, ItemsResponse, UserState, SortRequest, ReorderRequest } from '../types';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Генерируем уникальный sessionId для каждого пользователя
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Добавляем sessionId к каждому запросу
apiClient.interceptors.request.use((config) => {
  config.headers['x-session-id'] = getSessionId();
  return config;
});

export const itemsApi = {
  // Получение списка элементов
  getItems: async (query: ItemsQuery): Promise<ItemsResponse> => {
    const params = new URLSearchParams();
    if (query.offset !== undefined) params.append('offset', query.offset.toString());
    if (query.limit !== undefined) params.append('limit', query.limit.toString());
    if (query.search) params.append('search', query.search);
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);

    const response = await apiClient.get(`/items?${params.toString()}`);
    return response.data;
  },

  // Получение состояния пользователя
  getUserState: async (): Promise<UserState> => {
    const response = await apiClient.get('/items/state');
    return response.data;
  },

  // Обновление выбранных элементов
  updateSelection: async (itemId: number, selected: boolean): Promise<void> => {
    await apiClient.post('/items/select', { itemId, selected });
  },

  // Обновление порядка сортировки (Drag&Drop)
  updateSortOrder: async (sortRequest: SortRequest): Promise<void> => {
    await apiClient.post('/items/sort', sortRequest);
  },

  // Установка полного порядка сортировки
  setSortOrder: async (sortOrder: number[]): Promise<void> => {
    await apiClient.post('/items/sort-order', { sortOrder });
  },

  // Новый метод для переупорядочивания элементов (Drag&Drop)
  reorderItems: async (reorderRequest: ReorderRequest): Promise<void> => {
    await apiClient.post('/items/reorder', reorderRequest);
  },

  // Получение общего количества элементов
  getCount: async (): Promise<{ total: number }> => {
    const response = await apiClient.get('/items/count');
    return response.data;
  },
};

export default apiClient;
