import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const LeadForm = ({ onLeadAdded }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

      if(!nombre.trim() || !email.trim()) {
        toast.error('Por favor, completa todos los campos antes de enviar.');
        return;
      }

      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error('Por favor, ingresa un correo electrónico válido.');
        return;
      }

    setLoading(true);
    setError(null);

    try {
      await api.post('/leads', { nombre, email });
      setNombre('');
      setEmail('');
      toast.success('¡Acción realizada con éxito!');
      onLeadAdded();
    } catch (error) {
      console.error('Detalle del error:', error);

      if(error.response) {

        if (error.response.status === 400) {
          toast.error(error.response.data.message || 'Error de validación o correo duplicado.');
        } else {
          toast.error(`Error del servidor: ${error.response.status}`);
        }
      }

      else if (error.request) {
        toast.error('No se pudo conectar con el servidor. (API inaccesible)');
      } 
      else{
        toast.error('Error desconocido. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-8 transition-colors">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Agregar Nuevo Lead</h2>
      
      <form noValidate onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="w-full">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
        {/* Se usan inputs controlados para que React sea la unica fuente de la verdad, esto permite limpiar el formulario después de enviarlo */ }
          <input
            type="text"
            id="nombre"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Ej. Juan Pérez"
          />
        </div>
        
        <div className="w-full">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="juan@ejemplo.com"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-blue-300 dark:disabled:bg-blue-800 transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
      
      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default LeadForm;