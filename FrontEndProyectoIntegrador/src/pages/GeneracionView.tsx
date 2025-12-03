import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { logger } from '../config';
import { GenerationHeader, StudentFilterPanel, StudentsTable } from '../components/GenerationView';
import { CreateEstudianteModal } from '../components/Dashboard';

interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  rut: string;
  carrera: string;
  estado: 'Activo' | 'Egresado' | 'Suspendido' | 'Desertor' | 'Congelado';
  beca: string;
  universidad: string;
  promedio: number;
  ultimaEntrevista?: string;
  totalEntrevistasAno?: number;
  diasSinEntrevista?: number;
  tienePendienteNotas?: boolean;
}

const GeneracionViewSimple: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const generationId = parseInt(id || '2024', 10);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCarrera, setFilterCarrera] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [sortField, setSortField] = useState<keyof Estudiante>('apellidos');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [students, setStudents] = useState<any[]>([]);
  const [openCreateEstudiante, setOpenCreateEstudiante] = useState(false);
  
  // Obtener opciones únicas para los filtros
  const carreras = [...new Set(students.map(student => 
    student.carrera || student.institucion?.carrera_especialidad || 'Sin carrera'
  ).filter(Boolean))];
  const estados = [...new Set(students.map(student => 
    student.estado || 'Activo'
  ))];

  // Filtrar y ordenar estudiantes
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student => {
      const nombre = student.nombre || student.nombres || '';
      const apellido = student.apellidos || '';
      const rut = student.rut || '';
      const carrera = student.carrera || student.institucion?.carrera_especialidad || '';
      const estado = student.estado || 'Activo';
      
      const matchesSearch = 
        nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rut.includes(searchTerm);
      
      const matchesCarrera = !filterCarrera || carrera === filterCarrera;
      const matchesEstado = !filterEstado || estado === filterEstado;
      
      return matchesSearch && matchesCarrera && matchesEstado;
    });

    // Ordenar
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [students, searchTerm, filterCarrera, filterEstado, sortField, sortDirection]);

  const handleSort = (field: keyof Estudiante) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleVerDetalles = (studentId: number) => {
    navigate(`/estudiante/${studentId}`);
  };

  useEffect(() => {
    logger.log('🔍 Cargando estudiantes de generación:', id);
    const fetchStudents = async () => {
      try {
        const dataStudents = await apiService.EstudiantesPorGeneracion(id || '')
        setStudents(dataStudents);
        logger.log('✅ Estudiantes cargados:', dataStudents.length);
        
        // Si es una generación nueva sin estudiantes, abrir automáticamente el modal
        if (dataStudents.length === 0) {
          logger.log('📂 Generación nueva detectada, abriendo formulario...');
          // Pequeño delay para que el usuario vea la interfaz primero
          setTimeout(() => {
            setOpenCreateEstudiante(true);
          }, 500);
        }
      } catch (error) {
        logger.error('❌ Error al cargar estudiantes de generación:', error);
        setStudents([]);
      }
    }
    fetchStudents();
  }, [id, generationId]);

  const handleAddStudent = () => {
    setOpenCreateEstudiante(true);
  };

  const handleEstudianteCreated = async () => {
    // Recargar estudiantes después de crear uno nuevo
    try {
      const dataStudents = await apiService.EstudiantesPorGeneracion(id || '')
      setStudents(dataStudents);
      logger.log('✅ Estudiantes actualizados:', dataStudents.length);
    } catch (error) {
      logger.error('❌ Error al recargar estudiantes:', error);
    }
  };

  return (
    <div className="p-5 font-sans">
      <GenerationHeader
        generationYear={generationId}
        totalStudents={filteredAndSortedStudents.length}
        onBack={() => navigate('/dashboard')}
        onAddStudent={handleAddStudent}
      />

      <StudentFilterPanel
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCarrera={filterCarrera}
        onCarreraChange={setFilterCarrera}
        selectedEstado={filterEstado}
        onEstadoChange={setFilterEstado}
        carreras={carreras}
        estados={estados}
      />

      <StudentsTable
        students={filteredAndSortedStudents}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onViewDetails={handleVerDetalles}
      />

      {/* Modal para crear estudiante */}
      <CreateEstudianteModal
        open={openCreateEstudiante}
        onClose={() => setOpenCreateEstudiante(false)}
        onSuccess={handleEstudianteCreated}
        generacion={generationId}
      />
    </div>
  );
};

export default GeneracionViewSimple;