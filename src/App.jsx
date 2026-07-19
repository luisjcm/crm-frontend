import Dashboard from './pages/Dashboard';
import NotificationProvider from './components/NotificationProvider';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <NotificationProvider />
      <Dashboard />
    </Layout>
  );
}

export default App;