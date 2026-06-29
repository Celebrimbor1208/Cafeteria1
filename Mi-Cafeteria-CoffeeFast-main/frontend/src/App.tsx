import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './features/auth/AuthPage';
import { AdminPage } from './features/admin/AdminPage';
import CatalogoPage from './features/catalogo/CatalogoPage';
import { RutaProtegida } from './routes/RutaProtegida';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogoPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/admin"
        element={
          <RutaProtegida rolesPermitidos={['ADMIN']}>
            <AdminPage />
          </RutaProtegida>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;