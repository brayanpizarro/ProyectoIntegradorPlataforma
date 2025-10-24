﻿import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService'; // ✅ NUEVO: Servicio API real
import type { Estudiante, EstadisticasAdmin } from '../types'; // ✅ CORREGIDO: Import de tipos

// ✅ MANTIENE: Datos mock como fallback (preserva funcionalidad existente)
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

// ✅ NUEVA: Interfaz para generaciones calculadas desde datos reales
interface GeneracionCalculada {
  año: number;
  estudiantes: number;
  activos: number;
  estado: 'activa' | 'finalizada';
  estudiantesData: Estudiante[]; // ✅ NUEVO: Datos completos para navegación
}

export const Dashboard: React.FC<DashboardProps> = ({ onAuthChange }) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<any>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todas' | 'activas' | 'finalizadas'>('todas');
  const [ordenarPor, setOrdenarPor] = useState<'año' | 'estudiantes'>('año');
  
  // ✅ NUEVO: Estados para datos del backend
  const [estadisticas, setEstadisticas] = useState<EstadisticasAdmin | null>(null);
  const [generaciones, setGeneraciones] = useState<GeneracionCalculada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ ACTUALIZADO: Cargar datos del backend + usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar usuario (mantiene lógica existente)
        const user = await authService.getCurrentUser();
        setUsuario(user);

        // ✅ NUEVO: Cargar datos del backend
        try {
          console.log('📊 Cargando datos del backend...');
          
          // Cargar en paralelo para mejor performance
          const [estudiantesData, estadisticasData] = await Promise.all([
            apiService.getEstudiantes(),
            apiService.getEstadisticas()
          ]);

          setEstadisticas(estadisticasData);
          
          // ✅ NUEVO: Calcular generaciones desde datos reales
          const generacionesCalculadas = calcularGeneracionesDesdeEstudiantes(estudiantesData);
          setGeneraciones(generacionesCalculadas);
          
          console.log('✅ Datos del backend cargados exitosamente');
          
        } catch (apiError) {
          console.warn('⚠️ Backend no disponible, usando datos mock');
          // ✅ FALLBACK: Usar datos mock (preserva funcionalidad)
          setGeneraciones(mockGeneraciones.map(g => ({
            ...g,
            estudiantesData: [] // Sin datos completos en mock
          })));
        }

      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos del dashboard');
        // Mantener funcionalidad básica con mock
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

  // ✅ NUEVA: Función para calcular generaciones desde estudiantes reales
  const calcularGeneracionesDesdeEstudiantes = (estudiantesData: Estudiante[]): GeneracionCalculada[] => {
    // Agrupar estudiantes por año de ingreso
    const estudiantesPorAño = estudiantesData.reduce((acc, estudiante) => {
      // Obtener año de múltiples fuentes para compatibilidad
      const año = 
        estudiante.institucion?.anio_de_ingreso || 
        estudiante.año_generacion?.toString() || 
        estudiante.año_ingreso?.toString() || 
        '2024';
      
      const añoNum = parseInt(año.toString()); // ✅ CORREGIDO: convertir a string primero
      
      if (!acc[añoNum]) {
        acc[añoNum] = [];
      }
      acc[añoNum].push(estudiante);
      return acc;
    }, {} as Record<number, Estudiante[]>);

    // Convertir a array de generaciones
    return Object.entries(estudiantesPorAño)
      .map(([año, estudiantesAño]) => {
        const añoNum = parseInt(año);
        const currentYear = new Date().getFullYear();
        
        // Calcular activos (estudiantes con estado activo)
        const activos = estudiantesAño.filter(e => 
          e.informacionAcademica?.status_actual === 'Activo' ||
          e.estado === 'Activo' ||
          e.tipo_de_estudiante === 'UNIVERSITARIO'
        ).length;

        return {
          año: añoNum,
          estudiantes: estudiantesAño.length,
          activos,
          estado: (añoNum >= currentYear - 2 ? 'activa' : 'finalizada') as 'activa' | 'finalizada', // ✅ CORREGIDO: sintaxis correcta
          estudiantesData: estudiantesAño
        };
      })
      .sort((a, b) => b.año - a.año); // Más recientes primero
  };

  // ✅ MANTIENE: Lógica de logout existente
  const handleLogout = async () => {
    try {
      await authService.logout();
      
      if (onAuthChange) {
        onAuthChange(false);
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // ✅ ACTUALIZADA: Lógica de filtrado para nuevas generaciones
  const generacionesFiltradas = generaciones.filter(generacion => {
    // Filtro por búsqueda (año)
    const coincideBusqueda = busqueda === '' || 
      generacion.año.toString().includes(busqueda);
    
    // Filtro por estado
    const coincideEstado = filtroEstado === 'todas' || 
      (filtroEstado === 'activas' && generacion.estado === 'activa') ||
      (filtroEstado === 'finalizadas' && generacion.estado === 'finalizada');
    
    return coincideBusqueda && coincideEstado;
  });

  // ✅ MANTIENE: Lógica de ordenamiento existente
  const generacionesOrdenadas = [...generacionesFiltradas].sort((a, b) => {
    if (ordenarPor === 'año') {
      return b.año - a.año; // Más recientes primero
    } else {
      return b.estudiantes - a.estudiantes; // Más estudiantes primero
    }
  });

  // ✅ ACTUALIZADO: Cálculos de totales (puede usar estadísticas del backend)
  const totalEstudiantes = estadisticas?.total_estudiantes || 
    generacionesOrdenadas.reduce((sum, gen) => sum + gen.estudiantes, 0);
  const totalActivos = generacionesOrdenadas.reduce((sum, gen) => sum + gen.activos, 0);

  // ✅ NUEVO: Manejo de estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin">⏳</div>
          <h2 className="text-2xl font-bold mb-2">Cargando Dashboard...</h2>
          <p className="text-gray-600">Conectando con el backend</p>
        </div>
      </div>
    );
  }

  // ✅ NUEVO: Manejo de error si existe
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md p-8">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold">
            🏛️ Fundación
          </h1>
          <button 
            className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-md hover:bg-white/10 transition"
            onClick={() => navigate('/dashboard')}
          >
            Inicio
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <span>{usuario?.tipo || 'Usuario'}: {usuario?.email || 'Cargando...'}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Dashboard Principal
          </h2>
          <p className="text-gray-600">
            Gestión de estudiantes por generaciones
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="text-4xl">📚</div>
              <div>
                <p className="text-sm text-gray-600">Total Generaciones</p>
                <p className="text-3xl font-bold">{mockGeneraciones.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="text-4xl">👥</div>
              <div>
                <p className="text-sm text-gray-600">Total Estudiantes</p>
                <p className="text-3xl font-bold">{totalEstudiantes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="text-4xl">✅</div>
              <div>
                <p className="text-sm text-gray-600">Estudiantes Activos</p>
                <p className="text-3xl font-bold">{totalActivos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h3 className="text-xl font-bold mb-4">
            🔍 Filtros y Búsqueda
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Búsqueda por año */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por año:
              </label>
              <input
                type="text"
                placeholder="Ej: 2024, 2023..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado:
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as any)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todas">Todas las generaciones</option>
                <option value="activas">Solo activas</option>
                <option value="finalizadas">Solo finalizadas</option>
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por:
              </label>
              <select
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value as any)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="año">Año (más reciente)</option>
                <option value="estudiantes">Cantidad de estudiantes</option>
              </select>
            </div>

            {/* Botón limpiar filtros */}
            <div>
              <button
                onClick={() => {
                  setBusqueda('');
                  setFiltroEstado('todas');
                  setOrdenarPor('año');
                }}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                🗑️ Limpiar filtros
              </button>
            </div>
          </div>

          {/* Resultados de búsqueda */}
          <div className="mt-4 px-4 py-3 bg-gray-100 rounded-md text-sm text-gray-600">
            <strong>{generacionesOrdenadas.length}</strong> generación(es) encontrada(s)
            {busqueda && (
              <span> • Búsqueda: "{busqueda}"</span>
            )}
            {filtroEstado !== 'todas' && (
              <span> • Estado: {filtroEstado}</span>
            )}
          </div>
        </div>

        {/* Generaciones Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">
              Generaciones
            </h3>
            <button
              onClick={() => {
                // TODO: Implementar modal para nueva generación
                alert('Funcionalidad para crear nueva generación - Por implementar');
              }}
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition text-sm font-medium"
            >
              + Nueva Generación
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {generacionesOrdenadas.map((generacion) => (
              <div
                key={generacion.año}
                onClick={() => navigate(`/generacion/${generacion.año}`)}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🎓</div>
                    <div>
                      <h4 className="text-xl font-bold">
                        Generación {generacion.año}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Año {generacion.año}
                      </p>
                    </div>
                  </div>
                  
                  {/* Indicador de estado */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    generacion.estado === 'activa' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {generacion.estado === 'activa' ? '🟢 Activa' : '🟡 Finalizada'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {generacion.estudiantes}
                    </p>
                    <p className="text-xs text-gray-600">
                      Total Estudiantes
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">
                      {generacion.activos}
                    </p>
                    <p className="text-xs text-gray-600">
                      Activos
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje cuando no hay resultados */}
          {generacionesOrdenadas.length === 0 && (
            <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">
                No se encontraron generaciones
              </h3>
              <p className="text-gray-600 mb-6">
                Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
              </p>
              <button
                onClick={() => {
                  setBusqueda('');
                  setFiltroEstado('todas');
                  setOrdenarPor('año');
                }}
                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition text-sm font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4">
            Acciones Rápidas
          </h3>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => {
                // TODO: Implementar modal para nuevo estudiante
                alert('Funcionalidad para crear nuevo estudiante - Por implementar');
              }}
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition text-sm font-medium"
            >
              👤 Nuevo Estudiante
            </button>
            <button
              onClick={() => {
                // TODO: Implementar reportes
                alert('Funcionalidad de reportes - Por implementar');
              }}
              className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition text-sm font-medium"
            >
              📊 Ver Reportes
            </button>
            <button
              onClick={() => {
                // TODO: Implementar exportación
                alert('Funcionalidad de exportación - Por implementar');
              }}
              className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 transition text-sm font-medium"
            >
              📁 Exportar Datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
