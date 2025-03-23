import React from 'react';
import { Toaster } from 'sonner';

interface ToastConfigProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  duration?: number;
}

const ToastConfig: React.FC<ToastConfigProps> = ({ 
  position = 'top-left',
  duration = 1500
}) => {
  return (
    <Toaster 
      position={position}
      toastOptions={{
        duration: duration,
        className: 'custom-toast',
        style: {
          fontSize: '0.875rem',
          maxWidth: '380px',
        }
      }}
      closeButton
    />
  );
};

export default ToastConfig;
