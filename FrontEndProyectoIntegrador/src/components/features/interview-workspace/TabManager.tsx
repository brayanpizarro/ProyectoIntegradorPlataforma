import { Box, Paper, IconButton, Button, Chip, Typography, Alert } from '@mui/material';
import { Close as CloseIcon, ViewColumn as ViewColumnIcon } from '@mui/icons-material';
import type { Estudiante } from '../../../types';
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

export function TabManager({
  workspace,
  onCloseTab,
  onFocusTab,
  onEnableSplitView,
  onDisableSplitView,
  onSetActivePanel,
  estudiante
}: TabManagerProps) {

  // ✅ COMPONENTE: Panel de pestañas individual
  function TabPanel({
    tabs,
    panelId,
    isActive,
    isSplitView
  }: {
    tabs: Tab[];
    panelId: 'left' | 'right';
    isActive: boolean;
    isSplitView: boolean;
  }) {
    const activeTab = tabs.find(tab => tab.isActive);

    return (
      <Paper 
        elevation={isActive ? 3 : 1}
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          border: isActive ? 2 : 1, 
          borderColor: isActive ? 'primary.main' : 'grey.200', 
          borderRadius: 2, 
          overflow: 'hidden',
          ...(isSplitView && { minWidth: 300, maxWidth: 'calc(50% - 8px)' }),
          height: '100%'
        }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (!target.matches('input, textarea, button, input *, textarea *, button *')) {
            onSetActivePanel(panelId);
          }
        }}
      >
        {/* ✅ HEADER DEL PANEL */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          bgcolor: isActive ? 'primary.light' : 'grey.50', 
          borderBottom: 1, 
          borderColor: 'grey.200', 
          px: 2, 
          py: 1 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" fontWeight={600}>
              {panelId === 'left' ? '📋' : '📊'} Panel {panelId === 'left' ? 'Izquierdo' : 'Derecho'}
            </Typography>
            {isActive && <Chip label="● Activo" size="small" sx={{ height: 18, bgcolor: 'primary.main', color: 'white' }} />}
          </Box>
        </Box>

        {/* ✅ BARRA DE PESTAÑAS */}
        <Box sx={{ bgcolor: 'grey.50', borderBottom: 1, borderColor: 'grey.200', height: 48, minHeight: 48, maxHeight: 48, display: 'flex', alignItems: 'center', px: 1, gap: 0.5, overflowX: 'auto', overflowY: 'hidden' }}>
          {tabs.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1, textAlign: 'center', fontStyle: 'italic', py: 2 }}>
              {panelId === 'left' ? 
                '📋 Selecciona una etiqueta del sidebar' : 
                '📊 Haz clic aquí para activar este panel'
              }
            </Typography>
          ) : (
            <>
              {tabs.map((tab) => (
                <Box
                  key={tab.id}
                  onClick={() => {
                    onFocusTab(tab.id);
                    onSetActivePanel(panelId);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    bgcolor: tab.isActive ? 'white' : 'transparent',
                    border: tab.isActive ? 1 : 0,
                    borderColor: tab.isActive ? 'grey.200' : 'transparent',
                    borderBottom: tab.isActive ? 0 : 1,
                    borderRadius: '8px 8px 0 0',
                    cursor: 'pointer',
                    fontWeight: tab.isActive ? 600 : 400,
                    color: tab.isActive ? 'text.primary' : 'text.secondary',
                    maxWidth: 150,
                    minWidth: 100,
                    position: 'relative',
                    mb: tab.isActive ? '-1px' : 0,
                    zIndex: tab.isActive ? 10 : 1,
                    flexShrink: 0
                  }}
                >
                  <Typography sx={{ fontSize: '0.875rem', flexShrink: 0 }}>
                    {tab.type === 'note' ? '📝' : '📊'}
                  </Typography>
                  
                  <Typography variant="caption" noWrap sx={{ flex: 1 }}>
                    {tab.title}
                  </Typography>
                  
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    sx={{ 
                      width: 16, 
                      height: 16, 
                      p: 0,
                      '&:hover': { bgcolor: 'error.light', color: 'error.main' }
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 12 }} />
                  </IconButton>
                </Box>
              ))}
              
              {!workspace.splitView && panelId === 'left' && tabs.length > 0 && (
                <IconButton
                  size="small"
                  onClick={onEnableSplitView}
                  title="Dividir vista"
                  sx={{ ml: 'auto', flexShrink: 0 }}
                >
                  <ViewColumnIcon fontSize="small" />
                </IconButton>
              )}
            </>
          )}
        </Box>

        {/* ✅ CONTENIDO DE LA PESTAÑA ACTIVA */}
        <Box sx={{ flex: 1, overflow: 'auto', height: '100%', maxHeight: 'calc(100% - 96px)' }}>
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
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Selecciona una pestaña
              </Typography>
              {panelId === 'right' && (
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  Haz clic aquí para activar este panel, luego usa el sidebar
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    );
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, gap: 2, height: '100%', maxHeight: '100%', overflow: 'hidden' }}>
      {/* ✅ CONTROLES DE VISTA */}
      {workspace.splitView && (
        <Alert
          severity="info"
          icon={<ViewColumnIcon />}
          action={
            <Button size="small" variant="outlined" onClick={onDisableSplitView}>
              Unir vista
            </Button>
          }
          sx={{ height: 48, minHeight: 48, maxHeight: 48, flexShrink: 0 }}
        >
          Vista dividida activa
        </Alert>
      )}

      {/* ✅ ÁREA DE PESTAÑAS */}
      <Box sx={{ flex: 1, display: 'flex', gap: 2, overflow: 'hidden', minHeight: 400, width: '100%' }}>
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
      </Box>

      {/* ✅ BARRA DE ESTADO */}
      <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', border: 1, borderColor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48, minHeight: 48, maxHeight: 48, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography variant="caption" color="text.secondary">
            📋 {workspace.leftTabs.length + workspace.rightTabs.length} pestañas abiertas
          </Typography>
          {workspace.splitView && (
            <Typography variant="caption" color="text.secondary">
              ⧉ Vista dividida: {workspace.leftTabs.length} izq. | {workspace.rightTabs.length} der.
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">Panel activo:</Typography>
          <Chip
            label={workspace.activePanel === 'left' ? 'Izquierdo' : 'Derecho'}
            size="small"
            sx={{
              height: 20,
              fontWeight: 600,
              bgcolor: workspace.activePanel === 'left' ? 'info.light' : 'warning.light',
              color: workspace.activePanel === 'left' ? 'info.dark' : 'warning.dark'
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}