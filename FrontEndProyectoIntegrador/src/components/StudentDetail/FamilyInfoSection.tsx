/**
 * Sección de información familiar
 * Muestra tabla con datos de familia y observaciones
 */
import React from 'react';

interface FamilyInfoSectionProps {
  modoEdicion: boolean;
}



export const FamilyInfoSection: React.FC<FamilyInfoSectionProps> = ({ modoEdicion }) => {
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
                  <input type="text" defaultValue="Mamá" className="font-bold mb-1 w-full px-2 py-1 border border-gray-300 rounded" />
                  <input type="text" defaultValue="María (65 años)" className="text-sm font-normal w-full px-2 py-1 border border-gray-300 rounded mt-1" />
                </div>
              ) : (
                <div>
                  <div className="font-bold mb-1">Mamá</div>
                  <div className="text-sm font-normal">María (65 años)</div>
                </div>
              )}
            </td>
            <td className="p-2 border border-gray-300">
              {modoEdicion ? (
                <textarea 
                  className="w-full min-h-[100px] px-2 py-1 border border-gray-300 rounded resize-y text-sm"
                  defaultValue="2021.05.11: Conversan para organizarse con la ayuda que le entrega la Fundación.\nHa mejorado su relación con su mamá desde que ingresó a la beca.\n2022.09.02: Está enferma, pero ya se encuentra mejor."
                />
              ) : (
                <div className="flex flex-col gap-2 text-sm">
                  <div><strong>2021.05.11:</strong> Conversan para organizarse con la ayuda que le entrega la Fundación.</div>
                  <div>Ha mejorado su relación con su mamá desde que ingresó a la beca.</div>
                  <div><strong>2022.09.02:</strong> Está enferma, pero ya se encuentra mejor.</div>
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-gray-100 border border-gray-300">
              {modoEdicion ? (
                <div>
                  <input type="text" defaultValue="Papá" className="font-bold mb-1 w-full px-2 py-1 border border-gray-300 rounded" />
                  <input type="text" defaultValue="Pedro (61 años)" className="text-sm font-normal w-full px-2 py-1 border border-gray-300 rounded mt-1" />
                </div>
              ) : (
                <div>
                  <div className="font-bold mb-1">Papá</div>
                  <div className="text-sm font-normal">Pedro (61 años)</div>
                </div>
              )}
            </td>
            <td className="p-2 border border-gray-300">
              {modoEdicion ? (
                <textarea 
                  className="w-full min-h-[60px] px-2 py-1 border border-gray-300 rounded resize-y text-sm"
                  defaultValue="2021.05.11: Vive fuera de la región, no tienen contacto directo."
                />
              ) : (
                <div className="text-sm">
                  <strong>2021.05.11:</strong> Vive fuera de la región, no tienen contacto directo.
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-gray-100 border border-gray-300">
              {modoEdicion ? (
                <div>
                  <input type="text" defaultValue="Hermanas/os" className="font-bold mb-1 w-full px-2 py-1 border border-gray-300 rounded" />
                  <input type="text" defaultValue="Carlos (25); Pedro (18); María (11)" className="text-sm font-normal w-full px-2 py-1 border border-gray-300 rounded mt-1" />
                </div>
              ) : (
                <div>
                  <div className="font-bold mb-1">Hermanas/os</div>
                  <div className="text-sm font-normal">Carlos (25); Pedro (18); María (11)</div>
                </div>
              )}
            </td>
            <td className="p-2 border border-gray-300">
              {modoEdicion ? (
                <textarea 
                  className="w-full min-h-[80px] px-2 py-1 border border-gray-300 rounded resize-y text-sm"
                  defaultValue="2021.05.11: Comparte habitación con sus hermanos menores.\n2022.05.04: Fue el cumpleaños de su hermana menor, organizaron una pequeña celebración."
                />
              ) : (
                <div className="flex flex-col gap-2 text-sm">
                  <div><strong>2021.05.11:</strong> Comparte habitación con sus hermanos menores.</div>
                  <div><strong>2022.05.04:</strong> Fue el cumpleaños de su hermana menor, organizaron una pequeña celebración.</div>
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-gray-100 border border-gray-300">
              {modoEdicion ? (
                <div>
                  <input type="text" defaultValue="Otros familiares significativos" className="font-bold mb-1 w-full px-2 py-1 border border-gray-300 rounded" />
                  <input type="text" defaultValue="Abuela materna (Juana); Tío materno (Claudio)" className="text-sm font-normal w-full px-2 py-1 border border-gray-300 rounded mt-1" />
                </div>
              ) : (
                <div>
                  <div className="font-bold mb-1">Otros familiares significativos</div>
                  <div className="text-sm font-normal">Abuela materna (Juana); Tío materno (Claudio)</div>
                </div>
              )}
            </td>
            <td className="p-2 border border-gray-300">
              {modoEdicion ? (
                <textarea 
                  className="w-full min-h-[60px] px-2 py-1 border border-gray-300 rounded resize-y text-sm"
                  defaultValue="2024.11.23: Su tío llegó a vivir a su casa. Son muy cercanos y él le ayuda con sus estudios."
                />
              ) : (
                <div className="text-sm">
                  <strong>2024.11.23:</strong> Su tío llegó a vivir a su casa. Son muy cercanos y él le ayuda con sus estudios.
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-gray-100 border border-gray-300"><strong>Observaciones Generales</strong></td>
            <td className="p-2 border border-gray-300">
              <textarea 
                className="w-full min-h-[100px] px-2 py-1 border border-gray-300 rounded resize-y"
                placeholder="Agregar observaciones generales sobre la familia..."
                disabled={!modoEdicion}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

