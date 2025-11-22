/**
 * Sección de datos personales del estudiante
 * Tabla editable con información personal y académica
 */
import React from 'react';
import type { Estudiante } from '../../types';

interface PersonalDataSectionProps {
  estudiante: Estudiante;
  modoEdicion: boolean;
}



export const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({ 
  estudiante, 
  modoEdicion 
}) => {
  return (
    <div>
      <div className="bg-[var(--color-turquoise)] text-white text-center font-bold text-xl py-3 mb-4">
        Datos Personales
      </div>
      <table 
        className="w-full border-collapse border border-gray-300"
        role="table"
        aria-label="Tabla de datos personales del estudiante"
      >
        <tbody>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Nombre</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.nombres || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.nombres || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Apellidos</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.apellidos || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.apellidos || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Rut</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.rut || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.rut || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Teléfono</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="tel" 
                  defaultValue={estudiante.telefono || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.telefono || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Año Ingreso Beca</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.año_generacion || '2019'}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.año_generacion || '2019'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Fecha de Nacimiento</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="date" 
                  defaultValue={typeof estudiante.fecha_de_nacimiento === 'string' ? estudiante.fecha_de_nacimiento : ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>
                  {typeof estudiante.fecha_de_nacimiento === 'string' 
                    ? new Date(estudiante.fecha_de_nacimiento).toLocaleDateString('es-CL') 
                    : 'No especificado'}
                </span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Edad</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="number" 
                  defaultValue={estudiante.edad || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.edad || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Género</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <select 
                  defaultValue={estudiante.genero || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              ) : (
                <span>{estudiante.genero || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Email</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="email" 
                  defaultValue={estudiante.email || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.email || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Dirección</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.direccion || ''}
                  placeholder="No especificado"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.direccion || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Liceo</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.liceo || ''}
                  placeholder="No especificado"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.liceo || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Especialidad</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.especialidad || ''}
                  placeholder="No especificado"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.especialidad || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Comuna Liceo</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.region || ''}
                  placeholder="No especificado"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.region || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Promedios Enseñanza Media</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.promedio_liceo || ''}
                  placeholder="No especificado"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.promedio_liceo || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Puntajes PAES 2021/1|2</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue=""
                  placeholder="Ingresar puntajes PAES"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>No especificado</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Carrera</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.carrera || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.carrera || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Duración Carrera</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.duracion_carrera || ''}
                  placeholder="Ej: 10 semestres"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.duracion_carrera || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Universidad</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.universidad || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.universidad || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Vía de acceso</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.via_acceso || ''}
                  placeholder="Ej: Regular, PACE, etc."
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.via_acceso || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Trayectoria Académica</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue="Ingresa en 2022/1S"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>Ingresa en 2022/1S</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Otros Beneficios</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="text" 
                  defaultValue={estudiante.beca || ''}
                  placeholder="Ej: Gratuidad, becas, etc."
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{estudiante.beca || 'No especificado'}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Vencimiento Gratuidad</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input 
                  type="month" 
                  defaultValue="2025-12"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>2025-12</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2022/1S</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <select className="w-full px-2 py-1 border border-gray-300 rounded" defaultValue="Estudiando">
                  <option value="Estudiando">Estudiando</option>
                  <option value="Suspendido">Suspendido</option>
                  <option value="Retirado">Retirado</option>
                </select>
              ) : (
                <span>Estudiando</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2022/2S</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <select className="w-full px-2 py-1 border border-gray-300 rounded" defaultValue="Estudiando">
                  <option value="Estudiando">Estudiando</option>
                  <option value="Suspendido">Suspendido</option>
                  <option value="Retirado">Retirado</option>
                </select>
              ) : (
                <span>Estudiando</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2023/1S</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <select className="w-full px-2 py-1 border border-gray-300 rounded" defaultValue="Estudiando">
                  <option value="Estudiando">Estudiando</option>
                  <option value="Suspendido">Suspendido</option>
                  <option value="Retirado">Retirado</option>
                </select>
              ) : (
                <span>Estudiando</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2023/2S</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <select className="w-full px-2 py-1 border border-gray-300 rounded" defaultValue="Estudiando">
                  <option value="Estudiando">Estudiando</option>
                  <option value="Suspendido">Suspendido</option>
                  <option value="Retirado">Retirado</option>
                </select>
              ) : (
                <span>Estudiando</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2024/1S</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <select className="w-full px-2 py-1 border border-gray-300 rounded" defaultValue="Estudiando">
                  <option value="Estudiando">Estudiando</option>
                  <option value="Suspendido">Suspendido</option>
                  <option value="Retirado">Retirado</option>
                </select>
              ) : (
                <span>Estudiando</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2024/2S</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <select className="w-full px-2 py-1 border border-gray-300 rounded" defaultValue="Estudiando">
                  <option value="Estudiando">Estudiando</option>
                  <option value="Suspendido">Suspendido</option>
                  <option value="Retirado">Retirado</option>
                </select>
              ) : (
                <span>Estudiando</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2025/1S</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <select className="w-full px-2 py-1 border border-gray-300 rounded" defaultValue="Estudiando">
                  <option value="Estudiando">Estudiando</option>
                  <option value="Suspendido">Suspendido</option>
                  <option value="Retirado">Retirado</option>
                </select>
              ) : (
                <span>Estudiando</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Status 2025/2S</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <select className="w-full px-2 py-1 border border-gray-300 rounded" defaultValue="Estudiando">
                  <option value="Estudiando">Estudiando</option>
                  <option value="Suspendido">Suspendido</option>
                  <option value="Retirado">Retirado</option>
                </select>
              ) : (
                <span>Estudiando</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Observaciones</td>
            <td className="p-2 border border-gray-300 bg-white">
              <textarea 
                className="w-full min-h-[100px] px-2 py-1 border border-gray-300 rounded resize-y"
                placeholder="Agregar observaciones..."
                disabled={!modoEdicion}
                defaultValue={estudiante.observaciones || ''}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};





