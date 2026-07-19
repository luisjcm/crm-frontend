import { NavLink } from 'react-router-dom';

const Sidebar = () => {

    // Creamos una función auxiliar para no repetir las clases largas de Tailwind
  // Si isActive es true, le damos el fondo azul. Si es false, le damos el gris con hover.
  const getNavClasses = ({ isActive }) => {
    const baseClasses = "flex items-center gap-3 px-4 py-2 md:py-3 rounded-lg font-medium whitespace-nowrap transition-colors";
    const activeClasses = "bg-primary-600/10 text-primary-400";
    const inactiveClasses = "text-gray-400 hover:bg-gray-800 hover:text-gray-100";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

    return (
        // En móvil es una barra superior, en md: vuelve a ser un panel lateral (w-64)
        <aside className="w-full md:w-64 bg-gray-900 border-b md:border-b-0 md:border-r border-gray-800 text-gray-100  flex flex-col md:min-h-screen shrink-0 transition-colors duration-200">

            <div className="p-4 md:p-6 flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-primary-500 tracking-wider">CRM CORE</h2>
            </div>


            {/* Navegación: overflow-x-auto permite hacer scroll horizontal si hay muchos botones en móvil */}
            <nav className="flex-1 px-4 pb-4 md:pb-0 md:mt-6 overflow-x-auto">
                {/* flex-row en móvil, flex-col en escritorio */}
                <ul className="flex flex-row md:flex-col gap-2">
                    
                    <li>
                        {/* 2. Reemplazamos <Link> por <NavLink> y le pasamos nuestra función al className */}
                                <NavLink to="/" className={getNavClasses}>
                                <span>👥</span>
                                Prospectos
                                </NavLink>
                            </li>
                            <li>
                                {/* 3. Hacemos lo mismo aquí */}
                                <NavLink to="/metricas" className={getNavClasses}>
                                <span>📊</span>
                                Métricas
                                </NavLink>
                    </li>
                     <li>
                                {/* 3. Hacemos lo mismo aquí */}
                                <NavLink to="/inbox" className={getNavClasses}>
                                <span>💬</span>
                                Bandeja de Entrada
                                </NavLink>
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