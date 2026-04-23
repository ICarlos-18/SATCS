import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}