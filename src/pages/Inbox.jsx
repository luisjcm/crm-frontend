import { useState, useEffect, useRef } from 'react';
import { ExternalLink, Send } from 'lucide-react';
import { io } from 'socket.io-client';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const socket = io('http://localhost:3000');

export default function Inbox() {
const [chatActivoId, setChatActivoId] = useState(null);
  const [chatActivo, setChatActivo] = useState(null);
  const [mensajeTexto, setMensajeTexto] = useState('');
  
  const [conversaciones, setConversaciones] = useState([]);
  const [historialPorChat, setHistorialPorChat] = useState({});

  // Hook para animar la lista automáticamente
  const [listaChatsRef] = useAutoAnimate();

  // Referencia para el auto-scroll
  const mensajesFinRef = useRef(null);

  // Función para hacer scroll suave hacia abajo
  const scrollToBottom = () => {
    mensajesFinRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Efecto que se dispara cada vez que cambia el historial o el chat activo
  useEffect(() => {
    scrollToBottom();
  }, [historialPorChat, chatActivoId]);

 useEffect(() => {
    // 1. Obtener la data inicial desde PostgreSQL vía API
    const cargarInbox = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/leads/inbox');
        const data = await respuesta.json();
        
        setConversaciones(data.conversaciones);
        setHistorialPorChat(data.historialPorChat);
        
        // Si hay chats, seleccionar el primero por defecto
        if (data.conversaciones.length > 0) {
          setChatActivo(data.conversaciones[0]);
          setChatActivoId(data.conversaciones[0].id);
        }
      } catch (error) {
        console.error('❌ Error cargando el inbox:', error);
      }
    };

    cargarInbox();

    // 2. Escuchar mensajes entrantes en tiempo real
    socket.on('mensaje_entrante', (msg) => {
      // A) Actualizar el panel derecho (Historial del chat)
      setHistorialPorChat((prev) => ({
        ...prev,
        [msg.chatId]: [...(prev[msg.chatId] || []), msg]
      }));

   // B) Actualizar el panel izquierdo (Lista de conversaciones y reordenamiento)
      setConversaciones((prevConversaciones) => {
        // 1. Buscamos el índice del chat que recibió el mensaje
        const index = prevConversaciones.findIndex(chat => String(chat.id) === String(msg.chatId));
        
        if (index > -1) {
          // 2. Copiamos el chat y le actualizamos los datos
          const chatActualizado = {
            ...prevConversaciones[index],
            ultimoMensaje: msg.texto,
            hora: new Date(msg.creado_en).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true 
            })
          };

          // 3. Creamos una copia de la lista entera
          const nuevaLista = [...prevConversaciones];
          
          // 4. Eliminamos el chat de su posición actual
          nuevaLista.splice(index, 1);
          
          // 5. Lo insertamos al principio de la lista (posición 0)
          nuevaLista.unshift(chatActualizado);
          
          return nuevaLista;
        }
        
        return prevConversaciones;
      });
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
        <div className="flex-1 overflow-y-auto" ref={listaChatsRef}>
          {conversaciones.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => {
                setChatActivo(chat);
                setChatActivoId(chat.id); // Sincronizamos el ID para el historial
              }}
              className={`p-4 border-b border-gray-700/50 cursor-pointer transition-colors ${chatActivoId === chat.id ? 'bg-primary-600/20' : 'hover:bg-gray-700/50'}`}
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
        
        {!chatActivo ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Cargando conversaciones...
          </div>
        ) : (
          <>
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

            {/* ÁREA DE MENSAJES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {(historialPorChat[chatActivoId] || []).map((msg) => (
                <div key={msg.id} className={`flex flex-col mt-4 ${msg.sender === 'yo' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-lg max-w-[80%] ${msg.sender === 'yo' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-100 rounded-bl-none'}`}>
                    {msg.texto}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {msg.sender === 'yo' ? 'Tú' : chatActivo.nombre}
                  </span>
                </div>
              ))}

              {/* Ancla invisible para el auto-scroll */}
              <div ref={mensajesFinRef} />

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
          </>
        )}
      </div>

    </div>
  );
}