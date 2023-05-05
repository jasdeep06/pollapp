import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { AxiosContext } from "../context/AxiosContext";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import ErrorView from "../components/ErrorView";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../components/Loader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MetaContext } from "../context/MetaContext";
import { Octicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import React from "react";
import friendsImage from "../../assets/images/friends.png"
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getStatusBarHeight } from "react-native-status-bar-height";
import gradeImage from "../../assets/images/grade.png"
import likesImage from "../../assets/images/likes.png"
import schoolImage from "../../assets/images/school.png"
import unlockImage from "../../assets/images/unlock.png"
import { useFocusEffect } from "@react-navigation/native";
import { useLayoutEffect } from "react";

const ProfileScreen = ({ navigation }) => {

  const { authAxios } = React.useContext(AxiosContext);
  const [profileData, setProfileData] = React.useState(null);
  const [isLoadingProfileData, setIsLoadingProfileData] = React.useState(true);
  const {updateMetadata} = React.useContext(MetaContext)
  const [error, setError] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if(Platform.OS == "android"){
      StatusBar.setBackgroundColor("#e9e9e9");
      StatusBar.setBarStyle("dark-content");
      }
    }, [])
  );

  

  const getProfile = async () => {
    try{
    setError(false)
    setIsLoadingProfileData(true);
    const response = await authAxios.get("/get_profile");
    console.log(response.data)
    if (response.data.status == 0) {
      console.log(response.data.data);
        setProfileData(response.data.data);
        updateMetadata({unread_likes: response.data.unread_likes,
          friend_requests: response.data.friend_requests})
        setIsLoadingProfileData(false);
    }
  }catch(e){
    console.log(e)
    setError(true)
  }
  }

  useFocusEffect(
    React.useCallback(() => {
        getProfile()
    },[])
  )

  if(error){
    return <ErrorView onRetry={getProfile}/>
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar backgroundColor={"#8C92AC"} barStyle="light-content" /> */}
      {!isLoadingProfileData ?  <>
      <View>
        
        <Image
          style={styles.image}
          source={{ uri: profileData.photo }}
        />
        <CustomText
          style={{
            alignSelf: "center",
            fontSize: 25,
            marginVertical: 5,
            color: "#3b3b3b",
            fontWeight:"bold"

          }}
        >
          {profileData.firstname + " " + profileData.lastname}
        </CustomText>
        {profileData.insta_username && <CustomText style={{textAlign:"center",fontSize:15}}>{"(@" + profileData.insta_username + ")"}</CustomText>}
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {/* <FontAwesome5 name="school" size={20} color="white" /> */}
          <Image source={schoolImage} style={{height:30,width:30,alignSelf:"center"}}/>
          <CustomText style={{ marginHorizontal: 10, color: "#575757",marginVertical:10,fontSize:15 }}>
            {profileData["school"]}
          </CustomText>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {/* <Ionicons name="school-sharp" size={20} color="white" /> */}
          <Image source={gradeImage} style={{height:20,width:20,alignSelf:"center"}}/>
          <CustomText style={{ marginHorizontal: 10, color: "#575757",fontSize:15 }}>
            {profileData["grade"]}
          </CustomText>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          flex: 1,
        }}
      >
            <TouchableOpacity  style={{ flexDirection: "row" }} onPress={() => {navigation.navigate("FriendsScreen")}}>
          {/* <FontAwesome5 name="user-friends" size={30} color="white" /> */}
          <Image source={friendsImage} style={{height:40,width:40}}/>
          <CustomText
            style={{
              fontSize: 24,
              alignSelf: "center",
              color: "#575757",
              marginHorizontal: 4,
              fontWeight:"bold"
            }}
          >
            {profileData.num_friends}
          </CustomText>
          <CustomText style={{
              fontSize: 18,
              alignSelf: "center",
              color: "#575757",
            }}>friends</CustomText>
          </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          {/* <Octicons name="flame" size={30} color="white" /> */}
          <Image source={likesImage} style={{height:40,width:40}}/>
          <CustomText
            style={{
              fontSize: 24,
              alignSelf: "center",
              color: "#575757",
              marginHorizontal:4,
              fontWeight:"bold"
            }}
          >
            {profileData.num_likes}
          </CustomText>
          <CustomText style={{
              fontSize: 18,
              alignSelf: "center",
              color: "#575757",
            }}>likes</CustomText>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {/* <MaterialCommunityIcons name="account-eye" size={40} color="white" /> */}
        <Image source={unlockImage} style={{height:40,width:40}}/>
        <CustomText
          style={{
            fontSize: 24,
            alignSelf: "center",
            color: "#575757",
            marginHorizontal: 4,
            fontWeight:"bold"
          }}
        >
          { profileData.reveals}
        </CustomText>
        <CustomText style={{
              fontSize: 18,
              alignSelf: "center",
              color: "#575757",
            }}>reveals left</CustomText>
      </View>
      <CustomText
        style={{
          fontSize: 15,
          alignSelf: "center",
          color: "#8c8c8c",
          marginHorizontal: 10,
        }}
      >
        {profileData.reveals > 0 && "Expires in " + profileData.reveals_expiry} 
      </CustomText>
      <CustomButton
        buttonText={"My Account"}
        buttonStyles={{ width: "60%", alignSelf: "center", borderWidth:0, marginVertical: 20,backgroundColor:"#fa7024" }}
        onPress={() => {navigation.navigate("MyAccountScreen")}}
      />
          </>: <Loader visible={isLoadingProfileData} />}

    </SafeAreaView>
  );
};

// const renderItem = ({ item }) => {
//   return (
//     <View
//       style={{
//         backgroundColor: "#8C92AC",
//         padding: 20,
//         borderBottomWidth: 1,
//         borderBottomColor: "#ccc",
//       }}
//     >
//       <CustomText>{item}</CustomText>
//     </View>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: getStatusBarHeight(),
    backgroundColor: "#e9e9e9",
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    margin: 10,
    alignSelf: "center",
    
  },
  buttonStyle: {
    paddingVertical: 5,
    width: "60%",
  },
});

export default ProfileScreen;
