import * as WebBrowser from 'expo-web-browser';

import { AuthProvider } from "./src/context/AuthContext";
import { AxiosProvider } from "./src/context/AxiosContext";
import { MetaProvider } from "./src/context/MetaContext";
import { MixpanelProvider } from "./src/context/MixPanelContext";
import React from "react";
import Routes from "./Routes";
import { UserProvider } from "./src/context/UserContext";

export default function App() {
  return (
    <AuthProvider>
      <AxiosProvider>
        <MixpanelProvider>
        <MetaProvider>
          <UserProvider>
            <Routes />
          </UserProvider>
        </MetaProvider>
        </MixpanelProvider>
      </AxiosProvider>
    </AuthProvider>
  );
}
