import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  const updateAuthToken = (token) => {
    setAuthToken(token);
  };

  
  return (
    <AuthContext.Provider
      value={{
        authToken,
        updateAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
