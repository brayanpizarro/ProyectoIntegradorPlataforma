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
    <div style={{
      width: '280px',
      backgroundColor: 'white',
      borderRight: '1px solid #e2e8f0',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      {/* ✅ TÍTULO DEL SIDEBAR */}
      <div style={{
        marginBottom: '1.5rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#1e293b'
        }}>
          📝 Etiquetas de Entrevista
        </h3>
        <p style={{
          margin: '0.25rem 0 0 0',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          Haz clic para abrir una pestaña
        </p>
        
        {/* ✅ INDICADOR DE PANEL ACTIVO */}
        {splitViewActive && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.5rem',
            backgroundColor: activePanel === 'left' ? '#dbeafe' : '#f0fdf4',
            border: `1px solid ${activePanel === 'left' ? '#3b82f6' : '#10b981'}`,
            borderRadius: '0.375rem',
            fontSize: '0.75rem'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: activePanel === 'left' ? '#1d4ed8' : '#166534',
              fontWeight: '500'
            }}>
              <span>{activePanel === 'left' ? '📋' : '📊'}</span>
              <span>Abrirá en panel {activePanel === 'left' ? 'izquierdo' : 'derecho'}</span>
            </div>
          </div>
        )}
      </div>

      {/* ✅ SECCIONES DE ETIQUETAS */}
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} style={{ marginBottom: '1.5rem' }}>
          {/* Título de sección */}
          <h4 style={{
            margin: '0 0 0.75rem 0',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {section.title}
          </h4>
          
          {/* Lista de etiquetas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionClick(item.id, item.title, item.type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  fontSize: '0.875rem',
                  color: '#374151'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                {/* Icono */}
                <span style={{
                  fontSize: '1.25rem',
                  width: '24px',
                  textAlign: 'center'
                }}>
                  {item.icon}
                </span>
                
                {/* Texto */}
                <span style={{ flex: 1, fontWeight: '500' }}>
                  {item.title}
                </span>
                
                {/* Indicador de tipo */}
                <span style={{
                  fontSize: '0.625rem',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '9999px',
                  backgroundColor: item.type === 'note' ? '#dbeafe' : '#f0fdf4',
                  color: item.type === 'note' ? '#1d4ed8' : '#166534',
                  fontWeight: '500'
                }}>
                  {item.type === 'note' ? 'NOTA' : 'DATA'}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* ✅ LEYENDA */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '0.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: '#64748b',
          marginBottom: '0.5rem',
          fontWeight: '500'
        }}>
          💡 Tipos de pestañas
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem'
          }}>
            <span style={{
              padding: '0.125rem 0.375rem',
              borderRadius: '9999px',
              backgroundColor: '#dbeafe',
              color: '#1d4ed8',
              fontWeight: '500'
            }}>
              NOTA
            </span>
            <span style={{ color: '#64748b' }}>Tomar apuntes de entrevista</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem'
          }}>
            <span style={{
              padding: '0.125rem 0.375rem',
              borderRadius: '9999px',
              backgroundColor: '#f0fdf4',
              color: '#166534',
              fontWeight: '500'
            }}>
              DATA
            </span>
            <span style={{ color: '#64748b' }}>Ver información del alumno</span>
          </div>
        </div>
      </div>
    </div>
  );
};