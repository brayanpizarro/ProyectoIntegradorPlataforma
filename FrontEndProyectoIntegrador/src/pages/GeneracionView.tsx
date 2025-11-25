import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { logger } from '../config';
import { GenerationHeader, StudentFilterPanel, StudentsTable } from '../components/GenerationView';

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
  
  // Obtener opciones únicas para los filtros
  const carreras = [...new Set(students.map(student => student.carrera))];
  const estados = [...new Set(students.map(student => student.estado))];

  // Filtrar y ordenar estudiantes
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student => {
      const matchesSearch = 
        student.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rut.includes(searchTerm);
      
      const matchesCarrera = !filterCarrera || student.carrera === filterCarrera;
      const matchesEstado = !filterEstado || student.estado === filterEstado;
      
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
      } catch (error) {
        logger.error('❌ Error al cargar estudiantes de generación:', error);
        setStudents([]);
      }
    }
    fetchStudents();
  }, [id, generationId]);

  const handleAddStudent = () => {
    logger.log('Agregar nuevo estudiante - funcionalidad por implementar');
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
    </div>
  );
};

export default GeneracionViewSimple;