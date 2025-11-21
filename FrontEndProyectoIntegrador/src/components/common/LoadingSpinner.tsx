import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

/**
 * Componente reutilizable para mostrar estado de carga
 * @param size - Tamaño del spinner (small, medium, large)
 * @param message - Mensaje opcional a mostrar
 * @param fullScreen - Si debe ocupar toda la pantalla
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message = 'Cargando...',
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center bg-gray-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className={`${sizeClasses[size]} mb-4 animate-pulse`}>⏳</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{message}</h2>
        <p className="text-gray-500 text-sm">Por favor espera...</p>
      </div>
    </div>
  );
};
