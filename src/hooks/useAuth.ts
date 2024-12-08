import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
  email: string;
  roles: 'admin' | 'logistics' | 'challan' | 'installation' | 'invoice' | 'super_admin';
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  // Redirect from login page if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading && location.pathname === '/login') {
      navigate('/tenders', { replace: true });
    }
  }, [isAuthenticated, loading, location, navigate]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        // Handle invalid user data in localStorage
        handleLogout();
      }
    }
    setLoading(false);
  };

  const login = (token: string, userData: User) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      navigate('/tenders', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
  };

  const logout = () => {
    handleLogout();
    navigate('/login', { replace: true });
  };

  return {
    isAuthenticated,
    loading,
    user,
    login,
    logout
  };
};