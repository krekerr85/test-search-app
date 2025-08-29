import React, { useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Row } from './Row';
import { Item } from '../types';

interface TableProps {
  items: Item[];
  selectedItems: Set<number>;
  onSelectionChange: (itemId: number, selected: boolean) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const ITEM_HEIGHT = 60; // Высота одной строки

export const Table: React.FC<TableProps> = ({
  items,
  selectedItems,
  onSelectionChange,
  onLoadMore,
  hasMore,
  isLoading
}) => {
  const handleScroll = useCallback(({ scrollOffset, scrollUpdateWasRequested }: any) => {
    if (!scrollUpdateWasRequested && hasMore && !isLoading) {
      const maxScrollOffset = items.length * ITEM_HEIGHT - 600; // 600px - примерная высота видимой области
      if (scrollOffset >= maxScrollOffset) {
        onLoadMore();
      }
    }
  }, [hasMore, isLoading, items.length, onLoadMore]);

  const RowComponent = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = items[index];
    if (!item) return null;

    return (
      <Row
        item={item}
        isSelected={selectedItems.has(item.id)}
        onSelectionChange={onSelectionChange}
        style={style}
      />
    );
  }, [items, selectedItems, onSelectionChange]);

  const listHeight = useMemo(() => {
    return Math.min(items.length * ITEM_HEIGHT, 600);
  }, [items.length]);

  return (
    <div style={{ height: '600px', overflow: 'hidden' }}>
      <List
        height={listHeight}
        itemCount={items.length}
        itemSize={ITEM_HEIGHT}
        onScroll={handleScroll}
        width="100%"
      >
        {RowComponent}
      </List>
      
      {isLoading && (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#666'
        }}>
          Загрузка...
        </div>
      )}
      
      {!hasMore && items.length > 0 && (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#666'
        }}>
          Все элементы загружены
        </div>
      )}
    </div>
  );
};
