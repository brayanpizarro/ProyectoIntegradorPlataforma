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
  QuickActionsPanel 
} from '../components/Dashboard';
import type { Estudiante, EstadisticasAdmin } from '../types';

const mockGeneraciones = [
  { año: 2024, estudiantes: 45, activos: 42, estado: 'activa' as const },
  { año: 2023, estudiantes: 38, activos: 35, estado: 'activa' as const },
  { año: 2022, estudiantes: 41, activos: 38, estado: 'activa' as const },
  { año: 2021, estudiantes: 33, activos: 30, estado: 'activa' as const },
  { año: 2020, estudiantes: 29, activos: 25, estado: 'finalizada' as const },
  { año: 2019, estudiantes: 22, activos: 18, estado: 'finalizada' as const },
  { año: 2018, estudiantes: 35, activos: 31, estado: 'finalizada' as const },
];

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
          logger.warn('⚠️ Backend no disponible, usando datos mock');
          setGeneraciones(mockGeneraciones.map(g => ({
            ...g,
            estudiantesData: []
          })));
        }

      } catch (error) {
        logger.error('Error al cargar datos:', error);
        setError('Error al cargar los datos del dashboard');
        setGeneraciones(mockGeneraciones.map(g => ({
          ...g,
          estudiantesData: []
        })));
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
      <div className="p-8">
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
            value={mockGeneraciones.length} 
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
            accentColor="#10b981"
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">
              Generaciones
            </h3>
            <button
              onClick={() => {
                alert('Funcionalidad para crear nueva generación - Por implementar');
              }}
              className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              + Nueva Generación
            </button>
          </div>

          <GenerationsGrid 
            generaciones={generacionesOrdenadas}
            onLimpiarFiltros={limpiarFiltros}
          />
        </div>

        {/* Acciones Rápidas */}
        <QuickActionsPanel />
      </div>
    </div>
  );
};
