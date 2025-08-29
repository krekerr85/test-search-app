import React, { useState, useCallback } from 'react';

interface SearchProps {
  onSearchChange: (search: string) => void;
  search: string;
}

export const Search: React.FC<SearchProps> = ({
  onSearchChange,
  search
}) => {
  const [searchValue, setSearchValue] = useState(search);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  }, [onSearchChange]);



  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <input
          type="text"
          placeholder="Поиск..."
          value={searchValue}
          onChange={handleSearchChange}
                     style={{
             width: '100%',
             padding: '16px 20px',
             border: '2px solid #e8eaed',
             borderRadius: '10px',
             fontSize: '16px',
             outline: 'none',
             transition: 'all 0.2s ease',
             backgroundColor: '#fafbfc',
             height: '56px',
             boxSizing: 'border-box'
           }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4285f4';
            e.target.style.backgroundColor = '#ffffff';
            e.target.style.boxShadow = '0 0 0 3px rgba(66, 133, 244, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e8eaed';
            e.target.style.backgroundColor = '#fafbfc';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
    </div>
  );
};
