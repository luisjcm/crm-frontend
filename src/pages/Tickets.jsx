import { useState, useEffect } from 'react';
import api from '../services/api'; // Tu instancia de Axios configurada

const Tickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Error obteniendo tickets:', error);
    }
  };

  // Función para asignar colores según la prioridad
  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-500/20 text-red-400';
      case 'media': return 'bg-yellow-500/20 text-yellow-400';
      case 'baja': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Función para actualizar el estado en la base de datos
  const handleStatusChange = async (id, nuevoEstado) => {
    try {
      await api.patch(`/tickets/${id}/estado`, { estado: nuevoEstado });
      fetchTickets(); // Recargamos la tabla para ver el cambio reflejado
    } catch (error) {
      console.error('Error al actualizar el estado del ticket:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Help Desk / Soporte</h1>
      <p className="text-slate-400 mb-8">Gestiona los requerimientos e incidentes de tus prospectos.</p>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Lead</th>
              <th className="px-6 py-4">Asunto</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Prioridad</th>
              <th className="px-6 py-4">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-6 py-4 font-medium text-white">#{ticket.id}</td>
                
                <td className="px-6 py-4">
                  <div className="text-white">{ticket.lead_nombre}</div>
                  <div className="text-xs text-slate-500">{ticket.lead_email}</div>
                </td>
                
                <td className="px-6 py-4">{ticket.asunto}</td>
                
                {/* 1. COLUMNA ESTADO: Aquí va el selector */}
                <td className="px-6 py-4">
                  <select
                    value={ticket.estado}
                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                    className="bg-slate-900 border border-slate-600 text-slate-300 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none cursor-pointer"
                  >
                    <option value="abierto">Abierto</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="resuelto">Resuelto</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                </td>
                
                {/* 2. COLUMNA PRIORIDAD */}
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getPrioridadColor(ticket.prioridad)}`}>
                    {ticket.prioridad}
                  </span>
                </td>
                
                {/* 3. COLUMNA ACCIONES: Botón de ver detalles */}
                <td className="px-6 py-4">
                  <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                    Ver detalles
                  </button>
                </td>
                
              </tr>
            ))}
            
            {tickets.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                  No hay tickets registrados aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tickets;