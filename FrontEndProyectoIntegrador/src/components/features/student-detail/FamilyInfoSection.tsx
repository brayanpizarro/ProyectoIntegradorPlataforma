/**
 * Sección de información familiar
 * Muestra tabla con datos de familia y observaciones
 */
import React from 'react';
import type { Estudiante } from '../../../types';

interface FamilyInfoSectionProps {
  estudiante: Estudiante;
  modoEdicion: boolean;
}

export const FamilyInfoSection: React.FC<FamilyInfoSectionProps> = ({ estudiante, modoEdicion }) => {
  // Helper para acceder a datos de familia de forma segura
  const familia = estudiante.familia;
  
  // Formatear descripciones como string para mostrar
  const formatearDescripciones = (descripciones?: string[]) => {
    if (!descripciones || descripciones.length === 0) return '';
    return descripciones.join('\n');
  };
  
  // Formatear hermanos para mostrar
  const formatearHermanos = () => {
    if (!familia?.hermanos || familia.hermanos.length === 0) return '';
    return familia.hermanos.map(h => h.nombre || h).join('; ');
  };
  
  // Formatear otros familiares
  const formatearOtrosFamiliares = () => {
    if (!familia?.otros_familiares || familia.otros_familiares.length === 0) return '';
    return familia.otros_familiares.map(f => f.nombre || f).join('; ');
  };
  return (
    <div>
      <div className="bg-[var(--color-turquoise)] text-white text-center font-bold text-xl py-3 mb-4">
        Información Familiar
      </div>
      <table 
        className="w-full border-collapse border border-gray-300"
        role="table"
        aria-label="Tabla de información familiar del estudiante"
      >
        <thead>
          <tr>
            <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-1/5">Familiar</th>
            <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300">Observaciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-bold p-2 bg-gray-100 border border-gray-300">
              {modoEdicion ? (
                <div>
                  <input type="text" defaultValue="Mamá" className="font-bold mb-1 w-full px-2 py-1 border border-gray-300 rounded" disabled />
                  <input type="text" defaultValue={familia?.nombre_madre || ''} className="text-sm font-normal w-full px-2 py-1 border border-gray-300 rounded mt-1" placeholder="Nombre de la madre" />
                </div>
              ) : (
                <div>
                  <div className="font-bold mb-1">Mamá</div>
                  <div className="text-sm font-normal">{familia?.nombre_madre || 'Sin definir'}</div>
                </div>
              )}
            </td>
            <td className="p-2 border border-gray-300">
              {modoEdicion ? (
                <textarea 
                  className="w-full min-h-[100px] px-2 py-1 border border-gray-300 rounded resize-y text-sm"
                  defaultValue={formatearDescripciones(familia?.descripcion_madre)}
                  placeholder="Observaciones sobre la madre..."
                />
              ) : (
                <div className="text-sm whitespace-pre-line">
                  {formatearDescripciones(familia?.descripcion_madre) || 'Sin observaciones'}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-gray-100 border border-gray-300">
              {modoEdicion ? (
                <div>
                  <input type="text" defaultValue="Papá" className="font-bold mb-1 w-full px-2 py-1 border border-gray-300 rounded" disabled />
                  <input type="text" defaultValue={familia?.nombre_padre || ''} className="text-sm font-normal w-full px-2 py-1 border border-gray-300 rounded mt-1" placeholder="Nombre del padre" />
                </div>
              ) : (
                <div>
                  <div className="font-bold mb-1">Papá</div>
                  <div className="text-sm font-normal">{familia?.nombre_padre || 'Sin definir'}</div>
                </div>
              )}
            </td>
            <td className="p-2 border border-gray-300">
              {modoEdicion ? (
                <textarea 
                  className="w-full min-h-[60px] px-2 py-1 border border-gray-300 rounded resize-y text-sm"
                  defaultValue={formatearDescripciones(familia?.descripcion_padre)}
                  placeholder="Observaciones sobre el padre..."
                />
              ) : (
                <div className="text-sm whitespace-pre-line">
                  {formatearDescripciones(familia?.descripcion_padre) || 'Sin observaciones'}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-gray-100 border border-gray-300">
              {modoEdicion ? (
                <div>
                  <input type="text" defaultValue="Hermanas/os" className="font-bold mb-1 w-full px-2 py-1 border border-gray-300 rounded" disabled />
                  <input type="text" defaultValue={formatearHermanos()} className="text-sm font-normal w-full px-2 py-1 border border-gray-300 rounded mt-1" placeholder="Nombres de hermanos separados por ; " />
                </div>
              ) : (
                <div>
                  <div className="font-bold mb-1">Hermanas/os</div>
                  <div className="text-sm font-normal">{formatearHermanos() || 'Sin definir'}</div>
                </div>
              )}
            </td>
            <td className="p-2 border border-gray-300">
              {modoEdicion ? (
                <textarea 
                  className="w-full min-h-[80px] px-2 py-1 border border-gray-300 rounded resize-y text-sm"
                  defaultValue={familia?.observaciones?.hermanos ? familia.observaciones.hermanos.join('\n') : ''}
                  placeholder="Observaciones sobre hermanos..."
                />
              ) : (
                <div className="text-sm whitespace-pre-line">
                  {familia?.observaciones?.hermanos ? familia.observaciones.hermanos.join('\n') : 'Sin observaciones'}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-gray-100 border border-gray-300">
              {modoEdicion ? (
                <div>
                  <input type="text" defaultValue="Otros familiares significativos" className="font-bold mb-1 w-full px-2 py-1 border border-gray-300 rounded" disabled />
                  <input type="text" defaultValue={formatearOtrosFamiliares()} className="text-sm font-normal w-full px-2 py-1 border border-gray-300 rounded mt-1" placeholder="Otros familiares separados por ; " />
                </div>
              ) : (
                <div>
                  <div className="font-bold mb-1">Otros familiares significativos</div>
                  <div className="text-sm font-normal">{formatearOtrosFamiliares() || 'Sin definir'}</div>
                </div>
              )}
            </td>
            <td className="p-2 border border-gray-300">
              {modoEdicion ? (
                <textarea 
                  className="w-full min-h-[60px] px-2 py-1 border border-gray-300 rounded resize-y text-sm"
                  defaultValue={familia?.observaciones?.general ? familia.observaciones.general.join('\n') : ''}
                  placeholder="Observaciones sobre otros familiares..."
                />
              ) : (
                <div className="text-sm whitespace-pre-line">
                  {familia?.observaciones?.general ? familia.observaciones.general.join('\n') : 'Sin observaciones'}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-gray-100 border border-gray-300"><strong>Observaciones Generales</strong></td>
            <td className="p-2 border border-gray-300">
              {modoEdicion ? (
                <textarea 
                  className="w-full min-h-[100px] px-2 py-1 border border-gray-300 rounded resize-y"
                  defaultValue={familia?.observaciones?.general ? familia.observaciones.general.join('\n') : ''}
                  placeholder="Agregar observaciones generales sobre la familia..."
                />
              ) : (
                <div className="text-sm whitespace-pre-line">
                  {familia?.observaciones?.general ? familia.observaciones.general.join('\n') : 'Sin observaciones generales'}
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

