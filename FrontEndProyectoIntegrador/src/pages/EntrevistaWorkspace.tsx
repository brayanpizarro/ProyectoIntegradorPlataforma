import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import type { Estudiante } from '../types';
import { encontrarEstudiantePorId } from '../data/mockData';

// Componentes del workspace
import { TopNavbar } from '../components/workspace/TopNavbar';
import { Sidebar } from '../components/workspace/Sidebar';
import { TabManager } from '../components/workspace/TabManager';

// ✅ INTERFACES: Sistema de pestañas y workspace
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

// ✅ ETIQUETAS DEL SIDEBAR: Configuración de secciones disponibles
const sidebarSections = [
  {
    title: 'Lista de temas',
    items: [
      { id: 'destacados', title: 'Destacados', icon: '⭐', type: 'note' as const },
      { id: 'pareja', title: 'Pareja', icon: '💕', type: 'note' as const },
      { id: 'amigos', title: 'Amigos', icon: '👥', type: 'note' as const },
      { id: 'familia', title: 'Familia', icon: '👨‍👩‍👧‍👦', type: 'note' as const },
      { id: 'estudios', title: 'Estudios', icon: '📚', type: 'note' as const },
      { id: 'trabajo', title: 'Trabajo', icon: '💼', type: 'note' as const },
      { id: 'metas', title: 'Metas', icon: '🎯', type: 'note' as const },
      { id: 'problemas', title: 'Problemas', icon: '⚠️', type: 'note' as const },
    ]
  },
  {
    title: 'Información importante',
    items: [
      { id: 'info-personal', title: 'Información Personal', icon: '👤', type: 'data' as const },
      { id: 'avance-academico', title: 'Avance Académico', icon: '📊', type: 'data' as const },
      { id: 'historial', title: 'Historial Académico', icon: '📋', type: 'data' as const },
      { id: 'familia-data', title: 'Información Familiar', icon: '🏠', type: 'data' as const },
    ]
  }
];

export const EntrevistaWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const { id: estudianteId } = useParams();
  
  // ✅ ESTADOS: Workspace y datos
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ ESTADO PRINCIPAL: Workspace con pestañas
  const [workspace, setWorkspace] = useState<WorkspaceState>({
    leftTabs: [],
    rightTabs: [],
    splitView: false,
    activePanel: 'left'
  });

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
        console.error('Error al cargar estudiante:', error);
        setError('Error al cargar los datos del estudiante');
      } finally {
        setLoading(false);
      }
    };

    loadEstudiante();
  }, [estudianteId, navigate]);

  // ✅ FUNCIONES: Manejo de pestañas
  const openTab = (sectionId: string, sectionTitle: string, type: 'note' | 'data') => {
    const tabId = `tab-${sectionId}`;
    
    // Verificar si la pestaña ya existe en algún panel
    const existsInLeft = workspace.leftTabs.some(tab => tab.id === tabId);
    const existsInRight = workspace.rightTabs.some(tab => tab.id === tabId);
    
    if (existsInLeft || existsInRight) {
      // Si ya existe, activarla
      focusTab(tabId);
      return;
    }
    
    // Crear nueva pestaña
    const newTab: Tab = {
      id: tabId,
      title: sectionTitle,
      type,
      isActive: true,
      content: type === 'note' ? { notes: [], newNote: '' } : null
    };
    
    // Determinar en qué panel agregar la pestaña
    const targetPanel = workspace.activePanel;
    
    setWorkspace(prev => ({
      ...prev,
      [targetPanel === 'left' ? 'leftTabs' : 'rightTabs']: [
        ...prev[targetPanel === 'left' ? 'leftTabs' : 'rightTabs'].map(tab => ({ ...tab, isActive: false })),
        newTab
      ]
    }));
  };

  const closeTab = (tabId: string) => {
    setWorkspace(prev => ({
      ...prev,
      leftTabs: prev.leftTabs.filter(tab => tab.id !== tabId),
      rightTabs: prev.rightTabs.filter(tab => tab.id !== tabId)
    }));
  };

  const focusTab = (tabId: string) => {
    setWorkspace(prev => {
      // Encontrar en qué panel está la pestaña
      const isInLeft = prev.leftTabs.some(tab => tab.id === tabId);
      const isInRight = prev.rightTabs.some(tab => tab.id === tabId);
      
      return {
        ...prev,
        // Solo actualizar el panel donde está la pestaña
        leftTabs: isInLeft ? 
          prev.leftTabs.map(tab => ({ ...tab, isActive: tab.id === tabId })) : 
          prev.leftTabs,
        rightTabs: isInRight ? 
          prev.rightTabs.map(tab => ({ ...tab, isActive: tab.id === tabId })) : 
          prev.rightTabs,
        // Cambiar el panel activo al panel donde está la pestaña
        activePanel: isInLeft ? 'left' : 'right'
      };
    });
  };

  const enableSplitView = () => {
    setWorkspace(prev => ({ ...prev, splitView: true }));
  };

  const disableSplitView = () => {
    setWorkspace(prev => ({
      ...prev,
      splitView: false,
      // Mover todas las pestañas del panel derecho al izquierdo
      leftTabs: [...prev.leftTabs, ...prev.rightTabs],
      rightTabs: []
    }));
  };

  // ✅ FUNCIÓN: Cambiar panel activo sin afectar pestañas
  const setActivePanel = (panel: 'left' | 'right') => {
    setWorkspace(prev => ({ ...prev, activePanel: panel }));
  };

  // ✅ ESTADOS DE CARGA
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h2>Cargando workspace...</h2>
          <p style={{ color: '#64748b' }}>Preparando entrevista</p>
        </div>
      </div>
    );
  }

  if (error || !estudiante) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2>Error al cargar</h2>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>{error}</p>
          <button 
            onClick={() => navigate(-1)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc'
    }}>
      {/* ✅ NAVBAR SUPERIOR */}
      <TopNavbar 
        estudiante={estudiante}
        onNavigateBack={() => navigate(-1)}
      />
      
      {/* ✅ ÁREA PRINCIPAL: Sidebar + Workspace */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* SIDEBAR IZQUIERDO */}
        <Sidebar 
          sections={sidebarSections}
          onSectionClick={openTab}
          activePanel={workspace.activePanel}
          splitViewActive={workspace.splitView}
        />
        
        {/* ÁREA DE PESTAÑAS */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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