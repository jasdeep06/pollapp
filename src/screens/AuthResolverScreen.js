import * as SplashScreen from 'expo-splash-screen';

import React, { useContext, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AuthResolverScreen = () => {
  const { authToken, updateAuthToken } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const initApp = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        console.log("checking for auth token")
        const token = await AsyncStorage.getItem('authToken');
        console.log("token is",token)
        if (token) {
          updateAuthToken(token);
          navigation.replace("Tabs");
        } else {
          console.log('No Auth Token Found');
          navigation.replace('BannerScreen');
        }
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    initApp();
  }, []);

  return <View />;
};

export default AuthResolverScreen;
