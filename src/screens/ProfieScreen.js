import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AxiosContext } from "../context/AxiosContext";
import CustomButton from "../components/CustomButton";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../components/Loader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import React from "react";
import friendsImage from "../../assets/images/friends.png"
import { getStatusBarHeight } from "react-native-status-bar-height";
import gradeImage from "../../assets/images/grade.png"
import likesImage from "../../assets/images/likes.png"
import schoolImage from "../../assets/images/school.png"
import unlockImage from "../../assets/images/unlock.png"
import { useFocusEffect } from "@react-navigation/native";

const ProfileScreen = ({ navigation }) => {

  const { authAxios } = React.useContext(AxiosContext);
  const [profileData, setProfileData] = React.useState(null);
  const [isLoadingProfileData, setIsLoadingProfileData] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor("#e9e9e9");
      StatusBar.setBarStyle("dark-content");
    }, [])
  );


  const getProfile = async () => {
    setIsLoadingProfileData(true);
    const response = await authAxios.get("http://65.0.2.61:8000/get_profile");
    console.log(response.data)
    if (response.data.status == 0) {
      console.log(response.data.data);
        setProfileData(response.data.data);
        setIsLoadingProfileData(false);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
        getProfile()
    },[])
  )

  return (
    <View style={styles.container}>
      {/* <StatusBar backgroundColor={"#8C92AC"} barStyle="light-content" /> */}
      {!isLoadingProfileData ?  <>
      <View>
        
        <Image
          style={styles.image}
          source={{ uri: profileData.photo }}
        />
        <Text
          style={{
            alignSelf: "center",
            fontSize: 25,
            marginVertical: 10,
            color: "#3b3b3b",
            fontWeight:"bold"

          }}
        >
          {profileData.firstname + " " + profileData.lastname}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {/* <FontAwesome5 name="school" size={20} color="white" /> */}
          <Image source={schoolImage} style={{height:30,width:30,alignSelf:"center"}}/>
          <Text style={{ marginHorizontal: 10, color: "#575757",marginVertical:10,fontSize:15 }}>
            {profileData["school"]}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {/* <Ionicons name="school-sharp" size={20} color="white" /> */}
          <Image source={gradeImage} style={{height:20,width:20,alignSelf:"center"}}/>
          <Text style={{ marginHorizontal: 10, color: "#575757",fontSize:15 }}>
            {profileData["grade"]}
          </Text>
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
          <Text
            style={{
              fontSize: 24,
              alignSelf: "center",
              color: "#575757",
              marginHorizontal: 4,
              fontWeight:"bold"
            }}
          >
            {profileData.num_friends}
          </Text>
          <Text style={{
              fontSize: 18,
              alignSelf: "center",
              color: "#575757",
            }}>friends</Text>
          </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          {/* <Octicons name="flame" size={30} color="white" /> */}
          <Image source={likesImage} style={{height:40,width:40}}/>
          <Text
            style={{
              fontSize: 24,
              alignSelf: "center",
              color: "#575757",
              marginHorizontal:4,
              fontWeight:"bold"
            }}
          >
            {profileData.num_likes}
          </Text>
          <Text style={{
              fontSize: 18,
              alignSelf: "center",
              color: "#575757",
            }}>likes</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {/* <MaterialCommunityIcons name="account-eye" size={40} color="white" /> */}
        <Image source={unlockImage} style={{height:40,width:40}}/>
        <Text
          style={{
            fontSize: 24,
            alignSelf: "center",
            color: "#575757",
            marginHorizontal: 4,
            fontWeight:"bold"
          }}
        >
          { profileData.reveals}
        </Text>
        <Text style={{
              fontSize: 18,
              alignSelf: "center",
              color: "#575757",
            }}>reveals left</Text>
      </View>
      <Text
        style={{
          fontSize: 15,
          alignSelf: "center",
          color: "#8c8c8c",
          marginHorizontal: 10,
        }}
      >
        {profileData.reveals > 0 && "Expires in " + profileData.reveals_expiry} 
      </Text>
      <CustomButton
        buttonText={"My Account"}
        buttonStyles={{ width: "60%", alignSelf: "center", borderWidth:0, marginVertical: 20,backgroundColor:"#fa7024" }}
        onPress={() => {navigation.navigate("MyAccountScreen")}}
      />
          </>: <Loader visible={isLoadingProfileData} />}

    </View>
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
//       <Text>{item}</Text>
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
