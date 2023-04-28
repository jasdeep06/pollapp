import { Image, Platform, RefreshControl, ScrollView, StatusBar, Text, View } from "react-native";
import React, { useEffect } from "react";

import { AxiosContext } from "../context/AxiosContext";
import CustomText from "../components/CustomText";
import ElevatedBoxWIthIcon from "../components/ElevatedBoxWithIcon";
import Empty from "../components/Empty";
import ErrorView from "../components/ErrorView";
import {Ionicons} from "@expo/vector-icons"
import Loader from "../components/Loader";
import { MetaContext } from "../context/MetaContext";
import { MixpanelContext } from "../context/MixPanelContext";
import OneSignal from 'react-native-onesignal';
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../context/UserContext";
import blackFlameImage from '../../assets/images/top_black_flame_png.png'
import blueFlameImage from '../../assets/images/blue_flame.png'
import flameLogo from "../../assets/images/flame_logo.png"
import { getStatusBarHeight } from "react-native-status-bar-height";
import orangeFlameImage from '../../assets/images/top_bright_orange_flame_png.png'
import pinkFlameImage from '../../assets/images/pink_flame.png'
import seenFlameImage from '../../assets/images/seen_flame.png'
import { useFocusEffect } from "@react-navigation/native";

const LikesScreen = ({ navigation }) => {
  const { authAxios } = React.useContext(AxiosContext);
  const [likes, setLikes] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(true);
  const {updateMetadata} = React.useContext(MetaContext)
  const {userId} = React.useContext(UserContext)
  const [error,setError] = React.useState(false)
  const mixpanel = React.useContext(MixpanelContext)

  useFocusEffect(
    React.useCallback(() => {
      if(Platform.OS == 'android'){
      console.log("firing...")
      StatusBar.setBackgroundColor("#e9e9e9");
      StatusBar.setBarStyle("dark-content");
      }
    }, [])
  );

  const getLikes = async () => {
    try{
    setError(false)
    setIsFetching(true);
    const response = await authAxios.get("/get_likes");
    console.log(response.data);
    if (response.data.status == 0) {
      console.log("Likes fetched successfully");
      console.log(response.datax);
      setLikes(response.data.data);
      updateMetadata(updateMetadata({unread_likes: response.data.unread_likes,
        friend_requests: response.data.friend_requests}))
      setIsFetching(false);
    } else {
      setError(true)
      console.log(response.data);
    }
  }catch(e){
    console.log(e)
    setError(true)
  }
  };

  useFocusEffect(
    React.useCallback(() => {
      getLikes();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      if(!__DEV__){
      mixpanel.timeEvent("likesTab")
      return () =>{
        mixpanel.track("likesTab")
      }
    }
    },[])
  )

  useFocusEffect(
    React.useCallback(() => {    
    const oneSignalInit = async () => {
    console.log("firing onesignal...")
    OneSignal.setAppId("78dca1f0-2a43-4389-94ff-48b36c79e1f5");
    OneSignal.promptForPushNotificationsWithUserResponse()
    OneSignal.setExternalUserId(userId)
    const deviceState = await OneSignal.getDeviceState();
    const hasPermission = deviceState.hasNotificationPermission
    console.log("Push disabled ",deviceState)
    if(!hasPermission){
      console.log("triggring prompt")
      OneSignal.addTrigger("showPrompt",true)
    }

    }
    oneSignalInit()
  }, [])
  );

  const handleLikePress = (like_id, gender) => {
    // console.log(like_id)
    !__DEV__ && mixpanel.track("likePress",{gender:gender})
    navigation.navigate("LikeViewScreen", { like_id: like_id, gender: gender });
  };
  if(error){
    return <ErrorView onRetry={getLikes}/>
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        // marginTop: getStatusBarHeight(),
        backgroundColor: "#e9e9e9",
      }}
    >
      <View style={{marginVertical:10,marginBottom:20,alignItems:"center"}}>
      <Image source={blackFlameImage} style={{width:80,height:80}}/>
      <CustomText style={{ fontSize: 18, color: "black",fontWeight:"bold" }}>
        Tap on likes to know more!
      </CustomText>
      </View>
      {!isFetching ? (
        likes.length > 0 ? (
          <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={getLikes}/>}>
            {likes.map((item, index) => {
              return (
                <ElevatedBoxWIthIcon
                  key={index}
                  styleLeft={{ color: item.read ? "#a3a3a3" : "#000000" }}
                  styleRight={{ color: item.read ? "#a3a3a3" : "#000000" }}
                  leftText={"From a " + item.gender}
                  style={{
                    margin: 10,
                    backgroundColor: item.read ? "#f9f9f9" : "#ffffff",
                  }}
                  rightText={item.time}
                  icon={getFlameIcon(item.read,item.gender)}
                  onPress={() => {
                    handleLikePress(item.like_id, item.gender);
                  }}
                />
              );
            })}
          </ScrollView>
        ) : (
          <Empty 
          //icon={<Ionicons name="flame-outline" size={80} color="#ccc" />} 
                      icon = {<Image source={flameLogo} style={{width:120,height:120,opacity:0.4}}/>}
                      description={"No likes yet!"}/>
                      // subDescription={"Your likes will appear here!"}/>
        )
      ) : (
        <Loader visible={isFetching} />
      )}
    </SafeAreaView>
  );
};

const getFlameIcon = (read,gender) => {
  if(read){
    return seenFlameImage
  }
  else if(gender == 'boy'){
    return blueFlameImage
  }
  else if(gender == 'girl'){
    return pinkFlameImage
  }

}

export default LikesScreen;
