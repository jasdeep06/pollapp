import React, { createContext, useContext } from "react";

import { AuthContext } from "./AuthContext";
import axios from "axios";

// export const apiBaseURL =
//   "https://b1ab0568-d96a-4b87-9d63-f3582716c94d.mock.pstmn.io/";

export const apiBaseURL = "https://api.razzapp.com/"
export const verifyBaseURL = "https://verify.razzapp.com/"
// export const apiBaseURL = "http://65.0.2.61:8001/"

export const AxiosContext = createContext();

export const AxiosProvider = ({ children }) => {
  const { authState } = useContext(AuthContext);

  const authAxios = axios.create({
    baseURL: apiBaseURL,
    timeout:50000
  });

  const publicAxios = axios.create({
    baseURL: apiBaseURL,
    timeout:50000
  });

  const verifyAxios = axios.create({
    baseURL:verifyBaseURL
  })

  const sendOtpAxios = axios.create({
    baseURL:apiBaseURL,
    timeout:50000
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

  sendOtpAxios.interceptors.request.use(
    (config) => {
      config.headers.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoib3RwX2NoZWNraW5nIn0.jSt0GUL38dl5gt9HP-4o25BhHyxHSRGOKDpfkaxaDBc";
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );



  

  return (
    <AxiosContext.Provider value={{ authAxios, publicAxios,verifyAxios,sendOtpAxios }}>
      {children}
    </AxiosContext.Provider>
  );
};
