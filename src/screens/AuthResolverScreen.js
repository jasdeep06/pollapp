import * as Application from 'expo-application';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import React, { useContext, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import Constants from "expo-constants"
import Purchases from 'react-native-purchases';
import { UserContext } from '../context/UserContext';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// import * as Updates from "expo-updates";











const AuthResolverScreen = () => {
  // const { authToken,authLoading,updateAuthToken,updateAuthLoading } = useContext(AuthContext);
  const {updateAuthState} = useContext(AuthContext)
  const [tokenUpdated, setTokenUpdated] = React.useState(false);
  const {updateUserId} = useContext(UserContext);

  console.log("Version ",Application.nativeBuildVersion)
  const navigation = useNavigation();

  
  // const checkForUpdate = async () => {
  //   const update = await Updates.checkForUpdateAsync();
  //   console.log(update)
  // }

  useEffect(() => {
    const initApp = async () => {
      // updateAuthLoading(true);
      updateAuthState({loading:true})
      try {
        await SplashScreen.preventAutoHideAsync();
        // await checkForUpdate();
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
