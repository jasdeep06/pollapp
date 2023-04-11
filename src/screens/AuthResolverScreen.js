import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import React, { useContext, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import Purchases from 'react-native-purchases';
import { UserContext } from '../context/UserContext';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AuthResolverScreen = () => {
  // const { authToken,authLoading,updateAuthToken,updateAuthLoading } = useContext(AuthContext);
  const {updateAuthState} = useContext(AuthContext)
  const [tokenUpdated, setTokenUpdated] = React.useState(false);
  const {updateUserId} = useContext(UserContext);

  const navigation = useNavigation();

  // useEffect(() => {
  //   const hideSplash = async () => {
  //     await SplashScreen.hideAsync();
  //   }
  //   if(tokenUpdated){
  //     console.log("token updated hiding splash")
  //     hideSplash();
  //   }

  // },[tokenUpdated])

  useEffect(() => {
    const initApp = async () => {
      // updateAuthLoading(true);
      updateAuthState({loading:true})
      try {
        await SplashScreen.preventAutoHideAsync();
        console.log("checking for auth token")
        const token = await AsyncStorage.getItem('authToken');
        console.log("token is",token)
        const userId = await AsyncStorage.getItem('userId');
        console.log("userId is",userId)

        console.log("getting font...")
        await Font.loadAsync({
          'Calibri': require('../../assets/fonts/calibri_regular.ttf'),
        })
        console.log("Got font...")
        if (token && userId) {
          // updateAuthToken(token);
          updateAuthState({token:token})
          updateUserId(userId);
          setTokenUpdated(true);
          // navigation.replace("Tabs");
        } else {
          console.log('No Auth Token Found');
          setTokenUpdated(true);
          // navigation.replace('BannerScreen');
        }
        // updateAuthLoading(false);
        updateAuthState({loading:false})
      } catch (e) {
        console.warn(e);
      } finally {
        // if(tokenUpdated){
        await SplashScreen.hideAsync();
        // }
      }
    };

    initApp();
  }, []);

  return <View />;
};

export default AuthResolverScreen;
