import { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import api from '../services/api'; // 
import { toast } from 'react-hot-toast';

const Metricas = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Traemos los datos reales de la base de datos
  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        const response = await api.get('/leads');
        setLeads(response.data);
      } catch (error) {
        console.error('Error obteniendo métricas:', error);
        if (error.code === 'ERR_NETWORK') {
          toast.error('Sin conexión al servidor para cargar las gráficas.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMetricas();
  }, []);

  // 2. Procesamos los datos para el Gráfico de Donut (Distribución por Estado)
  const procesarDatosDonut = () => {
    // Inicializamos contadores
    const conteo = { Nuevo: 0, Contactado: 0, Cerrado: 0 };
    
    // Recorremos los leads reales y sumamos
    leads.forEach((lead) => {
      if (conteo[lead.estado] !== undefined) {
        conteo[lead.estado] += 1;
      }
    });

    // Recharts necesita que los datos sean un arreglo de objetos con 'name' y 'value'
    return [
      { name: 'Nuevos', value: conteo.Nuevo },
      { name: 'Contactados', value: conteo.Contactado },
      { name: 'Cerrados', value: conteo.Cerrado },
    ];
  };

  const donutData = procesarDatosDonut();
  // Colores de Tailwind: Azul (Nuevo), Ámbar (Contactado), Verde (Cerrado)
  const DONUT_COLORS = ['#3b82f6', '#f59e0b', '#10b981']; 

  // 3. Datos demo para el Gráfico de Barras (Evolución)
  // Como aún no tenemos fechas de registro complejas, simulamos un crecimiento 
  // usando el total de tu base de datos actual para la última semana.
  const barData = [
    { name: 'Semana 1', prospectos: 2 },
    { name: 'Semana 2', prospectos: 4 },
    { name: 'Semana 3', prospectos: 5 },
    { name: 'Semana 4', prospectos: leads.length }, 
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-100">Métricas del Negocio</h1>
        <p className="text-gray-400 mt-2">Visión general del rendimiento de tus prospectos.</p>
      </header>

      {/* Grid de 1 columna en móvil, 2 en escritorio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TARJETA 1: Gráfico de Donut */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-200 mb-6 text-center">Distribución de Prospectos</h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center text-gray-500">Cargando datos...</div>
          ) : (
            <div className="h-64">
              {/* ResponsiveContainer hace que la gráfica se adapte al tamaño de la tarjeta */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%" // Centro horizontal
                    cy="50%" // Centro vertical
                    innerRadius={70} // Esto lo convierte en Donut (hueco en el medio)
                    outerRadius={90}
                    paddingAngle={5} // Espacio entre las rebanadas
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                    itemStyle={{ color: '#f3f4f6' }}
                  />
                  <Legend wrapperStyle={{ color: '#9ca3af' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* TARJETA 2: Gráfico de Barras */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-200 mb-6 text-center">Captación Mensual (Demo)</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                {/* Cuadrícula de fondo */}
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip 
                  cursor={{ fill: '#374151', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                />
                <Bar dataKey="prospectos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Metricas;