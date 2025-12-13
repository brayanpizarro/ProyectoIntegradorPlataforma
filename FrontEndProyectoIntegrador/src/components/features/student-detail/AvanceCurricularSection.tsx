/**
 * Sección completa de Avance Curricular integrada en el panel del estudiante
 */
import React, { useState, useEffect } from 'react';
import type { Estudiante } from '../../../types';
import { ramosCursadosService } from '../../../services';
import { DragDropContext, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Snackbar, 
  Alert,
  IconButton,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { 
  SubjectCard,
  EditSubjectModal,
  AddSubjectModal,
  SemesterModal,
  CreateSemesterModal 
} from '../avance-curricular';
import { LoadingSpinner, ErrorMessage, StatCard } from '../../ui';
import { ProgressBar, SemesterCard } from './avance-curricular-components';

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
      const ramosReales = await ramosCursadosService.getByEstudiante(String(estudiante.id_estudiante));
      
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

        await ramosCursadosService.update(String(ramoMovido.backendId), ramoData);
        
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
      // Crear el ramo en el backend con los campos correctos
      const ramoData = {
        estudiante_id: String(estudiante.id_estudiante),
        codigo: `RAMO-${Date.now()}`,
        nombre: nuevoRamo.nombre,
        creditos: nuevoRamo.creditos,
        año: new Date().getFullYear(),
        semestre: selectedSemestre,
        nota_final: nuevoRamo.nota || undefined,
        estado: nuevoRamo.estado,
        oportunidad: 1
      };

      try {
        // Llamada al backend
        const ramoCreado = await ramosCursadosService.create(ramoData);
        
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
          <Box
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
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                }
              }}
            >
              <Typography 
                variant="subtitle2" 
                fontWeight={600} 
                sx={{ mb: 1, textTransform: 'uppercase' }}
              >
                {ramo.nombre}
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  color: 'text.secondary'
                }}
              >
                <Typography variant="caption">NF: {ramo.nota || '-'}</Typography>
                <Typography variant="caption">{ramo.creditos} SCT</Typography>
              </Box>
              
              {/* Indicador de oportunidad */}
              {ramo.oportunidad && ramo.oportunidad > 1 && (
                <Chip
                  label={`${ramo.oportunidad}ª vez`}
                  size="small"
                  color="warning"
                  sx={{ 
                    position: 'absolute',
                    top: 8,
                    left: 8,
                  }}
                />
              )}
              
              {isEditMode && (
                <IconButton
                  size="small"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleEditSubject(ramo);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      boxShadow: 2,
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </SubjectCard>
          </Box>
        )}
      </Draggable>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Cargando avance curricular..." />;
  }

  if (error && mallaCurricular.length === 0) {
    return (
      <ErrorMessage 
        title="Error al cargar datos" 
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header con estadísticas */}
      {progreso && (
        <Paper 
          elevation={0} 
          sx={{ 
            border: 1, 
            borderColor: 'divider', 
            borderRadius: 2, 
            p: 3 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Avance Curricular
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={isEditMode ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setIsEditMode(!isEditMode)}
                color={isEditMode ? 'error' : 'success'}
              >
                {isEditMode ? 'Salir de edición' : 'Editar'}
              </Button>
              {isEditMode && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleCreateSemester}
                  startIcon={<AddIcon />}
                  color="primary"
                >
                  Agregar Semestre
                </Button>
              )}
            </Box>
          </Box>
          
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, 
              gap: 2,
              mb: 2 
            }}
          >
            <StatCard
              icon="✅"
              label="Ramos Aprobados"
              value={Math.floor(progreso.creditosAprobados / 4)}
              accentColor="#10b981"
            />
            <StatCard
              icon="⏳"
              label="Pendientes"
              value={Math.floor(progreso.creditosPendientes / 4)}
              accentColor="#3b82f6"
            />
            <StatCard
              icon="📊"
              label="Promedio General"
              value={progreso.promedioGeneral}
              accentColor="#6b7280"
            />
            <StatCard
              icon="🎯"
              label="Avance"
              value={`${progreso.porcentajeAvance}%`}
              accentColor="#a855f7"
            />
          </Box>
          
          <ProgressBar 
            percentage={progreso.porcentajeAvance}
            label="Progreso Curricular"
            showPercentage
          />
        </Paper>
      )}

      {/* Malla curricular por semestres */}
      <Paper 
        elevation={0} 
        sx={{ 
          border: 1, 
          borderColor: 'divider', 
          borderRadius: 2, 
          overflow: 'hidden' 
        }}
      >
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Malla Curricular
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Organización de ramos por semestre
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
              {mallaCurricular.map((semestre) => (
                <SemesterCard
                  key={semestre.semestre}
                  semestre={semestre.semestre}
                  periodo={semestre.periodo}
                  fechaInicio={semestre.fechaInicio}
                  fechaFin={semestre.fechaFin}
                  ramoCount={semestre.ramos.length}
                  onAddSubject={() => handleAddSubject(semestre.semestre)}
                  onEditSemester={() => {
                    setEditingSemester(semestre);
                    setIsSemesterModalOpen(true);
                  }}
                >
                  {semestre.ramos.map((ramo, index) => renderRamo(ramo, index))}
                </SemesterCard>
              ))}
              
              {mallaCurricular.length === 0 && (
                <Box sx={{ gridColumn: '1 / -1' }}>
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
                </Box>
              )}
            </Box>
          </DragDropContext>
        </Box>
      </Paper>

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
              const idToUse = editingSubject?.backendId || (updatedSubject as any).id;
              
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
                
                await ramosCursadosService.update(String(idToUse), ramoData);
                
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
    </Box>
  );
};