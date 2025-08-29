import React, { useState, useEffect } from 'react'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DraggableTable } from './components/DraggableTable';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Search } from './components/Search';
import { useItems, useReorderItems, useUpdateSelection, useUserState } from './hooks/useItems';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const AppContent: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const { data: userState } = useUserState();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useItems({
    search,
    sortBy: undefined,
    sortOrder: 'asc',
    limit: 20
  });

  const reorderItemsMutation = useReorderItems();
  const updateSelectionMutation = useUpdateSelection();

  useEffect(() => {
    if (userState) {
      setSelectedItems(new Set(userState.selectedItems));
    }
  }, [userState]);

  const handleSelectionChange = (itemId: number, selected: boolean) => {
    const newSelectedItems = new Set(selectedItems);
    if (selected) {
      newSelectedItems.add(itemId);
    } else {
      newSelectedItems.delete(itemId);
    }
    setSelectedItems(newSelectedItems);
    
    updateSelectionMutation.mutate({ itemId, selected });
  };

  const handleReorder = (_fromIndex: number, toIndex: number, itemId: number) => {
    reorderItemsMutation.mutate({
      toIndex,
      itemId
    });
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const items = data?.pages.flatMap(page => page.items) || [];
  const hasMore = hasNextPage || false;
  const isLoadingMore = isFetchingNextPage;



  if (error) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#dc3545'
      }}>
        Ошибка загрузки данных: {error.message}
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ width: '65%' }}>
          <Search
            search={search}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>
      
      <div style={{ 
        flex: 1, 
        padding: '20px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ width: '65%' }}>
                     <DraggableTable
             items={items}
             selectedItems={selectedItems}
             onSelectionChange={handleSelectionChange}
             onLoadMore={handleLoadMore}
             onReorder={handleReorder}
             hasMore={hasMore}
             isLoading={isLoading || isLoadingMore}
           />
           {isLoadingMore && (
             <div style={{ marginTop: '16px' }}>
               <LoadingSpinner />
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
