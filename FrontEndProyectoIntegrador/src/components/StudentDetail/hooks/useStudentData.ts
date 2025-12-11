import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService, estudianteService, historialAcademicoService } from '../../../services';
import type { Estudiante } from '../../../types';
import { logger } from '../../../config';

export const useStudentData = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [informesGuardados, setInformesGuardados] = useState<any[]>([]);

  // Cargar datos del estudiante
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }
    
    const fetchEstudiante = async () => {
      if (!id) {
        setError('ID de estudiante no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        logger.log('🔍 Cargando estudiante:', id);
        
        const data = await estudianteService.getById(id);
        setEstudiante(data);
        
        logger.log('✅ Estudiante cargado:', data.nombre);
      } catch (err: any) {
        logger.error('❌ Error al cargar estudiante:', err);
        setError(err.message || 'Error al cargar el estudiante');
        setEstudiante(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEstudiante();
  }, [navigate, id]);

  // Cargar historial académico
  useEffect(() => {
    if (!id) return;

    const cargarHistorialAcademico = async () => {
      try {
        const historiales = await historialAcademicoService.getByEstudiante(id);
        setInformesGuardados(Array.isArray(historiales) ? historiales : []);
        logger.log('📂 Historial académico cargado:', Array.isArray(historiales) ? historiales.length : 0, 'registros');
      } catch (err) {
        logger.error('❌ Error al cargar historial académico:', err);
      }
    };

    cargarHistorialAcademico();
  }, [id]);

  // Recargar datos del estudiante
  const reloadStudentData = async () => {
    if (!id) return;

    try {
      const dataActualizada = await estudianteService.getById(id);
      setEstudiante(dataActualizada);
      logger.log('🔄 Datos del estudiante recargados');
    } catch (err: any) {
      logger.error('❌ Error al recargar datos:', err);
      throw err;
    }
  };

  return {
    id,
    estudiante,
    setEstudiante,
    loading,
    error,
    informesGuardados,
    setInformesGuardados,
    reloadStudentData
  };
};