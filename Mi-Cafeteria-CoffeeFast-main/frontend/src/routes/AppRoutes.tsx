import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CatalogoPage from '../features/catalogo/CatalogoPage'; // Sin llaves porque es export default
import { AdminPage } from '../features/admin/AdminPage'; // Con llaves porque es un export nombrado

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Vista pública del cliente (Catálogo del menú) */}
        <Route path="/" element={<CatalogoPage />} />

        {/* Tu nuevo panel de administración para gestionar productos y categorías */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Ruta de redirección por si se escribe cualquier otra URL inválida */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};