import React, { useCallback, useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableRow } from './DraggableRow';
import { SkeletonRow } from './SkeletonRow';
import { LoadingSpinner } from './LoadingSpinner';
import { Item } from '../types';

interface DraggableTableProps {
  items: Item[];
  selectedItems: Set<number>;
  onSelectionChange: (itemId: number, selected: boolean) => void;
  onLoadMore: () => void;
  onReorder: (fromIndex: number, toIndex: number, itemId: number) => void;
  hasMore: boolean;
  isLoading: boolean;
}



const DraggableTableComponent: React.FC<DraggableTableProps> = ({
  items,
  selectedItems,
  onSelectionChange,
  onLoadMore,
  onReorder,
  hasMore,
  isLoading
}) => {
  const [localItems, setLocalItems] = useState<Item[]>(items);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (items.length !== localItems.length || localItems.length === 0) {
      setLocalItems(items);
    }
  }, [items, localItems.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
      delay: 100,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !isLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      onLoadMore();
      setTimeout(() => setIsLoadingMore(false), 1000);
    }
  }, [hasMore, isLoading, isLoadingMore, onLoadMore]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localItems.findIndex(item => item.id === active.id);
      const newIndex = localItems.findIndex(item => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newItems = arrayMove(localItems, oldIndex, newIndex);
        setLocalItems(newItems);
        
        setTimeout(() => {
          onReorder(oldIndex, newIndex, Number(active.id));
        }, 0);
      }
    }
  }, [localItems, onReorder]);

  return (
    <div 
      style={{ 
        height: 'calc(100vh - 200px)', 
        overflow: 'auto',
        overflowX: 'hidden',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        position: 'relative',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '100%'
      }}
      onScroll={handleScroll}
    >
                     <div style={{ padding: '0 0 32px 0' }}>
          {isLoading && localItems.length === 0 ? (
            Array.from({ length: 10 }).map((_, index) => (
              <SkeletonRow key={`skeleton-${index}`} />
            ))
          ) : (
           <DndContext
             sensors={sensors}
             collisionDetection={closestCenter}
             onDragEnd={handleDragEnd}
           >
             <SortableContext
               items={localItems.map(item => item.id)}
               strategy={verticalListSortingStrategy}
             >
                                                     {localItems.map((item) => (
                   <DraggableRow
                     key={`${item.id}-${localItems.indexOf(item)}`}
                     item={item}
                     isSelected={selectedItems.has(item.id)}
                     onSelectionChange={onSelectionChange}
                   />
                 ))}
             </SortableContext>
           </DndContext>
                   )}
          
          {isLoadingMore && <LoadingSpinner />}
       </div>
      
             {!hasMore && localItems.length > 0 && !isLoading && (
         <div style={{
           padding: '20px',
           textAlign: 'center',
           color: '#666',
           borderTop: '1px solid #e0e0e0',
           marginBottom: '16px'
         }}>
           Все элементы загружены
         </div>
               )}
      </div>
    );
  };

export const DraggableTable = React.memo(DraggableTableComponent);
