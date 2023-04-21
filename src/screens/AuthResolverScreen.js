import * as Application from "expo-application";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";

import React, { useContext, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import Constants from "expo-constants";
import CustomText from "../components/CustomText";
import CustomUpdate from "../components/CustomUpdate";
import LogRocket from "@logrocket/react-native";
import Purchases from "react-native-purchases";
import { UserContext } from "../context/UserContext";
import { View } from "react-native";
import { apiBaseURL } from "../context/AxiosContext";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

if(!__DEV__){
LogRocket.init('9apufh/razz')
}

const AuthResolverScreen = () => {
  // const { authToken,authLoading,updateAuthToken,updateAuthLoading } = useContext(AuthContext);
  const { updateAuthState } = useContext(AuthContext);
  const [tokenUpdated, setTokenUpdated] = React.useState(false);
  const { updateUserId } = useContext(UserContext);
  const [updating, setUpdating] = React.useState(false);
  const [forceUpdate, setForceUpdate] = React.useState(false);

  console.log("Version ", Application.nativeBuildVersion);
  const navigation = useNavigation();

  const checkForUpdate = async () => {
    // const update = await Updates.checkForUpdateAsync();
    // console.log(update)
    // console.log(__DEV__)
    // setUpdating(true);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     console.log("timeout over")
    //     // setUpdating(false)
    //     // Updates.reloadAsync()
    //     resolve();
    //   }, 5000);
    // })

    const availableObject = await Updates.checkForUpdateAsync();
    console.log( "object ",availableObject)
    if (availableObject.isAvailable) {
      setUpdating(true);
      console.log("fetching available update....")
      const update = await Updates.fetchUpdateAsync();
      if (update.isNew) {
        await Updates.reloadAsync();
      } else {
        setUpdating(false);
      }
    }
  };

  const checkForForceUpdate = async (authToken, version) => {
    try {
      const response = await axios.get(apiBaseURL +  "force_update",{
           "headers":{
            token: authToken,
           },
           "params":{
              version: String(version)
           }
      });

      if(response.data.status == 0 ){
      setForceUpdate(response.data.update);
      return response.data.update
      }else{
        console.log(response.data)
        return false
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const updateView = async () => {
      await SplashScreen.hideAsync();
    };

    if (updating || forceUpdate) {
      updateView();
    }
  }, [updating,forceUpdate]);

  

  useEffect(() => {
    const initApp = async () => {
      // updateAuthLoading(true);
      updateAuthState({ loading: true });
      try {
        await SplashScreen.preventAutoHideAsync();
        console.log("checking for auth token");
        const token = await AsyncStorage.getItem("authToken");
        console.log("token is", token);
        const userId = await AsyncStorage.getItem("userId");
        console.log("userId is", userId);

        console.log("getting font...");
        await Font.loadAsync({
          Calibri: require("../../assets/fonts/calibri_regular.ttf"),
        });
        console.log("Got font...");

        console.log("__DEV__", __DEV__);

        if (!__DEV__) {
          console.log("checking for updates.....")
          await checkForUpdate();
        }

        const forceUpdate = await checkForForceUpdate(token, Application.nativeBuildVersion);

        if(!forceUpdate){
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

        }
        
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

  return updating || forceUpdate ? <CustomUpdate force={forceUpdate} /> : <View />;
};

export default AuthResolverScreen;
