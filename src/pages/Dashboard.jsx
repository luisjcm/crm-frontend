import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import LeadForm from '../components/LeadForm';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hook para cargar los datos apenas se abre la página
 // 1. Envolvemos la función en useCallback
  const fetchLeads = useCallback(async () => {
    try {
      const response = await api.get('/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('❌ Error obteniendo los leads:', error);
    } finally {
      setLoading(false);
    }
  }, []); // 2. Arreglo vacío: la función se memoriza una sola vez

  // 3. Agregamos fetchLeads como dependencia del useEffect
  useEffect(() => {
    // Envolvemos la ejecución en una función asíncrona interna
    const initFetch = async () => {
      await fetchLeads();
    };

    initFetch();
  }, [fetchLeads]);

  // 🚀 NUEVA FUNCIÓN: Actualizar estado
  const updateStatus = async (id, nuevoEstado) => {
    try {
      await api.patch(`/leads/${id}/status`, { estado: nuevoEstado });
      fetchLeads(); // Recargamos la tabla para ver el cambio
    } catch (error) {
      console.error('❌ Error actualizando el estado:', error);
      alert('Hubo un error al actualizar el estado.');
    }
  };

  // 🚀 NUEVA FUNCIÓN: Eliminar lead
  const deleteLead = async (id) => {
    // Pedimos confirmación antes de borrar
    if (!window.confirm('¿Estás seguro de que deseas eliminar este prospecto permanentemente?')) return;
    
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads(); // Recargamos la tabla para removerlo visualmente
    } catch (error) {
      console.error('❌ Error eliminando el lead:', error);
      alert('Hubo un error al eliminar el lead.');
    }
  };

 return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-200">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Panel de Leads</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestiona tus prospectos y su estado actual.</p>
        </header>

        <LeadForm onLeadAdded={fetchLeads} />

        {loading ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">Cargando datos...</div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                  {/* NUEVA COLUMNA */}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      No hay leads registrados aún.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{lead.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${lead.estado === 'nuevo' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                            lead.estado === 'contactado' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                          {lead.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(lead.fecha_creacion).toLocaleDateString()}
                      </td>
                      
                      {/* 🚀 NUEVA CELDA DE ACCIONES */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <select
                          value={lead.estado}
                          onChange={(e) => updateStatus(lead.id, e.target.value)}
                          className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
                        >
                          <option value="nuevo">Nuevo</option>
                          <option value="contactado">Contactado</option>
                          <option value="cerrado">Cerrado</option>
                        </select>

                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors font-semibold"
                        >
                          Eliminar
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;