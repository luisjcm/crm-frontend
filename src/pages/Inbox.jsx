import { useState, useEffect } from 'react';
import { ExternalLink, Send } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Inbox() {
  const [chatActivoId, setChatActivoId] = useState(1);
  const [mensajeTexto, setMensajeTexto] = useState('');
  
  // Diccionario de memoria temporal simulando la Base de Datos
  const [historialPorChat, setHistorialPorChat] = useState({
    1: [], // Mensajes de Juan
    2: []  // Mensajes de María
  });

  useEffect(() => {
    socket.on('mensaje_entrante', (msg) => {
      // Guardamos el mensaje en la "bolsa" del chat correspondiente
      setHistorialPorChat((prev) => ({
        ...prev,
        [msg.chatId]: [...(prev[msg.chatId] || []), msg]
      }));
    });

    return () => {
      socket.off('mensaje_entrante');
    };
  }, []);

  const enviarMensaje = () => {
    if (!mensajeTexto.trim()) return;
    
    const nuevoMensaje = {
      id: Date.now(),
      texto: mensajeTexto,
      sender: 'yo',
      chatId: chatActivoId // Etiquetamos el mensaje con el ID del chat actual
    };

    socket.emit('nuevo_mensaje', nuevoMensaje);
    setMensajeTexto('');
  };

  // Datos simulados para visualizar el diseño
  const [conversaciones] = useState([
    { id: 1, nombre: 'Juan Pérez', origen: 'WhatsApp', ultimoMensaje: '¿Tienen disponibilidad?', hora: '10:30 AM', noLeidos: 2 },
    { id: 2, nombre: 'María Gómez', origen: 'Messenger', ultimoMensaje: 'Gracias por la info.', hora: 'Ayer', noLeidos: 0 },
  ]);

  const [chatActivo, setChatActivo] = useState(conversaciones[0]);

  return (
    // Altura calculada para ocupar toda la pantalla menos un posible header
    <div className="flex h-[calc(100vh-2rem)] md:h-screen bg-gray-900 md:border-l border-gray-800 overflow-hidden shadow-xl">
      
      {/* PANEL IZQUIERDO: Lista de Conversaciones */}
      <div className="w-full md:w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header del panel izquierdo */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-gray-100">Bandeja de Entrada</h2>
          <div className="mt-2 relative">
            <input 
              type="text" 
              placeholder="Buscar chat..." 
              className="w-full bg-gray-900 text-gray-200 text-sm rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Lista de chats */}
        <div className="flex-1 overflow-y-auto">
          {conversaciones.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => {
                setChatActivo(chat);
                setChatActivoId(chat.id); // Sincronizamos el ID para el historial
              }}
              className={`p-4 border-b border-gray-700/50 cursor-pointer transition-colors ${chatActivo.id === chat.id ? 'bg-primary-600/20' : 'hover:bg-gray-700/50'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-gray-200">{chat.nombre}</h4>
                <span className="text-xs text-gray-500">{chat.hora}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400 truncate pr-2">{chat.ultimoMensaje}</p>
                {chat.noLeidos > 0 && (
                  <span className="bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {chat.noLeidos}
                  </span>
                )}
              </div>
              <span className="text-xs text-primary-400 mt-1 block">{chat.origen}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PANEL DERECHO: Área de Chat */}
      <div className="hidden md:flex flex-1 flex-col h-screen bg-gray-900">
        
        {/* Header del Chat */}
        <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-100">{chatActivo.nombre}</h3>
            <span className="text-sm text-green-400">En línea ({chatActivo.origen})</span>
          </div>
          <button className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded transition-colors">
            <ExternalLink className="w-4 h-4" /> Ver Lead
          </button>
        </div>

        {/* ÁREA DE MENSAJES (Contenedor con flex-1) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {(historialPorChat[chatActivoId] || []).map((msg) => (
            <div key={msg.id} className="flex flex-col items-end">
              <div className="bg-primary-600 text-white p-3 rounded-lg rounded-br-none max-w-[80%]">
                {msg.texto}
              </div>
              <span className="text-xs text-gray-400 mt-1">Ahora</span>
            </div>
          ))}
        </div>

        {/* Input de Envío */}
        <div className="p-4 border-t border-gray-700 bg-gray-800 shrink-0">
          <div className="flex gap-2 relative">
            <input 
              type="text" 
              value={mensajeTexto}
              onChange={(e) => setMensajeTexto(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
              placeholder="Escribe un mensaje..." 
              className="flex-1 bg-gray-900 text-gray-200 rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-primary-500"
            />
            <button 
              onClick={enviarMensaje}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Send className="w-4 h-4" /> Enviar
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}