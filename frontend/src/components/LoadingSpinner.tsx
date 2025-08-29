import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '24px',
        height: '24px',
        border: '3px solid #f0f0f0',
        borderTop: '3px solid #4285f4',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};
