import { AuthProvider } from "./src/context/AuthContext";
import { AxiosProvider } from "./src/context/AxiosContext";
import { MetaProvider } from "./src/context/MetaContext";
import React from "react";
import Routes from "./Routes";
import { UserProvider } from "./src/context/UserContext";

export default function App() {
  return (
    <AuthProvider>
      <AxiosProvider>
        <MetaProvider>
          <UserProvider>
            <Routes />
          </UserProvider>
        </MetaProvider>
      </AxiosProvider>
    </AuthProvider>
  );
}
