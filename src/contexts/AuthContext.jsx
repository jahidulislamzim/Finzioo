import React, { createContext, useContext } from 'react';
import useFirebaseAuth from '../hooks/useAuth';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const allContext = useFirebaseAuth();

  return (
    <AuthContext.Provider value={allContext}>
      {children}
    </AuthContext.Provider>
  );
};
