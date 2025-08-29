import React from 'react';

export const SkeletonRow: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '20px 16px',
        backgroundColor: 'white',
        userSelect: 'none',
        minHeight: '90px',
        marginBottom: '8px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: '60px',
          height: '24px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}
      />
      
      <style>
        {`
          @keyframes pulse {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};
