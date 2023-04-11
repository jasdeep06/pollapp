// import React, { createContext, useState } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authToken, setAuthToken] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [isSignUp, setIsSignUp] = useState(false);


//   const updateAuthToken = (token) => {
//     setAuthToken(token);
//   };

//   const updateAuthLoading = (status) => {
//     setAuthLoading(status);
//   }

//   const updateIsSignUp = (status) => {
//     setIsSignUp(status);
//   }

  
//   return (
//     <AuthContext.Provider
//       value={{
//         authToken,
//         authLoading,
//         isSignUp,
//         updateAuthToken,
//         updateAuthLoading,
//         updateIsSignUp,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    loading: true,
    isSignUp: false,
  });

  const updateAuthState = (updatedFields) => {
    setAuthState((prevState) => ({ ...prevState, ...updatedFields }));
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        updateAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
