/**
 * Sección completa de Avance Curricular integrada en el panel del estudiante
 */
import React, { useState, useEffect } from 'react';
import type { Estudiante } from '../../types';
import { apiService } from '../../services/apiService';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { 
  SemesterCard, 
  SubjectCard, 
  StatsCard,
  EditSubjectModal,
  AddSubjectModal,
  SemesterModal,
  CreateSemesterModal 
} from '../AvanceCurricular';

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
  const [vistaActiva, setVistaActiva] = useState<'malla' | 'progreso' | 'estadisticas'>('malla');
  
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

  // Generar datos mock de malla curricular (similar al original)
  const generateMockCurricularData = () => {
    const mallaMock: MallaCurricular[] = [
      {
        semestre: 1,
        periodo: '2021-1',
        fechaInicio: '2021-03-01',
        fechaFin: '2021-07-30',
        ramos: [
          { id: 1, codigo: 'DCCB-00106', nombre: 'CÁLCULO I', creditos: 6, prerequisitos: [], estado: 'aprobado', nota: 6.1 },
          { id: 2, codigo: 'DCCB-00107', nombre: 'ÁLGEBRA I', creditos: 6, prerequisitos: [], estado: 'aprobado', nota: 6.4 },
          { id: 3, codigo: 'DCCB-00119', nombre: 'INTRODUCCIÓN A LA FÍSICA', creditos: 6, prerequisitos: [], estado: 'aprobado', nota: 6.4 },
          { id: 4, codigo: 'ECIN-00100', nombre: 'PR. INTRO. A LA INGENIERÍA', creditos: 5, prerequisitos: [], estado: 'aprobado', nota: 6.1 },
        ]
      },
      {
        semestre: 2,
        periodo: '2021-2',
        fechaInicio: '2021-08-15',
        fechaFin: '2021-12-20',
        ramos: [
          { id: 5, codigo: 'DCCB-00216', nombre: 'MECÁNICA', creditos: 6, prerequisitos: [], estado: 'aprobado', nota: 4.7 },
          { id: 6, codigo: 'DCCB-00265', nombre: 'CÁLCULO II', creditos: 6, prerequisitos: ['DCCB-00106'], estado: 'aprobado', nota: 4.5 },
          { id: 7, codigo: 'ECIN-00201', nombre: 'PROGRAMACIÓN', creditos: 6, prerequisitos: [], estado: 'aprobado', nota: 4.7 },
        ]
      },
      {
        semestre: 3,
        periodo: '2022-1',
        ramos: [
          { id: 8, codigo: 'DCCB-00264', nombre: 'QUÍMICA GENERAL', creditos: 6, prerequisitos: [], estado: 'cursando', nota: 5.2 },
          { id: 9, codigo: 'ECIN-00307', nombre: 'PROGRAMACIÓN ORIENTADA A OBJETO', creditos: 5, prerequisitos: ['ECIN-00201'], estado: 'cursando' },
        ]
      }
    ];

    // Calcular progreso
    let totalCreditos = 0;
    let creditosAprobados = 0;
    let notaSum = 0;
    let notaCount = 0;

    mallaMock.forEach(semestre => {
      semestre.ramos.forEach(ramo => {
        totalCreditos += ramo.creditos;
        if (ramo.estado === 'aprobado') {
          creditosAprobados += ramo.creditos;
          if (ramo.nota) {
            notaSum += ramo.nota;
            notaCount++;
          }
        }
      });
    });

    const progresoCalculado: ProgresoCurricular = {
      totalCreditos,
      creditosAprobados,
      creditosPendientes: totalCreditos - creditosAprobados,
      porcentajeAvance: Math.round((creditosAprobados / totalCreditos) * 100),
      semestreActual: 3,
      promedioGeneral: notaCount > 0 ? Math.round((notaSum / notaCount) * 10) / 10 : 0
    };

    setMallaCurricular(mallaMock);
    setProgreso(progresoCalculado);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Intentar obtener ramos cursados reales del backend
        try {
          const ramosReales = await apiService.getRamosCursadosByEstudiante(estudiante.id_estudiante);
          
          if (ramosReales && ramosReales.length > 0) {
            // Procesar datos reales aquí si es necesario
            console.log('Datos reales obtenidos:', ramosReales);
          }
        } catch (backendError) {
          console.log('No hay datos en backend, usando datos de ejemplo');
        }
        
        // Por ahora usar siempre datos mock para demostración
        generateMockCurricularData();
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos del estudiante');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [estudiante.id_estudiante]);

  // Recalcular progreso cuando cambie la malla curricular
  useEffect(() => {
    if (mallaCurricular.length > 0) {
      recalcularProgreso();
    }
  }, [mallaCurricular]);

  // Funciones de manejo de datos
  const handleDragEnd = (result: DropResult) => {
    // Implementar lógica de drag and drop
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
    codigo: string;
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
                codigo: nuevoRamo.codigo,
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
      } catch (backendError) {
        // Si falla el backend, agregar localmente
        setMallaCurricular(prev => prev.map(semestre => {
          if (semestre.semestre === selectedSemestre) {
            return {
              ...semestre,
              ramos: [...semestre.ramos, {
                id: Date.now(),
                codigo: nuevoRamo.codigo,
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
      <Draggable key={ramo.codigo} draggableId={ramo.codigo} index={index}>
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
              <div className="subject-code">
                {ramo.codigo}
              </div>
              <div className="subject-name">
                {ramo.nombre.toUpperCase()}
              </div>
              <div className="subject-footer">
                <span>NF: {ramo.nota || '-'}</span>
                <span>{ramo.creditos} SCT</span>
              </div>
              
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
                <Grid item xs={12} md={6} lg={4} key={semestre.semestre}>
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
                <Grid item xs={12}>
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
          onSave={(updatedSubject) => {
            // Actualizar el ramo en la malla curricular
            setMallaCurricular(prev => prev.map(semestre => ({
              ...semestre,
              ramos: semestre.ramos.map(ramo => 
                ramo.id === editingSubject.id ? updatedSubject : ramo
              )
            })));
            
            showSnackbar('Ramo actualizado correctamente');
            setIsModalOpen(false);
            setEditingSubject(null);
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