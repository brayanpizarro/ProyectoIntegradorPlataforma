import { useState, useCallback } from 'react';
import { estudianteService } from '../../../../services';
import { logger } from '../../../../config';
import type { Estudiante } from '../../../../types';

interface UseEstudianteEditingProps {
    estudiante: Estudiante | null;
    id?: string;
}

export const useEstudianteEditing = ({ estudiante, id }: UseEstudianteEditingProps) => {
    const [datosEditados, setDatosEditados] = useState<Partial<Estudiante>>({});

    const camposEstudiante = [
        'nombre', 'rut', 'telefono', 'email', 'genero', 'direccion',
        'fecha_de_nacimiento', 'tipo_de_estudiante', 'status', 'generacion',
        'numero_carrera', 'observaciones', 'status_detalle',
        'semestres_suspendidos', 'semestres_total_carrera'
    ];

    const handleCampoChange = useCallback((campo: string, valor: any) => {
        setDatosEditados(prev => ({
            ...prev,
            [campo]: valor
        }));
        logger.log(`📝 Estudiante - Campo editado: ${campo} =`, valor);
    }, []);

    const guardarCambios = async (): Promise<void> => {
        if (!id || Object.keys(datosEditados).length === 0) return;

        const datosEstudiante: any = {};

        // Filtrar solo los campos del estudiante
        Object.keys(datosEditados).forEach(campo => {
            if (camposEstudiante.includes(campo)) {
                datosEstudiante[campo] = (datosEditados as any)[campo];
            }
        });

        if (Object.keys(datosEstudiante).length === 0) return;

        await estudianteService.update(id, datosEstudiante);
        logger.log('✅ Datos del estudiante actualizados');
    };

    const limpiarCambios = () => {
        setDatosEditados({});
    };

    // Obtener datos combinados (originales + ediciones)
    const getDatosCombinados = () => {
        if (!estudiante) return null;

        const cambiosEstudiante: any = {};
        Object.keys(datosEditados).forEach(campo => {
            if (camposEstudiante.includes(campo)) {
                cambiosEstudiante[campo] = (datosEditados as any)[campo];
            }
        });

        return {
            ...estudiante,
            ...cambiosEstudiante
        };
    };

    const hayCambios = Object.keys(datosEditados).some(campo =>
        camposEstudiante.includes(campo)
    );

    return {
        datosEditados,
        hayCambios,
        handleCampoChange,
        guardarCambios,
        limpiarCambios,
        getDatosCombinados
    };
};
