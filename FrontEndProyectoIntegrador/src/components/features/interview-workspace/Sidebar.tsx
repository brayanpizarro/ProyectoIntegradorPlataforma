import React from 'react';

interface SidebarSection {
  title: string;
  items: Array<{
    id: string;
    title: string;
    icon: string;
    type: 'note' | 'data';
  }>;
}

interface SidebarProps {
  sections: SidebarSection[];
  onSectionClick: (sectionId: string, sectionTitle: string, type: 'note' | 'data') => void;
  activePanel?: 'left' | 'right';
  splitViewActive?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sections, 
  onSectionClick, 
  activePanel = 'left',
  splitViewActive = false 
}) => {
  return (
    <div className="w-[280px] min-w-[280px] max-w-[280px] bg-white border-r border-gray-200 p-4 overflow-y-auto flex-shrink-0">
      {/* ✅ TÍTULO DEL SIDEBAR */}
      <div className="mb-6 pb-3 border-b border-gray-200">
        <h3 className="m-0 text-lg font-semibold text-gray-800">
          📝 Etiquetas de Entrevista
        </h3>
        <p className="mt-1 mb-0 text-xs text-gray-500">
          Haz clic para abrir una pestaña
        </p>
        
        {/* ✅ INDICADOR DE PANEL ACTIVO */}
        {splitViewActive && (
          <div className={`mt-3 p-2 ${activePanel === 'left' ? 'bg-[var(--color-turquoise)]/10 border-[var(--color-turquoise)]' : 'bg-[var(--color-orange)]/10 border-[var(--color-orange)]'} border rounded-md text-xs`}>
            <div className={`flex items-center gap-2 ${activePanel === 'left' ? 'text-[var(--color-turquoise)]' : 'text-[var(--color-orange)]'} font-medium`}>
              <span>{activePanel === 'left' ? '📋' : '📊'}</span>
              <span>Abrirá en panel {activePanel === 'left' ? 'izquierdo' : 'derecho'}</span>
            </div>
          </div>
        )}
      </div>

      {/* ✅ SECCIONES DE ETIQUETAS */}
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-6">
          {/* Título de sección */}
          <h4 className="m-0 mb-3 text-sm font-medium text-gray-600 uppercase tracking-wide">
            {section.title}
          </h4>
          
          {/* Lista de etiquetas */}
          <div className="flex flex-col gap-1">
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionClick(item.id, item.title, item.type)}
                className="flex items-center gap-3 p-3 bg-transparent border-none rounded-lg cursor-pointer text-left transition-all duration-200 text-sm text-gray-700 hover:bg-gray-100 hover:translate-x-0.5"
              >
                {/* Icono */}
                <span className="text-xl w-6 text-center">
                  {item.icon}
                </span>
                
                {/* Texto */}
                <span className="flex-1 font-medium">
                  {item.title}
                </span>
                
                {/* Indicador de tipo */}
                <span className={`text-[0.625rem] px-1.5 py-0.5 rounded-full font-medium ${item.type === 'note' ? 'bg-[var(--color-turquoise)]/20 text-[var(--color-turquoise)]' : 'bg-[var(--color-orange)]/20 text-[var(--color-orange)]'}`}>
                  {item.type === 'note' ? 'NOTA' : 'DATA'}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* ✅ LEYENDA */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs text-gray-500 mb-2 font-medium">
          💡 Tipos de pestañas
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-1.5 py-0.5 rounded-full bg-[var(--color-turquoise)]/20 text-[var(--color-turquoise)] font-medium">
              NOTA
            </span>
            <span className="text-gray-500">Tomar apuntes de entrevista</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-1.5 py-0.5 rounded-full bg-[var(--color-orange)]/20 text-[var(--color-orange)] font-medium">
              DATA
            </span>
            <span className="text-gray-500">Ver información del alumno</span>
          </div>
        </div>
      </div>
    </div>
  );
};