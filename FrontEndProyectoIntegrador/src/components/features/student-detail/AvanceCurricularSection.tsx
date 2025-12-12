/**
 * Sección completa de Avance Curricular integrada en el panel del estudiante
 */
import React, { useState, useEffect } from 'react';
import type { Estudiante } from '../../../types';
import { apiService } from '../../../services/apiService';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { 
  SemesterCard, 
  SubjectCard,
  EditSubjectModal,
  AddSubjectModal,
  SemesterModal,
  CreateSemesterModal 
} from '../avance-curricular';

// Interfaces para avance curricular
interface MallaCurricular {
  semestre: number;
  fechaInicio?: string;
  fechaFin?: string;
  periodo?: string;
  ramos: {
    id?: number;
    codigo: string;
    nombre: string;
    creditos: number;
    prerequisitos: string[];
    estado: 'pendiente' | 'cursando' | 'aprobado' | 'reprobado';
    nota?: number;
    oportunidad?: number;
    backendId?: number | string;
  }[];
}

interface ProgresoCurricular {
  totalCreditos: number;
  creditosAprobados: number;
  creditosPendientes: number;
  porcentajeAvance: number;
  semestreActual: number;
  promedioGeneral: number;
}

interface AvanceCurricularSectionProps {
  estudiante: Estudiante;
}

export const AvanceCurricularSection: React.FC<AvanceCurricularSectionProps> = ({ 
  estudiante 
}) => {
  // Estados
  const [progreso, setProgreso] = useState<ProgresoCurricular | null>(null);
  const [mallaCurricular, setMallaCurricular] = useState<MallaCurricular[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Estado para vista activa (pendiente de implementar)
  // const [vistaActiva, setVistaActiva] = useState<'malla' | 'progreso' | 'estadisticas'>('malla');
  
  // Estados para funcionalidad de edición
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSubject, setEditingSubject] = useState<MallaCurricular['ramos'][0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSemestre, setSelectedSemestre] = useState<number>(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<MallaCurricular | null>(null);
  const [isCreateSemesterModalOpen, setIsCreateSemesterModalOpen] = useState(false);

  // Cargar datos reales desde el backend
  const cargarDatosReales = async () => {
    try {
      // Obtener ramos cursados del estudiante
      const ramosReales = await apiService.getRamosCursadosByEstudiante(String(estudiante.id_estudiante));
      
      console.log('📥 Datos recibidos del backend:', ramosReales);
      
      if (ramosReales && ramosReales.length > 0) {
        // Agrupar ramos por semestre
        const semestreMap: { [key: number]: MallaCurricular } = {};
        
        ramosReales.forEach((ramo: any) => {
          console.log('🔄 Procesando ramo del backend:', ramo);
          
          const semestre = ramo.semestre || 1;
          
          if (!semestreMap[semestre]) {
            semestreMap[semestre] = {
              semestre,
              periodo: `${ramo.año || new Date().getFullYear()}-${semestre}`,
              ramos: []
            };
          }
          
          const ramoMapeado = {
            id: ramo.id_ramo || Date.now() + Math.random(),
            codigo: ramo.codigo_ramo || 'SIN-CODIGO',
            nombre: ramo.nombre_ramo || 'Sin nombre',
            creditos: 6, // Valor por defecto, se puede ajustar
            prerequisitos: [],
            estado: ramo.estado || 'pendiente',
            nota: ramo.promedio_final || undefined,
            oportunidad: ramo.oportunidad || 1,
            // Guardar referencia al ID original del backend
            backendId: ramo.id_ramo
          };
          
          console.log('✅ Ramo mapeado:', ramoMapeado);
          
          semestreMap[semestre].ramos.push(ramoMapeado);
        });
        
        // Convertir a array y ordenar
        const mallaCurricularReal = Object.values(semestreMap)
          .sort((a, b) => a.semestre - b.semestre);
        
        setMallaCurricular(mallaCurricularReal);
        return mallaCurricularReal;
      } else {
        // Si no hay ramos, crear estructura vacía
        setMallaCurricular([]);
        setProgreso({
          totalCreditos: 0,
          creditosAprobados: 0,
          creditosPendientes: 0,
          porcentajeAvance: 0,
          semestreActual: 1,
          promedioGeneral: 0
        });
        return [];
      }
    } catch (error) {
      console.error('Error cargando datos reales:', error);
      // En caso de error, usar estructura vacía
      setMallaCurricular([]);
      setProgreso({
        totalCreditos: 0,
        creditosAprobados: 0,
        creditosPendientes: 0,
        porcentajeAvance: 0,
        semestreActual: 1,
        promedioGeneral: 0
      });
      return [];
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar datos reales desde el backend
        const mallaCargada = await cargarDatosReales();
        
        // Si se cargaron datos, recalcular el progreso
        if (mallaCargada && mallaCargada.length > 0) {
          // El progreso se calculará automáticamente en el useEffect del recalcularProgreso
        }
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos del avance curricular');
      } finally {
        setLoading(false);
      }
    };

    if (estudiante?.id_estudiante) {
      loadData();
    }
  }, [estudiante.id_estudiante]);

  // Función para recalcular progreso
  const recalcularProgreso = async () => {
    const totalCreditos = mallaCurricular.reduce((acc, sem) => acc + (sem.ramos.length * 4), 0);
    const creditosAprobados = mallaCurricular.reduce((acc, sem) => 
      acc + sem.ramos.filter(r => r.estado === 'aprobado').length * 4, 0);
    const creditosPendientes = totalCreditos - creditosAprobados;
    const porcentajeAvance = totalCreditos > 0 ? (creditosAprobados / totalCreditos) * 100 : 0;
    
    const todasLasNotas = mallaCurricular.reduce((acc, sem) => {
      const notasAprobadas = sem.ramos.filter(r => r.estado === 'aprobado' && r.nota).map(r => r.nota!);
      return [...acc, ...notasAprobadas];
    }, [] as number[]);
    
    const promedioGeneral = todasLasNotas.length > 0 
      ? todasLasNotas.reduce((sum, nota) => sum + nota, 0) / todasLasNotas.length 
      : 0;

    setProgreso({
      totalCreditos,
      creditosAprobados,
      creditosPendientes,
      porcentajeAvance: Number(porcentajeAvance.toFixed(1)),
      semestreActual: Math.max(...mallaCurricular.map(m => m.semestre), 0),
      promedioGeneral: Number(promedioGeneral.toFixed(2))
    });
  };

  // Recalcular progreso cuando cambie la malla curricular
  useEffect(() => {
    if (mallaCurricular.length > 0) {
      const totalCreditos = mallaCurricular.reduce((acc, sem) => acc + (sem.ramos.length * 4), 0);
      const creditosAprobados = mallaCurricular.reduce((acc, sem) => 
        acc + sem.ramos.filter(r => r.estado === 'aprobado').length * 4, 0);
      const creditosPendientes = totalCreditos - creditosAprobados;
      const porcentajeAvance = totalCreditos > 0 ? (creditosAprobados / totalCreditos) * 100 : 0;

      const notasAprobadas = mallaCurricular.flatMap(sem => 
        sem.ramos.filter(r => r.estado === 'aprobado' && r.nota).map(r => r.nota!)
      );
      const promedioGeneral = notasAprobadas.length > 0 
        ? notasAprobadas.reduce((sum, nota) => sum + nota, 0) / notasAprobadas.length 
        : 0;

      setProgreso({
        totalCreditos,
        creditosAprobados,
        creditosPendientes,
        porcentajeAvance: Number(porcentajeAvance.toFixed(1)),
        semestreActual: mallaCurricular.length,
        promedioGeneral: Number(promedioGeneral.toFixed(2))
      });
    } else {
      // Si no hay datos, resetear progreso
      setProgreso({
        totalCreditos: 0,
        creditosAprobados: 0,
        creditosPendientes: 0,
        porcentajeAvance: 0,
        semestreActual: 1,
        promedioGeneral: 0
      });
    }
  }, [mallaCurricular]);

  // Funciones de manejo de datos
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Si no hay destino, no hacer nada
    if (!destination) {
      return;
    }

    // Si se soltó en la misma posición, no hacer nada
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      // Encontrar el ramo que se está moviendo
      const sourceSeemestre = parseInt(source.droppableId.replace('semestre-', ''));
      const destSemestre = parseInt(destination.droppableId.replace('semestre-', ''));
      
      let ramoMovido: any = null;
      
      // Buscar el ramo en el semestre origen
      const semestreOrigen = mallaCurricular.find(s => s.semestre === sourceSeemestre);
      if (semestreOrigen) {
        ramoMovido = semestreOrigen.ramos.find(r => String(r.backendId) === draggableId || r.codigo === draggableId);
      }

      if (!ramoMovido) {
        console.error('Ramo no encontrado:', draggableId);
        return;
      }

      console.log('🔄 Moviendo ramo:', {
        ramo: ramoMovido.nombre,
        desde: sourceSeemestre,
        hacia: destSemestre,
        backendId: ramoMovido.backendId
      });

      // Actualizar localmente primero para UX inmediato
      setMallaCurricular(prev => {
        const newMalla = [...prev];
        
        // Remover del semestre origen
        const sourceIndex = newMalla.findIndex(s => s.semestre === sourceSeemestre);
        if (sourceIndex !== -1) {
          newMalla[sourceIndex].ramos = newMalla[sourceIndex].ramos.filter(
            r => String(r.backendId) !== draggableId && r.codigo !== draggableId
          );
        }
        
        // Agregar al semestre destino
        const destIndex = newMalla.findIndex(s => s.semestre === destSemestre);
        if (destIndex !== -1) {
          const ramoActualizado = { ...ramoMovido };
          newMalla[destIndex].ramos.splice(destination.index, 0, ramoActualizado);
        }
        
        return newMalla;
      });

      // Actualizar en el backend si tiene backendId
      if (ramoMovido.backendId) {
        const ramoData = {
          semestre: destSemestre,
          estado: ramoMovido.estado,
          promedio_final: ramoMovido.nota || null,
          oportunidad: ramoMovido.oportunidad || 1
        };

        console.log('📤 Actualizando ramo en backend:', {
          id: ramoMovido.backendId,
          data: ramoData
        });

        await apiService.updateRamoCursado(String(ramoMovido.backendId), ramoData);
        
        // Recargar datos para mantener sincronización
        await cargarDatosReales();
        showSnackbar(`${ramoMovido.nombre} movido al semestre ${destSemestre}`);
      } else {
        console.log('⚠️ Ramo sin backendId, solo actualización local');
        showSnackbar(`${ramoMovido.nombre} movido al semestre ${destSemestre} (local)`);
      }

    } catch (error) {
      console.error('Error moviendo ramo:', error);
      showSnackbar('Error al mover el ramo');
      // Recargar datos en caso de error para restaurar estado
      await cargarDatosReales();
    }
  };

  const handleAddSubject = (semestreId: number) => {
    setSelectedSemestre(semestreId);
    setIsAddModalOpen(true);
  };

  const handleEditSubject = (subject: MallaCurricular['ramos'][0]) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleCreateSemester = () => {
    setIsCreateSemesterModalOpen(true);
  };

  const handleSaveNewSemester = async (newSemesterData: {
    fechaInicio?: string;
    fechaFin?: string;
    periodo?: string;
  }) => {
    try {
      const nuevoSemestre: MallaCurricular = {
        semestre: mallaCurricular.length + 1,
        periodo: newSemesterData.periodo || `2024-${mallaCurricular.length + 1}`,
        fechaInicio: newSemesterData.fechaInicio,
        fechaFin: newSemesterData.fechaFin,
        ramos: []
      };

      setMallaCurricular(prev => [...prev, nuevoSemestre].sort((a, b) => a.semestre - b.semestre));
      showSnackbar(`Semestre ${nuevoSemestre.semestre} creado correctamente`);
      setIsCreateSemesterModalOpen(false);
    } catch (error) {
      console.error('Error creando semestre:', error);
      showSnackbar('Error al crear el semestre');
    }
  };

  const handleSaveNewSubject = async (nuevoRamo: {
    nombre: string;
    creditos: number;
    prerequisitos: string[];
    estado: 'pendiente' | 'cursando' | 'aprobado' | 'reprobado';
    nota?: number;
  }) => {
    try {
      // Crear el ramo en el backend
      const ramoData = {
        id_estudiante: estudiante.id_estudiante,
        semestre: selectedSemestre,
        nivel_educativo: 'Universitario',
        nombre_ramo: nuevoRamo.nombre,
        notas_parciales: {},
        promedio_final: nuevoRamo.nota || null,
        estado: nuevoRamo.estado
      };

      try {
        // Llamada al backend
        const ramoCreado = await apiService.createRamoCursado(ramoData);
        
        // Actualizar estado local con el ramo creado
        setMallaCurricular(prev => prev.map(semestre => {
          if (semestre.semestre === selectedSemestre) {
            return {
              ...semestre,
              ramos: [...semestre.ramos, {
                id: ramoCreado.id_ramo || Date.now(),
                codigo: ramoCreado.codigo_ramo || `RAMO-${Date.now()}`,
                nombre: nuevoRamo.nombre,
                creditos: nuevoRamo.creditos,
                prerequisitos: nuevoRamo.prerequisitos || [],
                estado: nuevoRamo.estado,
                nota: nuevoRamo.nota,
                backendId: ramoCreado.id_ramo
              }]
            };
          }
          return semestre;
        }));
      } catch (backendError) {
        // Si falla el backend, agregar localmente
        setMallaCurricular(prev => prev.map(semestre => {
          if (semestre.semestre === selectedSemestre) {
            return {
              ...semestre,
              ramos: [...semestre.ramos, {
                id: Date.now(),
                codigo: `LOCAL-${Date.now()}`,
                nombre: nuevoRamo.nombre,
                creditos: nuevoRamo.creditos,
                prerequisitos: nuevoRamo.prerequisitos || [],
                estado: nuevoRamo.estado,
                nota: nuevoRamo.nota
              }]
            };
          }
          return semestre;
        }));
      }
      
      showSnackbar(`Ramo "${nuevoRamo.nombre}" agregado correctamente`);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error agregando ramo:', error);
      showSnackbar('Error al agregar el ramo');
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Renderizar ramo con estilo similar al original
  const renderRamo = (ramo: MallaCurricular['ramos'][0], index: number) => {
    if (!ramo.codigo || !ramo.nombre) {
      return null;
    }

    return (
      <Draggable key={ramo.backendId || ramo.codigo} draggableId={String(ramo.backendId || ramo.codigo)} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <SubjectCard 
              estado={ramo.estado}
              onClick={() => handleEditSubject(ramo)}
              sx={{
                transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
                opacity: snapshot.isDragging ? 0.8 : 1,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                }
              }}
            >
              <div className="subject-name">
                {ramo.nombre.toUpperCase()}
              </div>
              <div className="subject-footer">
                <span>NF: {ramo.nota || '-'}</span>
                <span>{ramo.creditos} SCT</span>
              </div>
              
              {/* Indicador de oportunidad */}
              {ramo.oportunidad && ramo.oportunidad > 1 && (
                <div className="opportunity-indicator">
                  {ramo.oportunidad}
                </div>
              )}
              
              {isEditMode && (
                <IconButton
                  className="edit-button"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditSubject(ramo);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </SubjectCard>
          </div>
        )}
      </Draggable>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando avance curricular...</p>
        </div>
      </div>
    );
  }

  if (error && mallaCurricular.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error al cargar datos</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      {progreso && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Avance Curricular</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditMode 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                {isEditMode ? '🔒 Salir de edición' : '✏️ Editar'}
              </button>
              {isEditMode && (
                <button
                  onClick={handleCreateSemester}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  ➕ Agregar Semestre
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {Math.floor(progreso.creditosAprobados / 4)}
              </div>
              <div className="text-sm text-gray-600">Ramos Aprobados</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.floor(progreso.creditosPendientes / 4)}
              </div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {progreso.promedioGeneral}
              </div>
              <div className="text-sm text-gray-600">Promedio General</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {progreso.porcentajeAvance}%
              </div>
              <div className="text-sm text-gray-600">Avance</div>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progreso Curricular</span>
              <span>{progreso.porcentajeAvance}% completado</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progreso.porcentajeAvance}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Malla curricular por semestres */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Malla Curricular</h3>
          <p className="text-sm text-gray-600 mt-1">
            Organización de ramos por semestre
          </p>
        </div>
        
        <Box sx={{ p: 3 }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Grid container spacing={3}>
              {mallaCurricular.map((semestre) => (
                <Grid xs={12} md={6} lg={4} key={semestre.semestre}>
                  <SemesterCard>
                    <div className="semester-header">
                      <Typography className="semester-title" variant="h6">
                        Semestre {semestre.semestre}
                      </Typography>
                      {isEditMode && (
                        <IconButton
                          className="semester-config-button"
                          size="small"
                          onClick={() => {
                            setEditingSemester(semestre);
                            setIsSemesterModalOpen(true);
                          }}
                        >
                          <SettingsIcon fontSize="small" />
                        </IconButton>
                      )}
                    </div>
                    
                    {semestre.periodo && (
                      <Typography variant="caption" className="semester-info" display="block" gutterBottom>
                        {semestre.periodo}
                      </Typography>
                    )}

                    <Droppable droppableId={`semestre-${semestre.semestre}`}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{ minHeight: '200px', paddingBottom: '60px' }}
                        >
                          {semestre.ramos.map((ramo, index) => renderRamo(ramo, index))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {isEditMode && (
                      <Fab
                        size="small"
                        color="primary"
                        onClick={() => handleAddSubject(semestre.semestre)}
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          right: 16,
                        }}
                      >
                        <AddIcon />
                      </Fab>
                    )}
                  </SemesterCard>
                </Grid>
              ))}
              
              {mallaCurricular.length === 0 && (
                <Grid xs={12}>
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 8,
                      color: 'text.secondary'
                    }}
                  >
                    <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>📚</Typography>
                    <Typography variant="h6" gutterBottom>No hay semestres registrados</Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                      Agrega semestres y ramos para comenzar a gestionar el avance curricular
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleCreateSemester}
                      sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
                    >
                      Crear Primer Semestre
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </DragDropContext>
        </Box>
      </div>

      {/* Modales */}
      {isModalOpen && editingSubject && (
        <EditSubjectModal
          open={isModalOpen}
          ramo={editingSubject}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSubject(null);
          }}
          onSave={async (updatedSubject) => {
            try {
              console.log('🔄 Actualizando ramo:', {
                editingSubject,
                updatedSubject,
                backendId: editingSubject?.backendId
              });

              // Usar backendId si está disponible, sino usar id
              const idToUse = editingSubject?.backendId || updatedSubject.id;
              
              if (idToUse) {
                const ramoData = {
                  estado: updatedSubject.estado,
                  promedio_final: updatedSubject.nota || null,
                  oportunidad: updatedSubject.oportunidad || 1
                };
                
                console.log('📤 Enviando actualización al backend:', {
                  id: String(idToUse),
                  data: ramoData
                });
                
                await apiService.updateRamoCursado(String(idToUse), ramoData);
                
                // Recargar todos los datos desde el backend para asegurar consistencia
                console.log('🔄 Recargando datos desde el backend...');
                await cargarDatosReales();
                
                showSnackbar('Ramo actualizado correctamente');
              } else {
                console.log('⚠️ No hay ID disponible, actualizando solo localmente');
                // Si no hay ID, solo actualizar localmente
                setMallaCurricular(prev => prev.map(semestre => ({
                  ...semestre,
                  ramos: semestre.ramos.map(ramo => 
                    ramo.id === editingSubject.id ? updatedSubject : ramo
                  )
                })));
                
                showSnackbar('Ramo actualizado localmente');
              }
              
              setIsModalOpen(false);
              setEditingSubject(null);
            } catch (error) {
              console.error('❌ Error actualizando ramo:', error);
              showSnackbar('Error al actualizar el ramo');
            }
          }}
        />
      )}

      {isAddModalOpen && (
        <AddSubjectModal
          open={isAddModalOpen}
          semestre={selectedSemestre}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveNewSubject}
        />
      )}

      {isCreateSemesterModalOpen && (
        <CreateSemesterModal
          open={isCreateSemesterModalOpen}
          currentMaxSemester={mallaCurricular.length}
          onClose={() => setIsCreateSemesterModalOpen(false)}
          onSave={handleSaveNewSemester}
        />
      )}

      {editingSemester && (
        <SemesterModal
          open={isSemesterModalOpen}
          semester={editingSemester}
          onClose={() => {
            setIsSemesterModalOpen(false);
            setEditingSemester(null);
          }}
          onSave={(updatedSemester) => {
            // Actualizar el semestre en la malla curricular
            setMallaCurricular(prev => prev.map(semestre => 
              semestre.semestre === updatedSemester.semestre ? updatedSemester : semestre
            ));
            
            showSnackbar('Semestre actualizado correctamente');
            setIsSemesterModalOpen(false);
            setEditingSemester(null);
          }}
          onDelete={(semesterNumber) => {
            // Eliminar semestre
            setMallaCurricular(prev => prev.filter(semestre => semestre.semestre !== semesterNumber));
            showSnackbar('Semestre eliminado correctamente');
            setIsSemesterModalOpen(false);
            setEditingSemester(null);
          }}
        />
      )}

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};