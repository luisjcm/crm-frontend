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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Leads</h1>
          <p className="text-gray-500 mt-1">Gestiona tus prospectos y su estado actual.</p>
        </header>

        {/* Aquí inyectamos nuestro nuevo componente */}
<LeadForm onLeadAdded={fetchLeads} />
        {loading ? (
          <div className="text-center py-10 text-gray-500">Cargando datos...</div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                      No hay leads registrados aún.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${lead.estado === 'nuevo' ? 'bg-blue-100 text-blue-800' : 
                            lead.estado === 'contactado' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {lead.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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