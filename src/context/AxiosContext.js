import React, { createContext, useContext } from "react";

import { AuthContext } from "./AuthContext";
import axios from "axios";

// export const apiBaseURL =
//   "https://b1ab0568-d96a-4b87-9d63-f3582716c94d.mock.pstmn.io/";

export const apiBaseURL = "https://api.razzapp.com/"

export const AxiosContext = createContext();

export const AxiosProvider = ({ children }) => {
  const { authToken } = useContext(AuthContext);

  const authAxios = axios.create({
    baseURL: apiBaseURL,
  });

  const publicAxios = axios.create({
    baseURL: apiBaseURL,
  });

  authAxios.interceptors.request.use(
    (config) => {
      config.headers.token = authToken;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    <AxiosContext.Provider value={{ authAxios, publicAxios }}>
      {children}
    </AxiosContext.Provider>
  );
};
