import React, { createContext, useContext } from "react";

import { AuthContext } from "./AuthContext";
import axios from "axios";

// export const apiBaseURL =
//   "https://b1ab0568-d96a-4b87-9d63-f3582716c94d.mock.pstmn.io/";

export const apiBaseURL = "https://api.razzapp.com/"
export const verifyBaseURL = "https://verify.razzapp.com/"

export const AxiosContext = createContext();

export const AxiosProvider = ({ children }) => {
  const { authState } = useContext(AuthContext);

  const authAxios = axios.create({
    baseURL: apiBaseURL,
  });

  const publicAxios = axios.create({
    baseURL: apiBaseURL,
  });

  const verifyAxios = axios.create({
    baseURL:verifyBaseURL
  })

  authAxios.interceptors.request.use(
    (config) => {
      config.headers.token = authState.token;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  verifyAxios.interceptors.request.use(
    (config) => {
      config.headers.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiaW1hZ2VfdmVyaWZpY2F0aW9uIn0.eI639_Qx5ql0_5xeCpNqTsaSmj5vxy_6-gq202tjSWU";
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  

  return (
    <AxiosContext.Provider value={{ authAxios, publicAxios,verifyAxios }}>
      {children}
    </AxiosContext.Provider>
  );
};
