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
  ultimaEntrevista?: string; // Fecha en formato ISO
  totalEntrevistasAno?: number;
  diasSinEntrevista?: number;
  tienePendienteNotas?: boolean;
}


// Datos mock de estudiantes por generación
const studentsByGeneration: Record<number, Estudiante[]> = {
  2024: [
    { id: 1, nombres: 'Juan Carlos', apellidos: 'Pérez González', rut: '20.123.456-7', carrera: 'Ingeniería Civil', estado: 'Activo', beca: 'Completa', universidad: 'UC', promedio: 6.2, ultimaEntrevista: '2024-11-15', totalEntrevistasAno: 3, diasSinEntrevista: 4, tienePendienteNotas: false },
    { id: 2, nombres: 'María Fernanda', apellidos: 'García López', rut: '20.234.567-8', carrera: 'Medicina', estado: 'Activo', beca: 'Parcial', universidad: 'U. Chile', promedio: 6.5, ultimaEntrevista: '2024-10-20', totalEntrevistasAno: 2, diasSinEntrevista: 30, tienePendienteNotas: false },
    { id: 3, nombres: 'Carlos Eduardo', apellidos: 'Rodríguez Silva', rut: '20.345.678-9', carrera: 'Ingeniería Informática', estado: 'Activo', beca: 'Sin beca', universidad: 'USACH', promedio: 5.8, ultimaEntrevista: '2024-08-10', totalEntrevistasAno: 1, diasSinEntrevista: 101, tienePendienteNotas: true },
    { id: 4, nombres: 'Andrea Camila', apellidos: 'Martínez Torres', rut: '20.456.789-0', carrera: 'Psicología', estado: 'Activo', beca: 'Completa', universidad: 'UCh', promedio: 6.1, ultimaEntrevista: '2024-11-10', totalEntrevistasAno: 4, diasSinEntrevista: 9, tienePendienteNotas: false },
    { id: 5, nombres: 'Luis Alberto', apellidos: 'Fernández Ruiz', rut: '20.567.890-1', carrera: 'Derecho', estado: 'Suspendido', beca: 'Parcial', universidad: 'UDD', promedio: 5.9, ultimaEntrevista: '2024-06-15', totalEntrevistasAno: 1, diasSinEntrevista: 157, tienePendienteNotas: true },
    { id: 6, nombres: 'Valentina Isabel', apellidos: 'Castro Moreno', rut: '20.678.901-2', carrera: 'Enfermería', estado: 'Activo', beca: 'Completa', universidad: 'UNAB', promedio: 6.3, ultimaEntrevista: '2024-11-18', totalEntrevistasAno: 5, diasSinEntrevista: 1, tienePendienteNotas: false },
    { id: 7, nombres: 'Roberto Miguel', apellidos: 'Herrera Vega', rut: '20.789.012-3', carrera: 'Arquitectura', estado: 'Activo', beca: 'Sin beca', universidad: 'UC', promedio: 5.7, ultimaEntrevista: '2024-09-05', totalEntrevistasAno: 2, diasSinEntrevista: 75, tienePendienteNotas: false },
    { id: 8, nombres: 'Francisca Alejandra', apellidos: 'Soto Díaz', rut: '20.890.123-4', carrera: 'Kinesiología', estado: 'Activo', beca: 'Parcial', universidad: 'UDP', promedio: 6.0, ultimaEntrevista: '2024-11-12', totalEntrevistasAno: 3, diasSinEntrevista: 7, tienePendienteNotas: false }
  ],
  2023: [
    { id: 9, nombres: 'Diego Sebastián', apellidos: 'Núñez Aguilar', rut: '19.123.456-8', carrera: 'Ingeniería Civil', estado: 'Activo', beca: 'Completa', universidad: 'UC', promedio: 6.4, ultimaEntrevista: '2024-11-01', totalEntrevistasAno: 3, diasSinEntrevista: 18, tienePendienteNotas: false },
    { id: 10, nombres: 'Camila Andrea', apellidos: 'Vargas Mendoza', rut: '19.234.567-9', carrera: 'Medicina Veterinaria', estado: 'Egresado', beca: 'Sin beca', universidad: 'U. Chile', promedio: 6.2, ultimaEntrevista: '2024-07-20', totalEntrevistasAno: 2, diasSinEntrevista: 122, tienePendienteNotas: false },
    { id: 11, nombres: 'Matías Ignacio', apellidos: 'Rojas Espinoza', rut: '19.345.678-0', carrera: 'Ingeniería Industrial', estado: 'Activo', beca: 'Parcial', universidad: 'USACH', promedio: 5.9, ultimaEntrevista: '2024-10-30', totalEntrevistasAno: 2, diasSinEntrevista: 20, tienePendienteNotas: false },
    { id: 12, nombres: 'Sofía Esperanza', apellidos: 'Jiménez Parra', rut: '19.456.789-1', carrera: 'Periodismo', estado: 'Congelado', beca: 'Completa', universidad: 'UDP', promedio: 6.1, ultimaEntrevista: '2024-05-10', totalEntrevistasAno: 1, diasSinEntrevista: 193, tienePendienteNotas: true },
    { id: 13, nombres: 'Benjamín Alonso', apellidos: 'Morales Contreras', rut: '19.567.890-2', carrera: 'Contador Auditor', estado: 'Activo', beca: 'Sin beca', universidad: 'USACH', promedio: 5.8, ultimaEntrevista: '2024-11-05', totalEntrevistasAno: 4, diasSinEntrevista: 14, tienePendienteNotas: false },
    { id: 14, nombres: 'Isidora Constanza', apellidos: 'Paredes Flores', rut: '19.678.901-3', carrera: 'Trabajo Social', estado: 'Activo', beca: 'Parcial', universidad: 'UCh', promedio: 6.0, ultimaEntrevista: '2024-11-08', totalEntrevistasAno: 3, diasSinEntrevista: 11, tienePendienteNotas: false }
  ],
  2022: [
    { id: 15, nombres: 'Joaquín Andrés', apellidos: 'Gutiérrez Sanchez', rut: '18.123.456-9', carrera: 'Ingeniería Comercial', estado: 'Egresado', beca: 'Completa', universidad: 'UDD', promedio: 6.3, ultimaEntrevista: '2024-08-15', totalEntrevistasAno: 2, diasSinEntrevista: 96, tienePendienteNotas: false },
    { id: 16, nombres: 'Antonia Beatriz', apellidos: 'Ramos Poblete', rut: '18.234.567-0', carrera: 'Fonoaudiología', estado: 'Activo', beca: 'Sin beca', universidad: 'UC', promedio: 6.1, ultimaEntrevista: '2024-10-25', totalEntrevistasAno: 2, diasSinEntrevista: 25, tienePendienteNotas: false },
    { id: 17, nombres: 'Nicolás Emilio', apellidos: 'Carrasco León', rut: '18.345.678-1', carrera: 'Química Industrial', estado: 'Desertor', beca: 'Parcial', universidad: 'USACH', promedio: 5.6, ultimaEntrevista: '2024-04-10', totalEntrevistasAno: 1, diasSinEntrevista: 223, tienePendienteNotas: true },
    { id: 18, nombres: 'Javiera Monserrat', apellidos: 'Figueroa Ríos', rut: '18.456.789-2', carrera: 'Educación Parvularia', estado: 'Activo', beca: 'Completa', universidad: 'UMCE', promedio: 6.2, ultimaEntrevista: '2024-11-14', totalEntrevistasAno: 4, diasSinEntrevista: 5, tienePendienteNotas: false },
    { id: 19, nombres: 'Felipe Cristóbal', apellidos: 'Maldonado Vera', rut: '18.567.890-3', carrera: 'Ingeniería en Minas', estado: 'Activo', beca: 'Sin beca', universidad: 'U. Chile', promedio: 5.9, ultimaEntrevista: '2024-11-02', totalEntrevistasAno: 3, diasSinEntrevista: 17, tienePendienteNotas: false },
    { id: 20, nombres: 'Macarena Victoria', apellidos: 'Sandoval Muñoz', rut: '18.678.901-4', carrera: 'Nutrición', estado: 'Activo', beca: 'Parcial', universidad: 'UNAB', promedio: 6.0, ultimaEntrevista: '2024-10-28', totalEntrevistasAno: 3, diasSinEntrevista: 22, tienePendienteNotas: false }
  ]
};

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
        logger.warn('⚠️ Usando datos mock para generación', generationId);
        setStudents(studentsByGeneration[generationId] || []);
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