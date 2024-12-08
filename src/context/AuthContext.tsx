// src/context/AuthContext.tsx  
import React, { createContext, useContext, useState, useEffect } from 'react';  

interface AuthContextType {  
  isAuthenticated: boolean;  
  user: any;  
  login: (token: string, userData: any) => void;  
  logout: () => void;  
}  

const AuthContext = createContext<AuthContextType | undefined>(undefined);  

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {  
  const [isAuthenticated, setIsAuthenticated] = useState(false);  
  const [user, setUser] = useState<any>(null);  

  useEffect(() => {  
    const token = localStorage.getItem('token');  
    const userData = localStorage.getItem('user');  

    if (token && userData) {  
      setIsAuthenticated(true);  
      setUser(JSON.parse(userData)); // Ensure roles are included in the user object  
    }  
  }, []);  

  const login = (token: string, userData: any) => {  
    localStorage.setItem('token', token);  
    localStorage.setItem('user', JSON.stringify(userData));  
    setIsAuthenticated(true);  
    setUser(userData); // Ensure roles are included here  
  };  

  const logout = () => {  
    localStorage.removeItem('token');  
    localStorage.removeItem('user');  
    setIsAuthenticated(false);  
    setUser(null);  
  };  

  return (  
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>  
      {children}  
    </AuthContext.Provider>  
  );  
};  

export const useAuth = () => {  
  const context = useContext(AuthContext);  
  if (context === undefined) {  
    throw new Error('useAuth must be used within an AuthProvider');  
  }  
  return context;  
};  