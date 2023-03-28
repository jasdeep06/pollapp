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
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useFocusEffect } from "@react-navigation/native";

const ProfileScreen = ({ navigation }) => {

  const { authAxios } = React.useContext(AxiosContext);
  const [profileData, setProfileData] = React.useState(null);
  const [isLoadingProfileData, setIsLoadingProfileData] = React.useState(true);

  const getProfile = async () => {
    setIsLoadingProfileData(true);
    const response = await authAxios.get("/get_profile");
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
      <StatusBar backgroundColor={"#8C92AC"} barStyle="light-content" />
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
            color: "white",
          }}
        >
          {profileData.firstname + " " + profileData.lastname}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <FontAwesome5 name="school" size={20} color="white" />
          <Text style={{ marginHorizontal: 10, color: "white" }}>
            {profileData["school"]}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Ionicons name="school-sharp" size={20} color="white" />
          <Text style={{ marginHorizontal: 10, color: "white" }}>
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
          <FontAwesome5 name="user-friends" size={30} color="white" />
          <Text
            style={{
              fontSize: 15,
              alignSelf: "center",
              color: "white",
              marginHorizontal: 10,
            }}
          >
            {profileData.num_friends +  " friends"}
          </Text>
          </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <Octicons name="flame" size={30} color="white" />
          <Text
            style={{
              fontSize: 15,
              alignSelf: "center",
              color: "white",
              marginHorizontal: 10,
            }}
          >
            {profileData.num_likes +  " likes"}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <MaterialCommunityIcons name="account-eye" size={40} color="white" />
        <Text
          style={{
            fontSize: 20,
            alignSelf: "center",
            color: "white",
            marginHorizontal: 10,
          }}
        >
          { profileData.reveals_left +" reveals left"}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 15,
          alignSelf: "center",
          color: "white",
          marginHorizontal: 10,
        }}
      >
        {"Expires in " + profileData.reveals_expire_in} 
      </Text>
      <CustomButton
        buttonText={"Edit Profile"}
        buttonStyles={{ width: "60%", alignSelf: "center", marginVertical: 20 }}
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
    marginTop: getStatusBarHeight(),
    backgroundColor: "#8C92AC",
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
