import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

/**
 * Componente reutilizable para mostrar errores
 * @param title - Título del error
 * @param message - Mensaje descriptivo del error
 * @param onRetry - Función callback para reintentar
 * @param fullScreen - Si debe ocupar toda la pantalla
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = 'Error al cargar datos',
  message,
  onRetry,
  fullScreen = false
}) => {
  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center bg-gray-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            aria-label="Reintentar carga"
          >
            🔄 Reintentar
          </button>
        )}
      </div>
    </div>
  );
};
