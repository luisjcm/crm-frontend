import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Metricas from './pages/Metricas';
import NotificationProvider from './components/NotificationProvider';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <NotificationProvider/>
          
          <Routes>
          {/* La ruta raíz '/' cargará el Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/metricas" element={<Metricas />} />
        </Routes>
        
      </Layout>
    </Router>
  );
}

export default App;