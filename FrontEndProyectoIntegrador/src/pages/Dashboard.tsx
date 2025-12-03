import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';
import { logger } from '../config';
import { LoadingSpinner, ErrorMessage, StatCard } from '../components/common';
import { 
  DashboardNavbar, 
  FilterPanel, 
  GenerationsGrid, 
  QuickActionsPanel,
  CreateGeneracionModal,
  CreateEstudianteModal
} from '../components/Dashboard';
import type { Estudiante, EstadisticasAdmin } from '../types';

interface DashboardProps {
  onAuthChange?: (authenticated: boolean) => void;
}

interface GeneracionCalculada {
  año: number;
  estudiantes: number;
  activos: number;
  estado: 'activa' | 'finalizada';
  estudiantesData: Estudiante[];
}

export const Dashboard: React.FC<DashboardProps> = ({ onAuthChange }) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<any>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todas' | 'activas' | 'finalizadas'>('todas');
  const [ordenarPor, setOrdenarPor] = useState<'año' | 'estudiantes'>('año');

  const [estadisticas, setEstadisticas] = useState<EstadisticasAdmin | null>(null);
  const [generaciones, setGeneraciones] = useState<GeneracionCalculada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para modales
  const [openCreateGeneracion, setOpenCreateGeneracion] = useState(false);
  const [openCreateEstudiante, setOpenCreateEstudiante] = useState(false);
  const [selectedGeneracion, setSelectedGeneracion] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const user = await authService.getCurrentUser();
        setUsuario(user);

        try {
          logger.log('📊 Cargando datos del backend...');

          const [estudiantesData, estadisticasData] = await Promise.all([
            apiService.getEstudiantes(),
            apiService.getEstadisticas()
          ]);
          setEstadisticas(estadisticasData);
          const generacionesCalculadas = calcularGeneracionesDesdeEstudiantes(estudiantesData);
          setGeneraciones(generacionesCalculadas);

          logger.log('✅ Datos del backend cargados exitosamente');

        } catch (apiError) {
          logger.error('❌ Error al cargar datos del backend:', apiError);
          setError('No se pudo conectar con el backend. Verifica que esté corriendo.');
          setGeneraciones([]);
        }

      } catch (error) {
        logger.error('Error al cargar datos:', error);
        setError('Error al cargar los datos del dashboard');
        setGeneraciones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const calcularGeneracionesDesdeEstudiantes = (estudiantesData: Estudiante[]): GeneracionCalculada[] => {
    const estudiantesPorAño = estudiantesData.reduce((acc, estudiante) => {
      const año =
        estudiante.institucion?.anio_de_ingreso ||
        estudiante.año_generacion?.toString() ||
        estudiante.año_ingreso?.toString() ||
        '2024';

      const añoNum = parseInt(año.toString());

      if (!acc[añoNum]) {
        acc[añoNum] = [];
      }
      acc[añoNum].push(estudiante);
      return acc;
    }, {} as Record<number, Estudiante[]>);

    return Object.entries(estudiantesPorAño)
      .map(([año, estudiantesAño]) => {
        const añoNum = parseInt(año);
        const currentYear = new Date().getFullYear();

        const activos = estudiantesAño.filter(e =>
          e.informacionAcademica?.status_actual === 'Activo' ||
          e.estado === 'Activo' ||
          e.tipo_de_estudiante === 'universitario'
        ).length;

        return {
          año: añoNum,
          estudiantes: estudiantesAño.length,
          activos,
          estado: (añoNum >= currentYear - 2 ? 'activa' : 'finalizada') as 'activa' | 'finalizada',
          estudiantesData: estudiantesAño
        };
      })
      .sort((a, b) => b.año - a.año);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();

      if (onAuthChange) {
        onAuthChange(false);
      }

      navigate('/');
    } catch (error) {
      logger.error('❌ Error al cerrar sesión:', error);
    }
  };

  const handleCreateGeneracion = (año: number) => {
    // Navegar a la vista de la generación recién creada
    navigate(`/generacion/${año}`);
  };

  const handleAddEstudianteToGeneracion = (año: number) => {
    setSelectedGeneracion(año);
    setOpenCreateEstudiante(true);
  };

  const handleEstudianteCreated = async () => {
    // Recargar datos después de crear estudiante
    setLoading(true);
    try {
      const [estudiantesData, estadisticasData] = await Promise.all([
        apiService.getEstudiantes(),
        apiService.getEstadisticas()
      ]);
      setEstadisticas(estadisticasData);
      const generacionesCalculadas = calcularGeneracionesDesdeEstudiantes(estudiantesData);
      setGeneraciones(generacionesCalculadas);
      logger.log('✅ Datos actualizados exitosamente');
    } catch (error) {
      logger.error('Error al recargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const generacionesFiltradas = generaciones.filter(generacion => {
    const coincideBusqueda = busqueda === '' ||
      generacion.año.toString().includes(busqueda);

    const coincideEstado = filtroEstado === 'todas' ||
      (filtroEstado === 'activas' && generacion.estado === 'activa') ||
      (filtroEstado === 'finalizadas' && generacion.estado === 'finalizada');

    return coincideBusqueda && coincideEstado;
  });

  const generacionesOrdenadas = [...generacionesFiltradas].sort((a, b) => {
    if (ordenarPor === 'año') {
      return b.año - a.año;
    } else {
      return b.estudiantes - a.estudiantes;
    }
  });

  const totalEstudiantes = estadisticas?.total_estudiantes ||
    generacionesOrdenadas.reduce((sum, gen) => sum + gen.estudiantes, 0);
  const totalActivos = generacionesOrdenadas.reduce((sum, gen) => sum + gen.activos, 0);

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('todas');
    setOrdenarPor('año');
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Cargando Dashboard..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        fullScreen 
        message={error} 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar usuario={usuario} onLogout={handleLogout} />

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Principal
          </h2>
          <p className="text-gray-500">
            Gestión de estudiantes por generaciones
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon="📚" 
            label="Total Generaciones" 
            value={generaciones.length} 
          />
          <StatCard 
            icon="👥" 
            label="Total Estudiantes" 
            value={totalEstudiantes} 
          />
          <StatCard 
            icon="✅" 
            label="Estudiantes Activos" 
            value={totalActivos}
            accentColor="var(--color-turquoise)"
          />
        </div>

        {/* Filtros y Búsqueda */}
        <FilterPanel
          busqueda={busqueda}
          filtroEstado={filtroEstado}
          ordenarPor={ordenarPor}
          resultadosCount={generacionesOrdenadas.length}
          onBusquedaChange={setBusqueda}
          onFiltroEstadoChange={setFiltroEstado}
          onOrdenarPorChange={setOrdenarPor}
          onLimpiarFiltros={limpiarFiltros}
        />

        {/* Generaciones Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Generaciones
            </h3>
            <button
              onClick={() => setOpenCreateGeneracion(true)}
              className="bg-[var(--color-turquoise)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-turquoise-light)] transition-colors text-sm font-medium"
            >
              + Nueva Generación
            </button>
          </div>

          <GenerationsGrid 
            generaciones={generacionesOrdenadas}
            onLimpiarFiltros={limpiarFiltros}
            onAddEstudiante={handleAddEstudianteToGeneracion}
          />
        </div>

        {/* Acciones Rápidas */}
        <QuickActionsPanel />
      </div>

      {/* Modales */}
      <CreateGeneracionModal
        open={openCreateGeneracion}
        onClose={() => setOpenCreateGeneracion(false)}
        onSuccess={handleCreateGeneracion}
      />

      {selectedGeneracion && (
        <CreateEstudianteModal
          open={openCreateEstudiante}
          onClose={() => {
            setOpenCreateEstudiante(false);
            setSelectedGeneracion(null);
          }}
          onSuccess={handleEstudianteCreated}
          generacion={selectedGeneracion}
        />
      )}
    </div>
  );
};
