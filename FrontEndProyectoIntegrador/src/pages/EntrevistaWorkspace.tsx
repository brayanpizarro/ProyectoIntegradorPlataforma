import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { logger } from '../config';
import type { Estudiante } from '../types';
import { encontrarEstudiantePorId } from '../data/mockData';
import { useWorkspaceTabs } from '../hooks';
import { sidebarSections } from '../config/workspaceSections';
import { LoadingState, ErrorState } from '../components/EntrevistaWorkspace';

// Componentes del workspace
import { TopNavbar } from '../components/workspace/TopNavbar';
import { Sidebar } from '../components/workspace/Sidebar';
import { TabManager } from '../components/workspace/TabManager';

export const EntrevistaWorkspace: React.FC = () => {
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
        
        // ✅ Usar directamente datos mock (sin intentar backend)
        const estudianteEncontrado = encontrarEstudiantePorId(estudianteId || '0');
        
        if (estudianteEncontrado) {
          // ✅ Crear objeto simplificado solo con propiedades que SÍ existen en interface Estudiante
          const estudianteCompleto: Estudiante = {
            id: estudianteEncontrado.id,
            nombres: estudianteEncontrado.nombres,
            apellidos: estudianteEncontrado.apellidos,
            nombre: estudianteEncontrado.nombre || `${estudianteEncontrado.nombres} ${estudianteEncontrado.apellidos}`,
            rut: estudianteEncontrado.rut,
            email: estudianteEncontrado.email,
            telefono: estudianteEncontrado.telefono,
            direccion: estudianteEncontrado.direccion,
            id_estudiante: estudianteEncontrado.id_estudiante || estudianteEncontrado.id.toString(),
            tipo_de_estudiante: (estudianteEncontrado.tipo_de_estudiante as any) || 'UNIVERSITARIO',
            fecha_de_nacimiento: estudianteEncontrado.fecha_de_nacimiento || '',
            region: estudianteEncontrado.region || ''
          };
          
          setEstudiante(estudianteCompleto);
        } else {
          setError('Estudiante no encontrado');
        }
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
    <div className="h-screen flex flex-col bg-slate-50">
      {/* ✅ NAVBAR SUPERIOR */}
      <TopNavbar 
        estudiante={estudiante}
        onNavigateBack={() => navigate(-1)}
      />
      
      {/* ✅ ÁREA PRINCIPAL: Sidebar + Workspace */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)] max-h-[calc(100vh-64px)]">
        {/* SIDEBAR IZQUIERDO */}
        <Sidebar 
          sections={sidebarSections}
          onSectionClick={openTab}
          activePanel={workspace.activePanel}
          splitViewActive={workspace.splitView}
        />
        
        {/* ÁREA DE PESTAÑAS */}
        <div className="flex-1 flex flex-col w-[calc(100%-280px)] max-w-[calc(100%-280px)] min-w-[400px] overflow-hidden">
          <TabManager
            workspace={workspace}
            onCloseTab={closeTab}
            onFocusTab={focusTab}
            onEnableSplitView={enableSplitView}
            onDisableSplitView={disableSplitView}
            onSetActivePanel={setActivePanel}
            estudiante={estudiante}
          />
        </div>
      </div>
    </div>
  );
};