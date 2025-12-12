import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';
import { logger } from '../config';
import type { Estudiante } from '../types';
import { useWorkspaceTabs } from '../hooks';
import { sidebarSections } from '../config/workspaceSections';
import { LoadingState, ErrorState } from '../components/features/entrevista-workspace';

// Componentes del workspace
import { TopNavbar, Sidebar, TabManager } from '../components/features/interview-workspace';

export function EntrevistaWorkspace() {
  const navigate = useNavigate();
  const { id: estudianteId } = useParams();
  
  // ✅ ESTADOS: Workspace y datos
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ CUSTOM HOOK: Manejo de pestañas
  const {
    workspace,
    openTab,
    closeTab,
    focusTab,
    enableSplitView,
    disableSplitView,
    setActivePanel
  } = useWorkspaceTabs();

  // ✅ CARGAR DATOS: Estudiante al iniciar
  useEffect(() => {
    const loadEstudiante = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        
        // Cargar estudiante desde el backend
        const estudianteData = await apiService.getEstudiantePorId(estudianteId || '0');
        setEstudiante(estudianteData);
        
      } catch (error) {
        logger.error('Error al cargar estudiante:', error);
        setError('Error al cargar los datos del estudiante');
      } finally {
        setLoading(false);
      }
    };

    loadEstudiante();
  }, [estudianteId, navigate]);



  // ✅ ESTADOS DE CARGA
  if (loading) {
    return <LoadingState />;
  }

  if (error || !estudiante) {
    return <ErrorState error={error || 'Estudiante no encontrado'} onBack={() => navigate(-1)} />;
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.50' }}>
      {/* ✅ NAVBAR SUPERIOR */}
      <TopNavbar 
        estudiante={estudiante}
        onNavigateBack={() => navigate(-1)}
      />
      
      {/* ✅ ÁREA PRINCIPAL: Sidebar + Workspace */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', height: 'calc(100vh - 64px)', maxHeight: 'calc(100vh - 64px)' }}>
        {/* SIDEBAR IZQUIERDO */}
        <Sidebar 
          sections={sidebarSections}
          onSectionClick={openTab}
          activePanel={workspace.activePanel}
          splitViewActive={workspace.splitView}
        />
        
        {/* ÁREA DE PESTAÑAS */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: 'calc(100% - 280px)', maxWidth: 'calc(100% - 280px)', minWidth: 400, overflow: 'hidden' }}>
          <TabManager
            workspace={workspace}
            onCloseTab={closeTab}
            onFocusTab={focusTab}
            onEnableSplitView={enableSplitView}
            onDisableSplitView={disableSplitView}
            onSetActivePanel={setActivePanel}
            estudiante={estudiante}
          />
        </Box>
      </Box>
    </Box>
  );
}