// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: JSX.Element;
  roles?: string[]; // ['admin', 'user'], optional
}

const PrivateRoute: React.FC<Props> = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Checking authentication...</p>;
  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/forbidden" />;
  }

  return children;
};

export default PrivateRoute;
