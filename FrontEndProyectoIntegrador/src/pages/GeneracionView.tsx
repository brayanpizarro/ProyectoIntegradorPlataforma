import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { obtenerEstudiantesPorGeneracion } from '../data/mockData';
import type { Estudiante } from '../types';

export const GeneracionView = () => {
  const navigate = useNavigate();
  const { año } = useParams();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/');
        return;
      }
      try {
        const añoActual = parseInt(año || '2024');
        const data = obtenerEstudiantesPorGeneracion(añoActual);
        
        // Convertir EstudianteMock[] a Estudiante[]
        const estudiantesConvertidos = data.map(mock => ({
          ...mock,
          id_estudiante: mock.id_estudiante || mock.id.toString(),
          nombre: mock.nombre || `${mock.nombres} ${mock.apellidos}`,
          tipo_de_estudiante: mock.tipo_de_estudiante || 'UNIVERSITARIO'
        })) as Estudiante[];
        
        setEstudiantes(estudiantesConvertidos);
      } catch (error) {
        console.error('Error loading students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [año, navigate]);

  const handleStudentClick = (estudiante: Estudiante) => {
    navigate(`/entrevista-workspace/${estudiante.id}`);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Estudiantes - Generación {año}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {estudiantes.map((estudiante) => (
          <div
            key={estudiante.id}
            onClick={() => handleStudentClick(estudiante)}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="font-semibold text-gray-900">{estudiante.nombre}</h3>
            <p className="text-sm text-gray-600">{estudiante.email}</p>
            <p className="text-sm text-gray-600">{estudiante.telefono}</p>
          </div>
        ))}
      </div>
      
      {estudiantes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No hay estudiantes registrados para la generación {año}</p>
        </div>
      )}
    </div>
  );
};