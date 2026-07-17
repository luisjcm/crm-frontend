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
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
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