import * as SplashScreen from "expo-splash-screen";

import { Image, StyleSheet, Text, View } from 'react-native';

import AddFriendsDetailScreen from './src/screens/AddFriendsDetailScreen';
import AddFriendsScreen from './src/screens/AddFriendsScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./src/context/AuthContext";
import { AuthProvider } from './src/context/AuthContext';
import AuthResolverScreen from "./src/screens/AuthResolverScreen";
import { AxiosProvider } from './src/context/AxiosContext';
import BannerScreen from './src/screens/BannerScreen';
import FirstNameScreen from './src/screens/FirstNameScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import GenderScreen from './src/screens/GenderScreen';
import GradeSelectionScreen from './src/screens/GradeSelectionScreen';
import IntroScreen from "./src/screens/IntroScreen";
import LastNameScreen from './src/screens/LastNameScreen';
import LikeViewScreen from './src/screens/LikeViewScreen';
import LikesScreen from './src/screens/LikesScreen';
import { MetaProvider } from "./src/context/MetaContext";
import MobileNumberInputScreen from './src/screens/MobileNumberInputScreen';
import MyAccountScreen from './src/screens/MyAccountScreen';
import { NavigationContainer } from "@react-navigation/native";
import OTPVerificationScreen from './src/screens/OtpVerificationScreen';
import OneSignal from 'react-native-onesignal';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import PermissionsScreen from './src/screens/PermissionScreen';
import PhotoScreen from './src/screens/PhotoScreen';
import PollScreen from './src/screens/PollScreen';
import PricingScreen from './src/screens/PricingScreen';
import ProfileScreen from './src/screens/ProfieScreen';
import React from "react";
import Routes from "./Routes";
import SchoolSelectionScreen from './src/screens/SchoolSelectionScreen';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './src/context/UserContext';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";

// OneSignal.setAppId("78dca1f0-2a43-4389-94ff-48b36c79e1f5");
// OneSignal.promptForPushNotificationsWithUserResponse()

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();







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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
