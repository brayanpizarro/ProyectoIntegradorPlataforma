import React from 'react';
import type { Estudiante } from '../../types';
import { NoteEditor } from './NoteEditor';
import { DataTable } from './DataTable';

// ✅ INTERFACES: Definición de tipos
interface Tab {
  id: string;
  title: string;
  type: 'note' | 'data';
  content?: any;
  isActive: boolean;
}

interface WorkspaceState {
  leftTabs: Tab[];
  rightTabs: Tab[];
  splitView: boolean;
  activePanel: 'left' | 'right';
}

interface TabManagerProps {
  workspace: WorkspaceState;
  onCloseTab: (tabId: string) => void;
  onFocusTab: (tabId: string) => void;
  onEnableSplitView: () => void;
  onDisableSplitView: () => void;
  onSetActivePanel: (panel: 'left' | 'right') => void;
  estudiante: Estudiante;
}

export const TabManager: React.FC<TabManagerProps> = ({
  workspace,
  onCloseTab,
  onFocusTab,
  onEnableSplitView,
  onDisableSplitView,
  onSetActivePanel,
  estudiante
}) => {

  // ✅ COMPONENTE: Panel de pestañas individual
  const TabPanel: React.FC<{
    tabs: Tab[];
    panelId: 'left' | 'right';
    isActive: boolean;
    isSplitView: boolean; // ✅ Pasar como prop
  }> = ({ tabs, panelId, isActive, isSplitView }) => {
    const activeTab = tabs.find(tab => tab.isActive);

    return (
      <div 
        style={{
          flex: isSplitView ? 1 : 1, // ✅ Flex para ocupar espacio disponible
          display: 'flex',
          flexDirection: 'column',
          border: isActive ? '2px solid #3b82f6' : '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          backgroundColor: 'white',
          overflow: 'hidden',
          minWidth: isSplitView ? '300px' : 'auto', // ✅ Ancho mínimo solo en split
          maxWidth: isSplitView ? 'calc(50% - 0.5rem)' : '100%', // ✅ Ancho máximo
          width: isSplitView ? 'auto' : '100%', // ✅ Ancho completo cuando no hay split
          height: '100%' // ✅ Altura fija
        }}
        onClick={(e) => {
          // Solo activar panel si el click no es en un input/textarea/button
          const target = e.target as HTMLElement;
          if (!target.matches('input, textarea, button, input *, textarea *, button *')) {
            onSetActivePanel(panelId);
          }
        }}
      >
        {/* ✅ HEADER DEL PANEL */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isActive ? '#eff6ff' : '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.5rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          color: isActive ? '#1d4ed8' : '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{panelId === 'left' ? '📋' : '📊'}</span>
            <span>Panel {panelId === 'left' ? 'Izquierdo' : 'Derecho'}</span>
            {isActive && <span style={{ color: '#10b981' }}>● Activo</span>}
          </div>
          
          {/* ✅ Indicador de drop zone durante drag */}
          {false && (
            <span style={{ 
              color: '#059669', 
              fontSize: '0.625rem',
              fontStyle: 'italic'
            }}>
              ⬇ Soltar aquí
            </span>
          )}
        </div>

        {/* ✅ BARRA DE PESTAÑAS */}
        <div 
          className="tabs-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 0.5rem',
            height: '48px', // ✅ Altura fija
            minHeight: '48px',
            maxHeight: '48px', // ✅ No se puede agrandar
            gap: '0.25rem',
            overflowX: 'auto', // ✅ Scroll horizontal cuando hay muchas pestañas
            overflowY: 'hidden', // ✅ Sin scroll vertical
            maxWidth: '100%',
            flexShrink: 0 // ✅ No se comprime
          }}
        >
          {tabs.length === 0 ? (
            // Placeholder cuando no hay pestañas
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: '0.875rem',
              fontStyle: 'italic',
              padding: '1rem'
            }}>
              {panelId === 'left' ? 
                '📋 Selecciona una etiqueta del sidebar' : 
                '📊 Haz clic aquí para activar este panel'
              }
            </div>
          ) : (
            <>
              {/* Tabs */}
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => {
                    onFocusTab(tab.id);
                    onSetActivePanel(panelId);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: tab.isActive ? 'white' : 'transparent',
                    border: tab.isActive ? '1px solid #e2e8f0' : '1px solid transparent',
                    borderBottom: tab.isActive ? '1px solid white' : '1px solid transparent',
                    borderRadius: '0.375rem 0.375rem 0 0',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: tab.isActive ? '500' : '400',
                    color: tab.isActive ? '#1e293b' : '#64748b',
                    marginBottom: tab.isActive ? '-1px' : '0',
                    zIndex: tab.isActive ? 1 : 0,
                    maxWidth: '150px', // ✅ Ancho máximo limitado
                    minWidth: '100px', // ✅ Ancho mínimo
                    position: 'relative',
                    flexShrink: 0 // ✅ No permitir que se compriman
                  }}
                >
                  {/* Icono según tipo */}
                  <span style={{ fontSize: '0.875rem', flexShrink: 0 }}>
                    {tab.type === 'note' ? '📝' : '📊'}
                  </span>
                  
                  {/* Título */}
                  <span style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '0.75rem'
                  }}>
                    {tab.title}
                  </span>
                  
                  {/* Botón cerrar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                      e.currentTarget.style.color = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#94a3b8';
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {/* Botón para split view (solo en panel izquierdo si no está activo) */}
              {!workspace.splitView && panelId === 'left' && tabs.length > 0 && (
                <button
                  onClick={onEnableSplitView}
                  style={{
                    marginLeft: 'auto',
                    padding: '0.375rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    flexShrink: 0
                  }}
                  title="Dividir vista"
                >
                  ⧉
                </button>
              )}
            </>
          )}
        </div>

        {/* ✅ CONTENIDO DE LA PESTAÑA ACTIVA */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto', // ✅ Scroll cuando el contenido es grande
          height: '100%',
          maxHeight: 'calc(100% - 96px)' // ✅ Altura fija (100% - header - tabs)
        }}>
          {activeTab ? (
            activeTab.type === 'note' ? (
              <NoteEditor
                tabId={activeTab.id}
                sectionTitle={activeTab.title}
                estudiante={estudiante}
              />
            ) : (
              <DataTable
                tabId={activeTab.id}
                sectionTitle={activeTab.title}
                estudiante={estudiante}
              />
            )
          ) : (
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: '0.875rem',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <span>Selecciona una pestaña</span>
              {panelId === 'right' && (
                <span style={{ fontSize: '0.75rem', textAlign: 'center' }}>
                  Haz clic aquí para activar este panel, luego usa el sidebar
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      gap: '1rem',
      height: '100%', // ✅ Altura completa del contenedor padre
      maxHeight: '100%', // ✅ No exceder altura del padre
      overflow: 'hidden' // ✅ Evitar que se agrande
    }}>
      {/* ✅ CONTROLES DE VISTA */}
      {workspace.splitView && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem',
          backgroundColor: '#e0f2fe',
          border: '1px solid #0891b2',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          height: '48px', // ✅ Altura fija
          minHeight: '48px',
          maxHeight: '48px',
          flexShrink: 0 // ✅ No se comprime
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#0c4a6e'
          }}>
            <span>⧉</span>
            <span>Vista dividida activa</span>
          </div>
          
          <button
            onClick={onDisableSplitView}
            style={{
              padding: '0.375rem 0.75rem',
              backgroundColor: 'white',
              border: '1px solid #0891b2',
              borderRadius: '0.375rem',
              color: '#0c4a6e',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}
          >
            Unir vista
          </button>
        </div>
      )}

      {/* ✅ ÁREA DE PESTAÑAS */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: '1rem',
        overflow: 'hidden',
        minHeight: '400px', // ✅ Altura mínima
        width: '100%' // ✅ Ancho completo
      }}>
        {/* Panel izquierdo (siempre presente) */}
        <TabPanel
          tabs={workspace.leftTabs}
          panelId="left"
          isActive={workspace.activePanel === 'left'}
          isSplitView={workspace.splitView}
        />
        
        {/* Panel derecho (solo en split view) */}
        {workspace.splitView && (
          <TabPanel
            tabs={workspace.rightTabs}
            panelId="right"
            isActive={workspace.activePanel === 'right'}
            isSplitView={workspace.splitView}
          />
        )}
      </div>

      {/* ✅ BARRA DE ESTADO */}
      <div style={{
        padding: '0.75rem',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: '#64748b',
        height: '48px', // ✅ Altura fija
        minHeight: '48px',
        maxHeight: '48px',
        flexShrink: 0 // ✅ No se comprime
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>
            📋 {workspace.leftTabs.length + workspace.rightTabs.length} pestañas abiertas
          </span>
          {workspace.splitView && (
            <span>
              ⧉ Vista dividida: {workspace.leftTabs.length} izq. | {workspace.rightTabs.length} der.
            </span>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>Panel activo:</span>
          <span style={{
            padding: '0.125rem 0.5rem',
            backgroundColor: workspace.activePanel === 'left' ? '#dbeafe' : '#f0fdf4',
            color: workspace.activePanel === 'left' ? '#1d4ed8' : '#166534',
            borderRadius: '9999px',
            fontWeight: '500'
          }}>
            {workspace.activePanel === 'left' ? 'Izquierdo' : 'Derecho'}
          </span>
        </div>
      </div>
    </div>
  );
};