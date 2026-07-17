import Dashboard from './pages/Dashboard';
import NotificationProvider from './components/NotificationProvider';

function App() {
  return (
    <main>
      <NotificationProvider />
      <Dashboard />
    </main>
  );
}

export default App;