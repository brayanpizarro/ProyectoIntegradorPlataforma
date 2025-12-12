import React from 'react';
import { EntrevistaReportGenerator } from '../components/EntrevistaReportGenerator';

export const TestPDFPage: React.FC = () => {
  // Datos de prueba para la entrevista
  const entrevistaMock = {
    id: 1,
    fecha: new Date('2024-12-10T15:30:00'),
    estudiante_id: 'abc-123',
    estudiante: {
      id: 'abc-123',
      nombre: 'Juan',
      apellido_paterno: 'Pérez',
      apellido_materno: 'González',
      email: 'juan.perez@example.com',
      telefono: '+56912345678',
      fecha_nacimiento: '2005-03-15',
      rut: '12345678-9',
      direccion: 'Calle Ejemplo 123, Santiago',
      genero: 'Masculino',
      created_at: new Date(),
      updated_at: new Date()
    },
    tutor: 'María Silva',
    temas_abordados: 'Rendimiento académico, adaptación social, planificación de estudios',
    observaciones: 'El estudiante muestra buena disposición y compromiso con sus estudios. Se trabajó en estrategias de organización del tiempo.',
    texto_0: 'El estudiante llegó puntual y con buena disposición.',
    texto_1: 'Se discutieron las calificaciones del semestre y áreas de mejora.',
    texto_2: 'El estudiante mostró interés en participar en actividades extracurriculares.',
    texto_3: 'Se establecieron metas académicas para el próximo semestre.',
    texto_4: 'La familia está comprometida con el apoyo al estudiante.',
    comentarios_0: 'Buena actitud inicial',
    comentarios_1: 'Necesita reforzar matemáticas',
    comentarios_2: 'Recomendar club de ciencias',
    comentarios_3: 'Mejorar promedio en 0.5 puntos',
    comentarios_4: 'Mantener comunicación mensual',
    created_at: new Date(),
    updated_at: new Date()
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Prueba de Generación de PDF
          </h1>
          <p className="text-gray-600">
            Haz clic en el botón para generar un PDF de prueba con datos de entrevista
          </p>
        </div>

        {/* Información de la Entrevista Mock */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Datos de la Entrevista
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Fecha:</span>
              <span className="ml-2 text-gray-600">
                {entrevistaMock.fecha.toLocaleDateString('es-CL')}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Tutor:</span>
              <span className="ml-2 text-gray-600">{entrevistaMock.tutor}</span>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-gray-700">Estudiante:</span>
              <span className="ml-2 text-gray-600">
                {entrevistaMock.estudiante.nombre} {entrevistaMock.estudiante.apellido_paterno}
              </span>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-gray-700">Temas:</span>
              <span className="ml-2 text-gray-600">{entrevistaMock.temas_abordados}</span>
            </div>
          </div>
        </div>

        {/* Botón de Generación */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Generar PDF
          </h2>
          <p className="text-gray-600 mb-4">
            El PDF incluirá toda la información de la entrevista con formato profesional:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
            <li>Fecha y datos del estudiante</li>
            <li>Información del tutor</li>
            <li>Temas abordados</li>
            <li>Observaciones generales</li>
            <li>Todos los textos y comentarios registrados</li>
            <li>Numeración de páginas automática</li>
          </ul>
          
          <EntrevistaReportGenerator entrevista={entrevistaMock} />
        </div>

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            ℹ️ Instrucciones
          </h3>
          <p className="text-blue-800 text-sm">
            Al hacer clic en el botón "Generar PDF de Entrevista", se descargará automáticamente 
            un archivo PDF con el nombre "Entrevista_[Apellido]_[Nombre]_[Fecha].pdf".
            El PDF se abrirá en una nueva pestaña del navegador o se guardará en tu carpeta de descargas.
          </p>
        </div>
      </div>
    </div>
  );
};
