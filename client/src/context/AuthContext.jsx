import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set default axios base URL
  axios.defaults.baseURL = 'http://localhost:5000/api';

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Check for token in URL (Google OAuth Redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      
      let token = urlToken || localStorage.getItem('token');
      
      if (urlToken) {
        localStorage.setItem('token', urlToken);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      if (token) {
        // Attach token to every request
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        fetchUserProfile();
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Since there is no detailed profile endpoint, we use the token payload in standard apps. 
      // But we can decode it, or call a protected route.
      // The current backend has /profile, but let's assume it returns { user: ... }
      const res = await axios.get('/profile');
      setUser(res.data.user);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('/login', { email, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    
    // We decode token or fetch profile
    const tokenPayload = JSON.parse(atob(res.data.token.split('.')[1]));
    setUser({ id: tokenPayload.id, role: tokenPayload.role }); 
    // Idealy we would fetch full profile here if needed
  };

  const register = async (name, email, password, role) => {
    await axios.post('/register', { name, email, password, role });
    // Auto login after register
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
