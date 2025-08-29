import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Item } from '../types';

interface DraggableRowProps {
  item: Item;
  isSelected: boolean;
  onSelectionChange: (itemId: number, selected: boolean) => void;
  isGlobalDragging: boolean;
}

const DraggableRowComponent: React.FC<DraggableRowProps> = ({ 
  item,
  isSelected,
  onSelectionChange,
  isGlobalDragging
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });



  const dragStyle = {
    transform: isDragging 
      ? `translateY(${transform?.y || 0}px)` 
      : CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.9 : 1,
    cursor: isDragging ? 'grabbing' : 'default',
    zIndex: isDragging ? 5 : 'auto',
          position: isDragging ? 'relative' as const : 'static' as const,
          pointerEvents: isDragging ? 'none' as const : 'auto' as const,
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '20px 16px',
        borderBottom: '2px solid #f0f0f0',
        backgroundColor: isDragging ? '#f0f4ff' : (isHovered && !isGlobalDragging ? '#f0f4ff' : (isSelected ? '#f8f9ff' : 'white')),
        userSelect: 'none',
        willChange: isDragging ? 'transform' : 'auto',
        backfaceVisibility: 'hidden',
        minHeight: '90px',
        fontSize: '18px',
        fontWeight: '500',
        color: '#333',
        marginBottom: '8px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        ...dragStyle,
      }}
             onMouseEnter={() => !isDragging && !isGlobalDragging && setIsHovered(true)}
       onMouseLeave={() => !isDragging && !isGlobalDragging && setIsHovered(false)}
      {...attributes}
      {...listeners}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          marginRight: '16px',
          cursor: 'pointer',
          borderRadius: '4px',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f0f4ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelectionChange(item.id, e.target.checked);
          }}
          style={{
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            accentColor: '#4285f4',
            margin: 0,
            padding: 0
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      {item.id}
    </div>
  );
};

export const DraggableRow = React.memo(DraggableRowComponent);
