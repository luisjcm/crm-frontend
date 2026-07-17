import { useState } from 'react';
import api from '../services/api';

const LeadForm = ({ onLeadAdded }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setLoading(true);
    setError(null);

    try {
      // Hacemos el POST a nuestra API
      await api.post('/leads', { nombre, email });
      
      // Limpiamos el formulario
      setNombre('');
      setEmail('');
      
      // Le avisamos al Dashboard que actualice la lista
      onLeadAdded();
    } catch (err) {
      console.error(err);
      setError('Hubo un error al guardar el lead. Verifica que el email no esté repetido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Agregar Nuevo Lead</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="w-full">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            id="nombre"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Ej. Juan Pérez"
          />
        </div>
        
        <div className="w-full">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="juan@ejemplo.com"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
      
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default LeadForm;