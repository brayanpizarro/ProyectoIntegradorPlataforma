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
    isSplitView: boolean;
  }> = ({ tabs, panelId, isActive, isSplitView }) => {
    const activeTab = tabs.find(tab => tab.isActive);

    return (
      <div 
        className={`flex-1 flex flex-col ${isActive ? 'border-2 border-blue-500' : 'border border-gray-200'} rounded-lg bg-white overflow-hidden ${isSplitView ? 'min-w-[300px] max-w-[calc(50%-0.5rem)]' : 'w-full'} h-full`}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (!target.matches('input, textarea, button, input *, textarea *, button *')) {
            onSetActivePanel(panelId);
          }
        }}
      >
        {/* ✅ HEADER DEL PANEL */}
        <div className={`flex items-center justify-between ${isActive ? 'bg-blue-50' : 'bg-gray-50'} border-b border-gray-200 px-3 py-2 text-xs font-medium ${isActive ? 'text-blue-800' : 'text-gray-500'}`}>
          <div className="flex items-center gap-2">
            <span>{panelId === 'left' ? '📋' : '📊'}</span>
            <span>Panel {panelId === 'left' ? 'Izquierdo' : 'Derecho'}</span>
            {isActive && <span className="text-emerald-500">● Activo</span>}
          </div>
        </div>

        {/* ✅ BARRA DE PESTAÑAS */}
        <div className="tabs-scrollbar flex items-center bg-gray-50 border-b border-gray-200 px-2 h-12 min-h-[48px] max-h-[48px] gap-1 overflow-x-auto overflow-y-hidden max-w-full flex-shrink-0">
          {tabs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic p-4">
              {panelId === 'left' ? 
                '📋 Selecciona una etiqueta del sidebar' : 
                '📊 Haz clic aquí para activar este panel'
              }
            </div>
          ) : (
            <>
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => {
                    onFocusTab(tab.id);
                    onSetActivePanel(panelId);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 ${tab.isActive ? 'bg-white border border-gray-200 border-b-white' : 'bg-transparent border border-transparent'} rounded-t-md cursor-pointer text-sm ${tab.isActive ? 'text-gray-800 font-medium' : 'text-gray-500'} ${tab.isActive ? '-mb-px z-10' : ''} max-w-[150px] min-w-[100px] relative flex-shrink-0`}
                >
                  <span className="text-sm flex-shrink-0">
                    {tab.type === 'note' ? '📝' : '📊'}
                  </span>
                  
                  <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                    {tab.title}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className="w-3.5 h-3.5 rounded-full border-none bg-transparent text-gray-400 cursor-pointer text-[10px] flex items-center justify-center p-0 flex-shrink-0 hover:bg-red-100 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {!workspace.splitView && panelId === 'left' && tabs.length > 0 && (
                <button
                  onClick={onEnableSplitView}
                  className="ml-auto p-1.5 bg-transparent border border-gray-300 rounded-md text-gray-500 cursor-pointer text-xs flex-shrink-0"
                  title="Dividir vista"
                >
                  ⧉
                </button>
              )}
            </>
          )}
        </div>

        {/* ✅ CONTENIDO DE LA PESTAÑA ACTIVA */}
        <div className="flex-1 overflow-auto h-full max-h-[calc(100%-96px)]">
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
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
              <span>Selecciona una pestaña</span>
              {panelId === 'right' && (
                <span className="text-xs text-center">
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
    <div className="flex-1 flex flex-col p-4 gap-4 h-full max-h-full overflow-hidden">
      {/* ✅ CONTROLES DE VISTA */}
      {workspace.splitView && (
        <div className="flex items-center justify-between p-3 bg-cyan-50 border border-cyan-600 rounded-lg text-sm h-12 min-h-[48px] max-h-[48px] flex-shrink-0">
          <div className="flex items-center gap-2 text-cyan-900">
            <span>⧉</span>
            <span>Vista dividida activa</span>
          </div>
          
          <button
            onClick={onDisableSplitView}
            className="px-3 py-1.5 bg-white border border-cyan-600 rounded-md text-cyan-900 cursor-pointer text-xs font-medium"
          >
            Unir vista
          </button>
        </div>
      )}

      {/* ✅ ÁREA DE PESTAÑAS */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-[400px] w-full">
        <TabPanel
          tabs={workspace.leftTabs}
          panelId="left"
          isActive={workspace.activePanel === 'left'}
          isSplitView={workspace.splitView}
        />
        
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
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-xs text-gray-500 h-12 min-h-[48px] max-h-[48px] flex-shrink-0">
        <div className="flex items-center gap-4">
          <span>
            📋 {workspace.leftTabs.length + workspace.rightTabs.length} pestañas abiertas
          </span>
          {workspace.splitView && (
            <span>
              ⧉ Vista dividida: {workspace.leftTabs.length} izq. | {workspace.rightTabs.length} der.
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span>Panel activo:</span>
          <span className={`px-2 py-0.5 ${workspace.activePanel === 'left' ? 'bg-blue-50 text-blue-800' : 'bg-green-50 text-green-800'} rounded-full font-medium`}>
            {workspace.activePanel === 'left' ? 'Izquierdo' : 'Derecho'}
          </span>
        </div>
      </div>
    </div>
  );
};