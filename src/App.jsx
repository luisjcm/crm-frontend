import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import NotificationProvider from './components/NotificationProvider';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <NotificationProvider/>
          
          <Routes>
          {/* La ruta raíz '/' cargará el Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Dejamos preparada la ruta para las métricas */}
          {/* <Route path="/metricas" element={<Metricas />} /> */}
        </Routes>
        
      </Layout>
    </BrowserRouter>
  );
}

export default App;