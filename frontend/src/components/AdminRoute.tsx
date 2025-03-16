import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

interface AdminRouteProps {
  children: React.ReactNode;
}

interface AdminResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  discipline?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkAdmin = async () => {
      if (!token) {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await axios.get<AdminResponse>('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAdmin(response.data.role === 'admin');
      } catch (error) {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [token]);

  if (isAdmin === null) {
    return <div>Carregando...</div>;
  }

  return isAdmin ? <>{children}</> : <Navigate to="/login" replace />;
};

export default AdminRoute; 