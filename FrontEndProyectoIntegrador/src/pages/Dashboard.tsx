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
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            animation: 'spin 1s linear infinite'
          }}>⏳</div>
          <h2>Cargando Dashboard...</h2>
          <p style={{ color: '#6b7280' }}>Conectando con el backend</p>
        </div>
      </div>
    );
  }

  // ✅ NUEVO: Manejo de error si existe
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2>Error al cargar datos</h2>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navbar */}
      <nav style={{
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            🏛️ Fundación
          </h1>
          <button 
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/dashboard')}
          >
            Inicio
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>{usuario?.tipo || 'Usuario'}: {usuario?.email || 'Cargando...'}</span>
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#dc2626',
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, marginBottom: '0.5rem' }}>
            Dashboard Principal
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Gestión de estudiantes por generaciones
          </p>
        </div>

        {/* Estadísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '2rem' }}>📚</div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Generaciones</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{mockGeneraciones.length}</p>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '2rem' }}>👥</div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Estudiantes</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{totalEstudiantes}</p>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '2rem' }}>✅</div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Estudiantes Activos</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{totalActivos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            🔍 Filtros y Búsqueda
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'end'
          }}>
            {/* Búsqueda por año */}
            <div>
              <label style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                Buscar por año:
              </label>
              <input
                type="text"
                placeholder="Ej: 2024, 2023..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Filtro por estado */}
            <div>
              <label style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                Estado:
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="todas">Todas las generaciones</option>
                <option value="activas">Solo activas</option>
                <option value="finalizadas">Solo finalizadas</option>
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                Ordenar por:
              </label>
              <select
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
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
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#f9fafb',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#374151'
                }}
              >
                🗑️ Limpiar filtros
              </button>
            </div>
          </div>

          {/* Resultados de búsqueda */}
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem 1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
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
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              Generaciones
            </h3>
            <button
              onClick={() => {
                // TODO: Implementar modal para nueva generación
                alert('Funcionalidad para crear nueva generación - Por implementar');
              }}
              style={{
                backgroundColor: '#10b981',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              + Nueva Generación
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {generacionesOrdenadas.map((generacion) => (
              <div
                key={generacion.año}
                onClick={() => navigate(`/generacion/${generacion.año}`)}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem' }}>🎓</div>
                    <div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                        Generación {generacion.año}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                        Año {generacion.año}
                      </p>
                    </div>
                  </div>
                  
                  {/* Indicador de estado */}
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: generacion.estado === 'activa' ? '#dcfce7' : '#fef3c7',
                    color: generacion.estado === 'activa' ? '#166534' : '#92400e'
                  }}>
                    {generacion.estado === 'activa' ? '🟢 Activa' : '🟡 Finalizada'}
                  </span>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                      {generacion.estudiantes}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                      Total Estudiantes
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#10b981' }}>
                      {generacion.activos}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                      Activos
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje cuando no hay resultados */}
          {generacionesOrdenadas.length === 0 && (
            <div style={{
              backgroundColor: 'white',
              padding: '3rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                No se encontraron generaciones
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
              </p>
              <button
                onClick={() => {
                  setBusqueda('');
                  setFiltroEstado('todas');
                  setOrdenarPor('año');
                }}
                style={{
                  backgroundColor: '#3b82f6',
                  border: 'none',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Acciones Rápidas */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Acciones Rápidas
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                // TODO: Implementar modal para nuevo estudiante
                alert('Funcionalidad para crear nuevo estudiante - Por implementar');
              }}
              style={{
                backgroundColor: '#3b82f6',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              👤 Nuevo Estudiante
            </button>
            <button
              onClick={() => {
                // TODO: Implementar reportes
                alert('Funcionalidad de reportes - Por implementar');
              }}
              style={{
                backgroundColor: '#8b5cf6',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              📊 Ver Reportes
            </button>
            <button
              onClick={() => {
                // TODO: Implementar exportación
                alert('Funcionalidad de exportación - Por implementar');
              }}
              style={{
                backgroundColor: '#f59e0b',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              📁 Exportar Datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
