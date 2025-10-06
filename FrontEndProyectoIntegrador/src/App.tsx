import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginAdminForm } from './components/LoginForm/LoginAdminForm';
import { Dashboard } from './pages/Dashboard';
import { GeneracionView } from './pages/GeneracionView';
import { EstudianteDetail } from './pages/EstudianteDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAdminForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generacion/:año" element={<GeneracionView />} />
        <Route path="/estudiante/:id" element={<EstudianteDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
