/**
 * Navegación por pestañas del detalle de estudiante
 */
import React from 'react';

export type SeccionActiva = 'perfil' | 'personal' | 'familiar' | 'informe' | 'desempeno' | 'entrevistas';

interface TabNavigationProps {
  seccionActiva: SeccionActiva;
  onSeccionChange: (seccion: SeccionActiva) => void;
}

const tabs = [
  { id: 'perfil' as SeccionActiva, label: 'Perfil' },
  { id: 'personal' as SeccionActiva, label: 'Datos Personales' },
  { id: 'familiar' as SeccionActiva, label: 'Información Familiar' },
  { id: 'informe' as SeccionActiva, label: 'Informe Académico General' },
  { id: 'desempeno' as SeccionActiva, label: 'Desempeño por Semestre' },
  { id: 'entrevistas' as SeccionActiva, label: 'Entrevistas' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  seccionActiva, 
  onSeccionChange 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-8">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => onSeccionChange(tab.id)} 
            className={`px-6 py-4 text-sm transition-all whitespace-nowrap ${
              seccionActiva === tab.id 
                ? 'bg-white text-emerald-500 border-b-2 border-emerald-500 font-semibold' 
                : 'bg-transparent text-gray-600 border-b-2 border-transparent hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
