import React from 'react';
import { Navigate } from 'react-router-dom';

interface RutaProtegidaProps {
  children: React.ReactElement;
  rolesPermitidos?: string[]; // si no se pasa, solo exige estar logueado
}

export const RutaProtegida: React.FC<RutaProtegidaProps> = ({ children, rolesPermitidos }) => {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('user_role');

  // No hay sesión -> al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Hay sesión pero el rol no está permitido -> al catálogo
  if (rolesPermitidos && (!rol || !rolesPermitidos.includes(rol))) {
    return <Navigate to="/" replace />;
  }

  return children;
};
