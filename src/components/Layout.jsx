import Sidebar from './Sidebar';

const Layout = ({ children }) => {

    return (

        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Sidebar />
                <main className="flex-1 flex flex-col overflow-hidden w-full">

                    <div className="flex-1 overflow-y-auto p-4 md:p-0">
                         {children}
                    </div>

                </main>
        </div>
    );
};

export default Layout;