import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import LeadForm from '../components/LeadForm';
import ConfirmModal from '../components/ConfirmModal'; 
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Esta es una funcion que obtiene los leads desde la API y actualiza el estado con un Callback para que no se vuelva a crear en cada renderizado
  const fetchLeads = useCallback(async () => {
    try {
      const response = await api.get('/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('❌ Error obteniendo los leads:', error);

      if (error.code === 'ERR_NETWORK') {
        toast.error('No se pudo conectar con el servidor para cargar los datos.');
      } else {
        toast.error('Hubo un error al cargar los datos.');
      }

    } finally {
      setLoading(false);
    }
  }, []); //Lista de dependencias vacía para que no se vuelva a crear en cada renderizado

  useEffect(() => {

    // Llamamos a la función fetchLeads dentro de un initFetch para evitar advertencias de dependencias en useEffect
    const initFetch = async () => {
      await fetchLeads();
    };
    initFetch();
  }, [fetchLeads]);

  const updateStatus = async (id, nuevoEstado) => {
    try {
      await api.patch(`/leads/${id}/status`, { estado: nuevoEstado });
      fetchLeads(); 
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      console.error('❌ Error actualizando el estado:', error);
      toast.error('Hubo un error al procesar la solicitud.');
    }
  };

  // 🚀 3. Modificamos deleteLead para que solo abra el modal
  const openDeleteModal = (lead) => {
    setLeadToDelete(lead);
    setIsModalOpen(true);
  };

  // 🚀 4. Creamos la función que realmente hace el borrado cuando el usuario confirma
  const confirmDelete = async () => {
    if (!leadToDelete) return;
    
    try {
      await api.delete(`/leads/${leadToDelete.id}`);
      fetchLeads();
      setIsModalOpen(false); // Cerramos el modal
      setLeadToDelete(null); // Limpiamos el estado
      toast.success('El prospecto ha sido eliminado');
    } catch (error) {
      console.error('❌ Error eliminando el lead:', error);
      toast.error('Hubo un error al procesar la solicitud.');
    }
  };

  // 🚀 LÓGICA DE FILTRADO (Esto sucede antes del map)
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || lead.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-200">
      <div className="mx-auto max-w-6xl">
        {/* ... (tu header y tu LeadForm quedan exactamente igual) ... */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Panel de Leads</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestiona tus prospectos y su estado actual.</p>
        
        {/* 🚀 BARRA DE BÚSQUEDA Y FILTROS */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              <option value="todos">Todos los estados</option>
              <option value="nuevo">Nuevo</option>
              <option value="contactado">Contactado</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>
        </header>

        <LeadForm onLeadAdded={fetchLeads} />

        {loading ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">Cargando datos...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-700 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors">
            <table className="w-full text-left border-collapse min-w-[600px]">
              {/* ... (thead queda igual) ... */}
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
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

                    
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        {/* ... Aqui se usa un .map para retornar un arreglo de elementos , la key le indica a react quien es quien para no re-renderizar toda la tabla si se elimina un elemento ... */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{lead.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${lead.estado === 'nuevo' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300' : 
                            lead.estado === 'contactado' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                          {lead.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(lead.fecha_creacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <select
                          value={lead.estado}
                          onChange={(e) => updateStatus(lead.id, e.target.value)}
                          className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary-500 transition-colors cursor-pointer"
                        >
                          <option value="nuevo">Nuevo</option>
                          <option value="contactado">Contactado</option>
                          <option value="cerrado">Cerrado</option>
                        </select>

                        {/* 🚀 5. Cambiamos el onClick para que abra nuestro modal pasándole el lead */}
                        <button
                          onClick={() => openDeleteModal(lead)}
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

      {/* 🚀 6. Renderizamos el Modal al final de nuestro componente */}
      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Prospecto"
        message={`¿Estás completamente seguro de que deseas eliminar a ${leadToDelete?.nombre}? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};

export default Dashboard;