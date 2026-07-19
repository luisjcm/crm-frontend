import { Link } from 'react-router-dom';

const Sidebar = () => {

    return (
        // En móvil es una barra superior, en md: vuelve a ser un panel lateral (w-64)
        <aside className="w-full md:w-64 bg-gray-900 border-b md:border-b-0 md:border-r border-gray-800 text-gray-100  flex flex-col md:min-h-screen shrink-0 transition-colors duration-200">

            <div className="p-4 md:p-6 flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-blue-500 tracking-wider">CRM CORE</h2>
            </div>


            {/* Navegación: overflow-x-auto permite hacer scroll horizontal si hay muchos botones en móvil */}
            <nav className="flex-1 px-4 pb-4 md:pb-0 md:mt-6 overflow-x-auto">
                {/* flex-row en móvil, flex-col en escritorio */}
                <ul className="flex flex-row md:flex-col gap-2">
                    
                    <li>
                        {/* Cambiamos <a> por <Link> y 'href' por 'to' */}
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600/10 text-blue-400 font-medium whitespace-nowrap transition-colors">
                        <span>👥</span>
                        Prospectos
                        </Link>
                    </li>
                    <li>
                        <Link to="/metricas" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors">
                        <span>📊</span>
                        Métricas
                        </Link>
                    </li>
                </ul>
            </nav>
            
             <div className="hidden md:block p-4 border-t border-gray-800 text-sm text-gray-500 text-center ">
                        v.1.0.0
            </div>
        </aside>
    );

};

export default Sidebar;