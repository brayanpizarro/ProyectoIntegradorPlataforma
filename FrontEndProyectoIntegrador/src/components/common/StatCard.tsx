import React from 'react';

interface StatCardProps {
  /** Icono o emoji a mostrar */
  icon: string;
  /** Título descriptivo de la estadística */
  label: string;
  /** Valor numérico o string de la estadística */
  value: string | number;
  /** Color de acento opcional */
  accentColor?: string;
  /** Clase CSS adicional opcional */
  className?: string;
}

/**
 * Tarjeta reutilizable para mostrar estadísticas
 * Usada en Dashboard y otras vistas de resumen
 * 
 * @example
 * ```tsx
 * <StatCard 
 *   icon="👥" 
 *   label="Total Estudiantes" 
 *   value={245} 
 * />
 * ```
 */
export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  accentColor,
  className = '',
}) => {
  return (
    <div 
      className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 ${className}`}
      role="region"
      aria-label={`${label}: ${value}`}
    >
      <div className="flex items-center gap-3">
        <div className="text-4xl" aria-hidden="true">{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p 
            className="text-3xl font-bold text-gray-900"
            style={accentColor ? { color: accentColor } : undefined}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};
