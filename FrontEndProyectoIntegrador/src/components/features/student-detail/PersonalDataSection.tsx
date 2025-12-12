import React, { useState, useEffect, useRef } from 'react';
import { Box, Table, TableBody, TableContainer, Paper } from '@mui/material';
import type { Estudiante } from '../../../types';
import { SectionDivider, EditableField, EditableTextarea } from './components';
import { personalDataConfig, type FieldConfig } from './config/personalDataFields';

interface PersonalDataSectionProps {
  estudiante: Estudiante;
  modoEdicion: boolean;
  onCampoChange?: (campo: string, valor: any) => void;
}

export const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({ 
  estudiante, 
  modoEdicion,
  onCampoChange 
}) => {
  // ✅ Flag para prevenir sobreescritura durante edición
  const isEditingRef = useRef(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // ✅ Inicializar formData desde el estudiante
  const initializeFormData = (student: Estudiante) => {
    const data: Record<string, any> = {};
    
    personalDataConfig.forEach(section => {
      section.campos.forEach(field => {
        let value: any = '';
        
        if (field.source === 'root') {
          value = student[field.key as keyof Estudiante] || '';
        } else if (field.source === 'informacionAcademica') {
          value = student.informacionAcademica?.[field.key as keyof typeof student.informacionAcademica] || '';
        } else if (field.source === 'institucion') {
          if (field.key === 'nombre') {
            value = student.institucion?.nombre || '';
          } else {
            value = student.institucion?.[field.key as keyof typeof student.institucion] || '';
          }
        }
        
        // Formatear fecha si es necesario
        if (field.type === 'date' && value) {
          value = typeof value === 'string' 
            ? value.split('T')[0]
            : new Date(value).toISOString().split('T')[0];
        }
        
        // Convertir a string si es necesario
        data[field.key] = value !== null && value !== undefined ? String(value) : '';
      });
    });
    
    return data;
  };

  // ✅ Solo actualizar formData si NO se está editando
  useEffect(() => {
    if (!isEditingRef.current) {
      const newFormData = initializeFormData(estudiante);
      console.log('🔄 Inicializando formData:', newFormData);
      setFormData(newFormData);
    }
  }, [estudiante]);

  // ✅ Activar flag cuando entra en modo edición
  useEffect(() => {
    if (modoEdicion) {
      isEditingRef.current = true;
    } else {
      isEditingRef.current = false;
    }
  }, [modoEdicion]);

  // ✅ Handler para cambios en inputs
  const handleFieldChange = (campo: string, valor: any) => {
    console.log(`📝 Cambiando campo: ${campo}, valor:`, valor);
    
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));

    // Notificar al componente padre si existe callback
    if (onCampoChange) {
      onCampoChange(campo, valor);
    }
  };

  // ✅ Helpers para renders especiales
  const calcularEdad = (fechaNacimiento?: Date | string) => {
    if (!fechaNacimiento) return 'Sin definir';
    const fecha = typeof fechaNacimiento === 'string' ? new Date(fechaNacimiento) : fechaNacimiento;
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad.toString();
  };

  const formatearPromedios = () => {
    const infoAcad = estudiante.informacionAcademica;
    if (!infoAcad) return 'Sin definir';
    
    const promedios = [
      infoAcad.promedio_1 ? `1°M: ${infoAcad.promedio_1}` : null,
      infoAcad.promedio_2 ? `2°M: ${infoAcad.promedio_2}` : null,
      infoAcad.promedio_3 ? `3°M: ${infoAcad.promedio_3}` : null,
      infoAcad.promedio_4 ? `4°M: ${infoAcad.promedio_4}` : null,
    ].filter(Boolean);

    return promedios.length > 0 ? promedios.join(' | ') : 'Sin definir';
  };

  const formatearPuntajesPAES = () => {
    const puntajes = estudiante.informacionAcademica?.puntajes_admision;
    if (!puntajes || typeof puntajes !== 'object') return 'Sin definir';
    
    return Object.entries(puntajes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' | ') || 'Sin definir';
  };

  const getTrayectoriaAcademica = () => {
    const historiales = estudiante.historialesAcademicos;
    if (!historiales || historiales.length === 0) return 'Sin definir';
    
    const trayectorias = historiales
      .flatMap(h => h.trayectoria_academica || [])
      .filter(Boolean);
    
    return trayectorias.length > 0 ? trayectorias.join(', ') : 'Sin definir';
  };

  const getBeneficiosInfo = () => {
    return estudiante.informacionAcademica?.beneficios || 'Sin definir';
  };

  // ✅ Función para renderizar campos según configuración
  const renderField = (field: FieldConfig) => {
    const value = formData[field.key] || '';
    
    // Campos con render especial
    if (field.customRender === 'textarea') {
      return (
        <EditableTextarea
          key={field.key}
          label={field.label}
          value={value}
          modoEdicion={modoEdicion}
          onChange={(val) => handleFieldChange(field.key, val)}
          placeholder={field.placeholder || `Agregar ${field.label.toLowerCase()}...`}
        />
      );
    }

    if (field.computed) {
      if (field.key === 'edad') {
        return (
          <EditableField
            key={field.key}
            label={field.label}
            value={calcularEdad(formData.fecha_de_nacimiento || estudiante.fecha_de_nacimiento)}
            modoEdicion={false}
            onChange={() => {}}
            readOnly
          />
        );
      }
    }

    if (field.customRender === 'promedios') {
      return (
        <EditableField
          key={field.key}
          label={field.label}
          value={formatearPromedios()}
          modoEdicion={false}
          onChange={() => {}}
          readOnly
        />
      );
    }

    if (field.customRender === 'paes') {
      return (
        <EditableField
          key={field.key}
          label={field.label}
          value={formatearPuntajesPAES()}
          modoEdicion={modoEdicion}
          onChange={(val) => handleFieldChange(field.key, val)}
          placeholder={field.placeholder}
        />
      );
    }

    if (field.customRender === 'trayectoria') {
      return (
        <EditableField
          key={field.key}
          label={field.label}
          value={getTrayectoriaAcademica()}
          modoEdicion={false}
          onChange={() => {}}
          readOnly
        />
      );
    }

    if (field.key === 'beneficios') {
      return (
        <EditableField
          key={field.key}
          label={field.label}
          value={getBeneficiosInfo()}
          modoEdicion={false}
          onChange={() => {}}
          readOnly
        />
      );
    }

    // Campo normal
    return (
      <EditableField
        key={field.key}
        label={field.label}
        value={value}
        type={field.type}
        modoEdicion={modoEdicion && !field.readOnly}
        onChange={(val) => handleFieldChange(field.key, val)}
        options={field.options}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        inputMode={field.inputMode}
        readOnly={field.readOnly}
      />
    );
  };

  return (
    <>
      {personalDataConfig.map((section) => (
        <Box key={section.id} sx={{ mb: 4 }}>
          {section.titulo && <SectionDivider titulo={section.titulo} />}
          <TableContainer component={Paper} elevation={2}>
            <Table size="small">
              <TableBody>
                {section.campos.map(field => renderField(field))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </>
  );
};
