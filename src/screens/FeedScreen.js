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
import genericImage from '../../assets/images/flame_1.png'
import { getStatusBarHeight } from "react-native-status-bar-height";
import pinkFlameImage from '../../assets/images/pink_flame.png'
import razzLogo from '../../assets/images/bw_logo.png'
import seenFlameImage from '../../assets/images/seen_flame.png'
import topFeedImage from '../../assets/images/top_feed.png'
import { useFocusEffect } from "@react-navigation/native";

const FeedScreen = ({ navigation }) => {
  const { authAxios } = React.useContext(AxiosContext);
  const [feed, setFeed] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(true);
//   const {updateMetadata} = React.useContext(MetaContext)
//   const {userId} = React.useContext(UserContext)
  const [error,setError] = React.useState(false)
  const [newElements,setNewElements] = React.useState(0)
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

  useFocusEffect(
    React.useCallback(() => {
     if(!__DEV__){
      mixpanel.timeEvent("feedTab")
      return () =>{
        mixpanel.track("feedTab")
      }
    }
    },[])
  )


  const getFeed = async () => {
    try{
    setError(false)
    setIsFetching(true);
    const response = await authAxios.get("/get_school_board");
    console.log(response.data);
    if (response.data.status == 0) {
      console.log("Likes fetched successfully");
      setFeed(response.data.school_board);
      setNewElements(response.data.new_board_elems)
    // setNewElements(2)
    //   updateMetadata(updateMetadata({unread_likes: response.data.unread_likes,
    //     friend_requests: response.data.friend_requests}))
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
      getFeed();
    }, [])
  );

//   useFocusEffect(
//     React.useCallback(() => {    
//     const oneSignalInit = async () => {
//     console.log("firing onesignal...")
//     OneSignal.setAppId("78dca1f0-2a43-4389-94ff-48b36c79e1f5");
//     OneSignal.promptForPushNotificationsWithUserResponse()
//     OneSignal.setExternalUserId(userId)
//     const deviceState = await OneSignal.getDeviceState();
//     const hasPermission = deviceState.hasNotificationPermission
//     console.log("Push disabled ",deviceState)
//     if(!hasPermission){
//       console.log("triggring prompt")
//       OneSignal.addTrigger("showPrompt",true)
//     }

//     }
//     oneSignalInit()
//   }, [])
//   );

//   const handleLikePress = (like_id, gender) => {
//     // console.log(like_id)
//     navigation.navigate("LikeViewScreen", { like_id: like_id, gender: gender });
//   };


  if(error){
    return <ErrorView onRetry={getFeed}/>
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
      <Image source={topFeedImage} style={{width:80,height:80}}/>
      <CustomText style={{ fontSize: 18, color: "#6c6c6c" }}>
        School Feed
      </CustomText>
      </View>
      {!isFetching ? (
        feed.length > 0 ? (
          <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={getFeed}/>}>
            {feed.map((item, index) => {
              return (
                <ElevatedBoxWIthIcon
                  key={index}
                  styleLeft={{alignSelf:"flex-start"}}
                  styleRight={{color:"#b6b6b6"}}
                  leftText={item.mock ? 
                    <><CustomText style={{fontWeight:"bold"}}>{item.firstname + " (" + item.lastname + ")"}</CustomText><CustomText>{" received"}</CustomText> </>: <><CustomText style={{fontWeight:"bold"}}>{item.firstname + " " + item.lastname}</CustomText><CustomText>{" received"}</CustomText> </>}
                  style={[{
                    margin: 10,
                    backgroundColor:  "#ffffff",
                  }]}
                  rightText={item.time}
                  icon={item.mock ? genericImage : item.photo}
                  leftSubText={item.question.replace("?","")}
                disabled = {true}
                showDot={index < newElements}
                />
              );
            })}
          </ScrollView>
        ) : (
          <Empty 
                      icon = {<Image source={razzLogo} style={{width:140,height:140}}/>}
                      description={"Seems a bit quiet here!"}
                      subDescription={"Your school activity will appear here."}/>
        )
      ) : (
        <Loader visible={isFetching} />
      )}
    </SafeAreaView>
  );
};


export default FeedScreen;
