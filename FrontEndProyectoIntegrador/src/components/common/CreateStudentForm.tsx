import React, { useState } from 'react';
import { estudianteService } from '../../services';
import type { Estudiante, TipoEstudiante, StatusEstudiante } from '../../types';
import { LoadingSpinner } from '../LoadingSpinner';

interface CreateStudentFormProps {
  onSuccess?: (estudiante: Estudiante) => void;
  onCancel?: () => void;
}

const CreateStudentForm: React.FC<CreateStudentFormProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    telefono: '',
    email: '',
    fecha_de_nacimiento: '',
    generacion: new Date().getFullYear().toString(),
    tipo_de_estudiante: 'media' as TipoEstudiante,
    numero_carrera: 1,
    status: 'activo' as StatusEstudiante,
    institucionId: '' // Se necesitará seleccionar institución
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numero_carrera' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validaciones básicas
      if (!formData.nombre.trim()) {
        throw new Error('El nombre es requerido');
      }
      if (!formData.rut.trim()) {
        throw new Error('El RUT es requerido');
      }
      if (!formData.email.trim()) {
        throw new Error('El email es requerido');
      }

      const estudiante = await estudianteService.create({
        ...formData,
        fecha_de_nacimiento: formData.fecha_de_nacimiento || undefined,
        telefono: formData.telefono || undefined,
      });

      console.log('✅ Estudiante creado:', estudiante);
      onSuccess?.(estudiante);
      
      // Reset form
      setFormData({
        nombre: '',
        rut: '',
        telefono: '',
        email: '',
        fecha_de_nacimiento: '',
        generacion: new Date().getFullYear().toString(),
        tipo_de_estudiante: 'media' as TipoEstudiante,
        numero_carrera: 1,
        status: 'activo' as StatusEstudiante,
        institucionId: ''
      });

    } catch (error: any) {
      console.error('❌ Error creando estudiante:', error);
      setError(error.response?.data?.message || error.message || 'Error al crear el estudiante');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Crear Nuevo Estudiante
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Juan Pérez García"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RUT *
            </label>
            <input
              type="text"
              name="rut"
              value={formData.rut}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12.345.678-9"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="juan.perez@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+56 9 1234 5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="fecha_de_nacimiento"
              value={formData.fecha_de_nacimiento}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Generación
            </label>
            <input
              type="text"
              name="generacion"
              value={formData.generacion}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2024"
            />
          </div>
        </div>

        {/* Información Académica Básica */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Información Académica
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Carrera
              </label>
              <select
                name="numero_carrera"
                value={formData.numero_carrera}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Primera Carrera</option>
                <option value={2}>Segunda Carrera</option>
                <option value={3}>Tercera Carrera</option>
                <option value={4}>Cuarta Carrera</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="egresado">Egresado</option>
                <option value="retirado">Retirado</option>
              </select>
            </div>
          </div>
          
          {/* Información sobre defaults */}
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              📚 Los estudiantes ingresan por defecto como <strong>Enseñanza Media</strong> y pueden ser cambiados posteriormente en la vista de detalle.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Crear Estudiante
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStudentForm;