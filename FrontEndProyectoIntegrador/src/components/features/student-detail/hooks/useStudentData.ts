import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  authService, 
  estudianteService, 
  historialAcademicoService,
  estadoAcademicoService,
  informacionContactoService,
  informacionAcademicaService
} from '../../../../services';
import type { Estudiante } from '../../../../types';
import { logger } from '../../../../config';

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
        
        // Cargar información adicional de las tablas refactorizadas
        try {
          const estadoAcademico = await estadoAcademicoService.getByEstudiante(id);
          if (estadoAcademico) {
            (data as any).status = estadoAcademico.status;
            (data as any).status_detalle = estadoAcademico.status_detalle;
          }
        } catch (err) {
          logger.warn('⚠️ No se pudo cargar estado académico:', err);
        }

        try {
          const contacto = await informacionContactoService.getByEstudiante(id);
          if (contacto) {
            (data as any).email = contacto.email;
            (data as any).telefono = contacto.telefono;
            (data as any).direccion = contacto.direccion;
          }
        } catch (err) {
          logger.warn('⚠️ No se pudo cargar información de contacto:', err);
        }

        // Cargar información académica siempre para asegurar datos frescos
        try {
          const infoAcademica = await informacionAcademicaService.getByEstudiante(id);
          if (infoAcademica) {
            (data as any).informacionAcademica = infoAcademica;
          }
        } catch (err) {
          // Si falla (ej. NotFound), conservar cualquier infoAcademica que ya viniera en el payload
          logger.warn('⚠️ No se pudo cargar información académica:', err);
        }
        
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
      logger.log('🔄 Recargando datos del estudiante...');
      const dataActualizada = await estudianteService.getById(id);
      
      // Recargar información adicional de las tablas refactorizadas
      try {
        const estadoAcademico = await estadoAcademicoService.getByEstudiante(id);
        if (estadoAcademico) {
          (dataActualizada as any).status = estadoAcademico.status;
          (dataActualizada as any).status_detalle = estadoAcademico.status_detalle;
        }
      } catch (err) {
        logger.warn('⚠️ No se pudo recargar estado académico:', err);
      }

      try {
        const contacto = await informacionContactoService.getByEstudiante(id);
        if (contacto) {
          (dataActualizada as any).email = contacto.email;
          (dataActualizada as any).telefono = contacto.telefono;
          (dataActualizada as any).direccion = contacto.direccion;
        }
      } catch (err) {
        logger.warn('⚠️ No se pudo recargar información de contacto:', err);
      }
      
      // Forzar recarga de información académica (siempre para obtener últimos datos)
      try {
        const infoAcademica = await informacionAcademicaService.getByEstudiante(id);
        if (infoAcademica) {
          dataActualizada.informacionAcademica = infoAcademica;
        }
      } catch (err) {
        // Si falla, no sobrescribir lo que ya teníamos en memoria
        logger.warn('⚠️ No se pudo recargar información académica:', err);
      }
      
      setEstudiante(dataActualizada);
      logger.log('✅ Datos del estudiante recargados correctamente');
      logger.log('📊 Datos recargados:', {
        nombre: dataActualizada.nombre,
        email: (dataActualizada as any).email,
        telefono: (dataActualizada as any).telefono,
        direccion: (dataActualizada as any).direccion,
        status: (dataActualizada as any).status,
        informacionAcademica: dataActualizada.informacionAcademica ? 'Cargada' : 'No cargada',
        institucion: dataActualizada.institucion ? 'Cargada' : 'No cargada'
      });
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