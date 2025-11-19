import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

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

  const getSortIcon = (field: keyof Estudiante) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Activo': return '#4CAF50';        // Verde
      case 'Egresado': return '#2196F3';      // Azul
      case 'Suspendido': return '#FF9800';    // Naranja
      case 'Desertor': return '#f44336';      // Rojo
      case 'Congelado': return '#9E9E9E';     // Gris
      default: return '#757575';
    }
  };

  useEffect(() => {
    console.log('Fetching students for generation example');
    const fetchStudents = async () => {
      try {
        const dataStudents = await apiService.EstudiantesPorGeneracion(id || '')
        setStudents(dataStudents);
      } catch (error) {
        setStudents(studentsByGeneration[generationId] || []);
      }
    }
    fetchStudents();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: '20px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#333',
            margin: '0 0 10px 0'
          }}>
            Estudiantes Generación {generationId}
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: '1.1rem',
            margin: 0
          }}>
            {filteredAndSortedStudents.length} estudiante{filteredAndSortedStudents.length !== 1 ? 's' : ''} encontrado{filteredAndSortedStudents.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ← Volver al Dashboard
          </button>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            + Agregar Estudiante
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div style={{ 
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold',
            color: '#495057'
          }}>
            Buscar estudiante:
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nombre, apellido o RUT..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold',
            color: '#495057'
          }}>
            Carrera:
          </label>
          <select
            value={filterCarrera}
            onChange={(e) => setFilterCarrera(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          >
            <option value="">Todas las carreras</option>
            {carreras.map(carrera => (
              <option key={carrera} value={carrera}>{carrera}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold',
            color: '#495057'
          }}>
            Estado:
          </label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          >
            <option value="">Todos los estados</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Tabla de estudiantes */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '0.9rem'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th 
                onClick={() => handleSort('apellidos')}
                style={{ 
                  padding: '15px 10px', 
                  textAlign: 'left', 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  borderBottom: '2px solid #dee2e6',
                  color: '#495057'
                }}
              >
                Nombre {getSortIcon('apellidos')}
              </th>
              <th 
                onClick={() => handleSort('carrera')}
                style={{ 
                  padding: '15px 10px', 
                  textAlign: 'left', 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  borderBottom: '2px solid #dee2e6',
                  color: '#495057'
                }}
              >
                Carrera {getSortIcon('carrera')}
              </th>
              <th 
                onClick={() => handleSort('estado')}
                style={{ 
                  padding: '15px 10px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  borderBottom: '2px solid #dee2e6',
                  color: '#495057'
                }}
              >
                Estado {getSortIcon('estado')}
              </th>
              <th 
                onClick={() => handleSort('promedio')}
                style={{ 
                  padding: '15px 10px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  borderBottom: '2px solid #dee2e6',
                  color: '#495057'
                }}
              >
                Promedio {getSortIcon('promedio')}
              </th>
              <th style={{ 
                padding: '15px 10px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                borderBottom: '2px solid #dee2e6',
                color: '#495057',
                minWidth: '120px'
              }}>
                Última Entrevista
              </th>
              <th style={{ 
                padding: '15px 10px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                borderBottom: '2px solid #dee2e6',
                color: '#495057'
              }}>
                Entrevistas (Año)
              </th>
              <th style={{ 
                padding: '15px 10px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                borderBottom: '2px solid #dee2e6',
                color: '#495057'
              }}>
                Alertas
              </th>
              <th style={{ 
                padding: '15px 10px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                borderBottom: '2px solid #dee2e6',
                color: '#495057'
              }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedStudents.map((student, index) => (
              <tr 
                key={student.id}
                style={{ 
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#e3f2fd';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : 'white';
                }}
              >
                <td style={{ padding: '12px 10px', borderBottom: '1px solid #dee2e6' }}>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                    {student.nombres} {student.apellidos}
                  </div>
                </td>
                <td style={{ padding: '12px 10px', borderBottom: '1px solid #dee2e6', color: '#666' }}>
                  {student.carrera}
                </td>
                <td style={{ padding: '12px 10px', borderBottom: '1px solid #dee2e6', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: getEstadoColor(student.estado)
                  }}>
                    {student.estado}
                  </span>
                </td>
                <td style={{ 
                  padding: '12px 10px', 
                  borderBottom: '1px solid #dee2e6', 
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: student.promedio >= 6.0 ? '#4CAF50' : student.promedio >= 5.5 ? '#FF9800' : '#f44336'
                }}>
                  {student.promedio.toFixed(1)}
                </td>
                <td style={{ padding: '12px 10px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontSize: '0.85rem' }}>
                  {student.ultimaEntrevista ? 
                    new Date(student.ultimaEntrevista).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : 'Sin registro'}
                </td>
                <td style={{ padding: '12px 10px', borderBottom: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold', fontSize: '1rem' }}>
                  {student.totalEntrevistasAno || 0}
                </td>
                <td style={{ padding: '12px 10px', borderBottom: '1px solid #dee2e6', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {(student.diasSinEntrevista && student.diasSinEntrevista > 60) && (
                      <span 
                        style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          backgroundColor: '#FFF3CD',
                          color: '#856404',
                          border: '1px solid #FFEAA7'
                        }}
                        title={`${student.diasSinEntrevista} días sin entrevista`}
                      >
                        ⏰ {student.diasSinEntrevista}d
                      </span>
                    )}
                    {student.tienePendienteNotas && (
                      <span 
                        style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          backgroundColor: '#F8D7DA',
                          color: '#721C24',
                          border: '1px solid #F5C6CB'
                        }}
                        title="Pendiente de notas"
                      >
                        📝
                      </span>
                    )}
                    {!student.diasSinEntrevista || (student.diasSinEntrevista <= 60 && !student.tienePendienteNotas) ? (
                      <span style={{ color: '#999', fontSize: '0.8rem' }}>—</span>
                    ) : null}
                  </div>
                </td>
                <td style={{ padding: '12px 10px', borderBottom: '1px solid #dee2e6', textAlign: 'center' }}>
                  <button
                    onClick={() => handleVerDetalles(student.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#0056b3';
                    }}
                    onMouseOut={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#007bff';
                    }}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedStudents.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>
            No se encontraron estudiantes
          </h3>
          <p style={{ color: '#6c757d' }}>
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default GeneracionViewSimple;