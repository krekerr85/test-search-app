import React from 'react';
import { Item } from '../types';

interface RowProps {
  item: Item;
  isSelected: boolean;
  onSelectionChange: (itemId: number, selected: boolean) => void;
  style?: React.CSSProperties;
}

export const Row: React.FC<RowProps> = ({ item, isSelected, onSelectionChange, style }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectionChange(item.id, e.target.checked);
  };

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: isSelected ? '#f5f5f5' : 'white',
        ...style
      }}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleCheckboxChange}
        style={{ marginRight: '12px' }}
      />
      <div style={{ flex: 1, display: 'flex', gap: '16px' }}>
        <div style={{ width: '200px', fontWeight: 'bold' }}>{item.name}</div>
        <div style={{ flex: 1 }}>{item.description}</div>
        <div style={{ width: '120px' }}>{item.category}</div>
        <div style={{ width: '100px', textAlign: 'right' }}>
          {item.price.toLocaleString()} ₽
        </div>
        <div style={{ width: '120px' }}>
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
