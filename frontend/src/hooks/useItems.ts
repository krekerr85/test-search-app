import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { itemsApi } from '../api/client';
import { ItemsQuery, SortRequest, ReorderRequest } from '../types';

export const useItems = (query: ItemsQuery) => {
  return useInfiniteQuery({
    queryKey: ['items', query],
    queryFn: ({ pageParam = 0 }) => {
      return itemsApi.getItems({
        ...query,
        offset: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useUserState = () => {
  return useQuery({
    queryKey: ['userState'],
    queryFn: itemsApi.getUserState,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateSelection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, selected }: { itemId: number; selected: boolean }) =>
      itemsApi.updateSelection(itemId, selected),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userState'] });
    },
  });
};

export const useUpdateSortOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sortRequest: SortRequest) => itemsApi.updateSortOrder(sortRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userState'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useSetSortOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sortOrder: number[]) => itemsApi.setSortOrder(sortOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userState'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useReorderItems = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (reorderRequest: ReorderRequest) => itemsApi.reorderItems(reorderRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userState'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useItemsCount = () => {
  return useQuery({
    queryKey: ['itemsCount'],
    queryFn: itemsApi.getCount,
    staleTime: 1000 * 60 * 10,
  });
};
