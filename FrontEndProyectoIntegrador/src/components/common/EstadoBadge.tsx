import React from 'react';
import { getEstadoClasses } from '../../utils/estadoColors';

interface EstadoBadgeProps {
  estado: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Badge reutilizable para mostrar el estado de un estudiante
 * @param estado - Estado actual del estudiante
 * @param size - Tamaño del badge
 */
export const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado, size = 'medium' }) => {
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  return (
    <span 
      className={`${getEstadoClasses(estado)} ${sizeClasses[size]} rounded-lg font-semibold inline-block`}
      role="status"
      aria-label={`Estado: ${estado}`}
    >
      {estado}
    </span>
  );
};
