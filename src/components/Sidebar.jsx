import { Link } from 'react-router-dom';

const Sidebar = () => {

    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-800 text-gray-100 min-h-screen flex flex-col shrink-0 transition-colors duration-300">

            <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-500 tracking-wider">CRM CORE</h2>
            </div>

            <nav className="flex-1 px-4 mt-6">
                <ul className="space-y-2">
                    
                    <li>
                        {/* Cambiamos <a> por <Link> y 'href' por 'to' */}
                        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600/10 text-blue-400 font-medium transition-colors">
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
            
             <div className="p-4 border-t border-gray-800 text-sm text-gray-500 text-center ">
                        v.1.0.0
            </div>
        </aside>
    );

};

export default Sidebar;