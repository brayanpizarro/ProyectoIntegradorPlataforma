import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, estadisticasService } from '../services';
import { apiService } from '../services/apiService';
import { logger } from '../config';
import { LoadingSpinner, ErrorMessage, StatCard } from '../components/ui';
import { 
  DashboardNavbar, 
  FilterPanel, 
  GenerationsGrid,
  CreateGeneracionModal,
  CreateEstudianteModal
} from '../components/features/dashboard';
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
  const [generacionesCreadas, setGeneracionesCreadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para modales
  const [openCreateGeneracion, setOpenCreateGeneracion] = useState(false);
  const [openCreateEstudiante, setOpenCreateEstudiante] = useState(false);
  const [selectedGeneracion, setSelectedGeneracion] = useState<number | null>(null);

  useEffect(() => {
    // Cargar generaciones creadas del localStorage
    const generacionesGuardadas = localStorage.getItem('generaciones_creadas');
    if (generacionesGuardadas) {
      try {
        setGeneracionesCreadas(JSON.parse(generacionesGuardadas));
      } catch (error) {
        console.error('Error al cargar generaciones del localStorage:', error);
      }
    }

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
            estadisticasService.getDashboard()
          ]);
          setEstadisticas(estadisticasData);
          
          console.log('📊 Estudiantes cargados del backend:', {
            total: estudiantesData.length,
            estudiantes: estudiantesData.map(e => ({
              nombre: e.nombre,
              año: e.institucion?.anio_de_ingreso || e.año_generacion || e.año_ingreso || '2024'
            }))
          });
          
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
    console.log('🔢 Calculando generaciones desde', estudiantesData.length, 'estudiantes');
    
    const estudiantesPorAño = estudiantesData.reduce((acc, estudiante) => {
      // Debug: mostrar todos los campos disponibles del estudiante
      console.log(`🔍 Debug estudiante ${estudiante.nombre}:`, {
        'institucion?.anio_de_ingreso': estudiante.institucion?.anio_de_ingreso,
        'año_generacion': estudiante.año_generacion,
        'año_ingreso': estudiante.año_ingreso,
        'informacionAcademica?.año_ingreso_beca': estudiante.informacionAcademica?.año_ingreso_beca,
        'institucion completa': estudiante.institucion,
        'informacionAcademica completa': estudiante.informacionAcademica
      });

      // Buscar el año de ingreso en múltiples campos posibles
      const posiblesAños = [
        estudiante.institucion?.anio_de_ingreso,
        estudiante.año_generacion,
        estudiante.año_ingreso,
        estudiante.informacionAcademica?.año_ingreso_beca,
        (estudiante.institucion as any)?.año_ingreso,
        (estudiante as any).generacion,
        (estudiante as any).año_generacion,
        (estudiante as any).anio_ingreso,
        // Buscar también en propiedades que podrían ser strings
        parseInt((estudiante as any).generacion),
        parseInt((estudiante.institucion as any)?.anio_ingreso),
      ];
      
      // Encontrar el primer valor válido
      const año = posiblesAños.find(valor => {
        const parsed = parseInt(valor as string);
        return !isNaN(parsed) && parsed > 1990 && parsed <= 2030;
      }) || '2024';

      const añoNum = parseInt(año.toString());
      console.log(`👤 Estudiante ${estudiante.nombre} asignado a generación ${añoNum} (valor original: ${año})`);

      if (!acc[añoNum]) {
        acc[añoNum] = [];
      }
      acc[añoNum].push(estudiante);
      return acc;
    }, {} as Record<number, Estudiante[]>);

    // Incluir generaciones creadas manualmente que no tienen estudiantes (generaciones vacías)
    generacionesCreadas.forEach(año => {
      if (!estudiantesPorAño[año]) {
        console.log(`📝 Agregando generación vacía creada manualmente: ${año}`);
        estudiantesPorAño[año] = [];
      }
    });

    const generacionesCalculadas = Object.entries(estudiantesPorAño)
      .map(([año, estudiantesAño]) => {
        const añoNum = parseInt(año);
        const currentYear = new Date().getFullYear();

        const activos = estudiantesAño.filter(e =>
          e.estado === 'Activo' ||
          !e.estado
        ).length;

        // Una generación está activa si tiene estudiantes activos, independientemente del año
        const estaActiva = activos > 0;
        
        console.log(`📊 Generación ${añoNum}: ${estudiantesAño.length} total, ${activos} activos → ${estaActiva ? 'ACTIVA' : 'FINALIZADA'}`);

        return {
          año: añoNum,
          estudiantes: estudiantesAño.length,
          activos,
          estado: estaActiva ? 'activa' : 'finalizada' as 'activa' | 'finalizada',
          estudiantesData: estudiantesAño
        };
      })
      .sort((a, b) => b.año - a.año);

    console.log('✅ Generaciones calculadas:', generacionesCalculadas.map(g => `${g.año}: ${g.estudiantes} estudiantes`));
    return generacionesCalculadas;
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
    // Verificar si la generación ya existe
    const yaExiste = generaciones.some(g => g.año === año) || generacionesCreadas.includes(año);
    
    if (!yaExiste) {
      // Agregar la nueva generación a las creadas
      const nuevasGeneraciones = [...generacionesCreadas, año];
      setGeneracionesCreadas(nuevasGeneraciones);
      
      // Guardar en localStorage
      localStorage.setItem('generaciones_creadas', JSON.stringify(nuevasGeneraciones));
      
      console.log(`✅ Generación ${año} creada y guardada`);
    }
    
    // Recalcular generaciones para incluir la nueva
    const todosLosEstudiantes = generaciones.flatMap(g => g.estudiantesData);
    const generacionesActualizadas = calcularGeneracionesDesdeEstudiantes(todosLosEstudiantes);
    setGeneraciones(generacionesActualizadas);
    
    // Navegar a la vista de la generación recién creada
    navigate(`/generacion/${año}`);
  };

  const handleAddEstudianteToGeneracion = (año: number) => {
    setSelectedGeneracion(año);
    setOpenCreateEstudiante(true);
  };

  const handleEstudianteCreated = async () => {
    // Recargar datos después de crear estudiante
    console.log('🔄 Recargando datos del dashboard después de crear estudiante...');
    setLoading(true);
    try {
      const [estudiantesData, estadisticasData] = await Promise.all([
        apiService.getEstudiantes(),
        estadisticasService.getDashboard()
      ]);
      setEstadisticas(estadisticasData);
      
      // Recalcular generaciones - esto ahora incluirá automáticamente cualquier generación nueva con estudiantes
      const generacionesCalculadas = calcularGeneracionesDesdeEstudiantes(estudiantesData);
      setGeneraciones(generacionesCalculadas);
      
      // Agregar automáticamente a generaciones creadas cualquier generación nueva que aparezca
      const nuevasGeneracionesDetectadas = generacionesCalculadas
        .map(g => g.año)
        .filter(año => !generacionesCreadas.includes(año));
      
      if (nuevasGeneracionesDetectadas.length > 0) {
        console.log('🆕 Detectadas nuevas generaciones con estudiantes:', nuevasGeneracionesDetectadas);
        const todasLasGeneraciones = [...new Set([...generacionesCreadas, ...nuevasGeneracionesDetectadas])];
        setGeneracionesCreadas(todasLasGeneraciones);
        localStorage.setItem('generaciones_creadas', JSON.stringify(todasLasGeneraciones));
      }
      
      console.log('✅ Dashboard actualizado - Nuevos datos:', {
        totalEstudiantes: estudiantesData.length,
        generaciones: generacionesCalculadas.length,
        generacionesCreadas: generacionesCreadas.length,
        ultimoEstudiante: estudiantesData[estudiantesData.length - 1]
      });
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
