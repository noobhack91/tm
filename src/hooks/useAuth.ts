import { useEffect, useState, useCallback } from 'react';  
import { useLocation, useNavigate } from 'react-router-dom';  

interface User {  
  id: string;  
  username: string;  
  email: string;  
  roles: Array<'admin' | 'logistics' | 'challan' | 'installation' | 'invoice' | 'super_admin'>;  
}  

export const useAuth = () => {  
  const [isAuthenticated, setIsAuthenticated] = useState(false);  
  const [loading, setLoading] = useState(true);  
  const [user, setUser] = useState<User | null>(null);  
  const navigate = useNavigate();  
  const location = useLocation();  

  // Check authentication status on component mount  
  useEffect(() => {  
    checkAuth();  
  }, []);  

  // Redirect authenticated users away from the login page  
  useEffect(() => {  
    if (isAuthenticated && !loading && location.pathname === '/login') {  
      navigate('/tenders', { replace: true });  
    }  
  }, [isAuthenticated, loading, location.pathname, navigate]);  

  /**  
   * Check authentication status by verifying token and user data in localStorage.  
   */  
  const checkAuth = useCallback(() => {  
    const token = localStorage.getItem('token');  
    const userData = localStorage.getItem('user');  

    if (token && userData) {  
      try {  
        const parsedUser: User = JSON.parse(userData);  
        setIsAuthenticated(true);  
        setUser(parsedUser);  
      } catch (error) {  
        console.error('Error parsing user data:', error);  
        handleLogout(); // Clear invalid data  
      }  
    } else {  
      setIsAuthenticated(false);  
      setUser(null);  
    }  
    setLoading(false);  
  }, []);  

  /**  
   * Log in the user by storing token and user data in localStorage.  
   * @param token - JWT token  
   * @param userData - User object  
   */  
  const login = useCallback((token: string, userData: User) => {  
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
  }, [navigate]);  

  /**  
   * Log out the user by clearing localStorage and resetting state.  
   */  
  const logout = useCallback(() => {  
    handleLogout();  
    navigate('/login', { replace: true });  
  }, [navigate]);  

  /**  
   * Clear authentication data from localStorage and reset state.  
   */  
  const handleLogout = useCallback(() => {  
    localStorage.removeItem('token');  
    localStorage.removeItem('user');  
    setIsAuthenticated(false);  
    setUser(null);  
    setLoading(false);  
  }, []);  

  return {  
    isAuthenticated,  
    loading,  
    user,  
    login,  
    logout,  
  };  
};  