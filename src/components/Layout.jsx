import Sidebar from './Sidebar';

const Layout = ({ children }) => {

    return (

        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Sidebar />
                <main className="flex-1 flex flex-col overflow-hidden">

                    <div className="flex-1 overflow-y-auto">
                         {children}
                    </div>

                </main>
        </div>
    );
};

export default Layout;