// src/routes/AdminRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getProfile, logout } from '../services/authService';
import Cookies from 'js-cookie';
import { User } from '../types/user';

interface AdminRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('jwtToken');
      if (!token) {
        setIsAuthenticated(false);
        setHasPermission(false);
        return;
      }

      try {
        const userData = await getProfile();
        setUser(userData);
        setIsAuthenticated(true);

        if (allowedRoles && allowedRoles.length > 0) {
          if (userData && allowedRoles.includes(userData.role)) {
            setHasPermission(true);
          } else {
            setHasPermission(false);
          }
        } else {
          setHasPermission(true);
        }

      } catch (error) {
        setIsAuthenticated(false);
        setHasPermission(false);
        logout();
      }
    };

    checkAuth();
  }, [allowedRoles]);

  if (isAuthenticated === null || hasPermission === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 pt-20">
        <div className="text-lg font-medium text-gray-700">Memeriksa otentikasi...</div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!hasPermission)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 pt-20">
        <div className="rounded-md bg-red-100 p-4 text-red-700 text-center">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </div>
      </div>
    );

  return children ? <>{children}</> : <Outlet context={{ user }} />;
};

export default AdminRoute;