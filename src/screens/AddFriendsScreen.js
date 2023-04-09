import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import {
  Dimensions,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { AxiosContext } from "../context/AxiosContext";
import CustomButton from "../components/CustomButton";
import FriendItem from "../components/FriendItem";
import { Linking } from "react-native";
import Loader from "../components/Loader";
import RNFS from "react-native-fs";
import React from "react";
import topImage from "../../assets/images/top_image.png";
import { useFocusEffect } from "@react-navigation/native";
import whatsappImage from "../../assets/images/whatsapp.png";

const AddFriendsScreen = ({ navigation }) => {
  const { authAxios } = React.useContext(AxiosContext);
  const [addFriendsData, setAddFriendsData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userData, setUserData] = React.useState(null);
  const screenWidth = Dimensions.get('window').width
  const whatsappWidth = screenWidth * 0.8
  const whatsappAspectRatio = 752/237
  const imageHeight = whatsappWidth/whatsappAspectRatio

  const getAddFriendsData = async () => {
    setIsLoading(true);
    const response = await authAxios.get(
      "/get_school_friends_and_requests"
    );
    console.log(response.data.data);
    if (response.data.status == 0) {
      setAddFriendsData(response.data.data);
      setUserData({
        firstname: response.data.data.firstname,
        lastname: response.data.data.lastname,
        num_requests:response.data.data.num_requests,
        num_from_school:response.data.data.num_from_school
      });
      setIsLoading(false);
    }
  };

  const shareWhatsAppMessage = async (message) => {
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

    try {
      const canOpenURL = await Linking.canOpenURL(url);
      if (canOpenURL) {
        await Linking.openURL(url);
      } else {
        console.error("WhatsApp is not installed on the device");
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAddFriendsData();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor("#e9e9e9");
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  const sendFriendRequest = async (user_id) => {
    return authAxios.post("/send_request", {
      friend_id: user_id,
    });
  };

  const friendRequestAccept = async (user_id) => {
    return authAxios.post("/request_action", {
      friend_id: user_id,
      concern: "accept",
    });
  };

  const friendRequestDecline = async (user_id) => {
    return authAxios.post("/request_action", {
      friend_id: user_id,
      concern: "decline",
    });
  };

  return isLoading ? (
    <Loader visible={isLoading} />
  ) : (
    <ScrollView
      style={{
        flex: 1,
        // marginTop: getStatusBarHeight(),
        backgroundColor: "#e9e9e9",
      }}
      refreshControl = {<RefreshControl refreshing={isLoading} onRefresh={getAddFriendsData}/>}
    >
      <View style={{marginVertical:10,marginBottom:20}}>
      <Image source={topImage} style={{ width: 80, height: 80,alignSelf:"center" }} />
      <Text style={{alignSelf:"center"}}>Find friends here</Text>
      </View>
      <View style={{ backgroundColor: "white" }}>
        <Text style={styles.heading}>{"Friend Requests(" + userData.num_requests + ")"}</Text>
      </View>
      <View style={{ borderWidth: 1, borderColor: "#e9e9e9" }} />
      {addFriendsData["friend_requests"].length == 0 ? (
        <Text style={{ textAlign: "center", margin: 10 }}>
          You don't have any new friend requests.
        </Text>
      ) : (
        <>
          {addFriendsData["friend_requests"].slice(0, 2).map((item, index) => (
            <React.Fragment key={item.user_id}>
              <View>
                <FriendItem
                  imageUrl={item.photo}
                  name={item.firstname + " " + item.lastname}
                  type="request"
                  contact_name={item.in_contacts ? item.contact_name : "Not in Contacts"}
                  number={item.in_contacts ? null : item.mobile}
                  onAccept={() => friendRequestAccept(item.user_id)}
                  onDecline={() => friendRequestDecline(item.user_id)}
                  itemStyle={{ padding: 10 }}
                  gender={item.gender}
                />
              </View>
            </React.Fragment>
          ))}
          <TouchableOpacity
            style={{ padding: 10, backgroundColor: "white" }}
            onPress={() => {
              navigation.navigate("AddFriendsDetailScreen", {
                context: "request",
                data: addFriendsData["friend_requests"],
              });
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 15,color:"#767676" }}>See more</Text>
          </TouchableOpacity>
        </>
      )}
      <View
        style={{ borderBottomWidth: 1.5, borderBottomColor: "#e9e9e9" }}
      ></View>
      <View style={{ backgroundColor: "white" }}>
        <Text style={styles.heading}>{"Add friends from school(" + userData.num_from_school + ")"}</Text>
        <View style={{ borderWidth: 1, borderColor: "#e9e9e9" }} />
      </View>
      {addFriendsData["from_school"].length == 0 ? (
        <Text style={{ textAlign: "center", margin: 10 }}>
          You don't have any new friend requests.
        </Text>
      ) : (
        <>
          {addFriendsData["from_school"].slice(0, 2).map((item, index) => (
            <React.Fragment key={item.user_id}>
              <View>
                <FriendItem
                  imageUrl={item.photo}
                  name={item.firstname + " " + item.lastname}
                  type="add"
                  contact_name={item.in_contacts ? item.contact_name : "Not in Contacts"}
                  number={item.in_contacts ? null : item.mobile}
                  onAdd={() => sendFriendRequest(item.user_id)}
                  itemStyle={{ padding: 10 }}
                  gender={item.gender}
                />
              </View>
            </React.Fragment>
          ))}
          <TouchableOpacity
            style={{ backgroundColor: "white", padding: 10 }}
            onPress={() => {
              navigation.navigate("AddFriendsDetailScreen", {
                context: "add",
                data: addFriendsData["from_school"],
              });
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 15,color:"#767676" }}>See more</Text>
          </TouchableOpacity>
        </>
      )}
      
      <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
        <TouchableOpacity 
          onPress={() =>
                shareWhatsAppMessage(
                  userData.firstname +
                    " " +
                    userData.lastname +
                    " invited you to join Razz app! https://play.google.com/store/apps/details?id=com.supercell.clashofclans"
                )}
          // onPress={() => {navigation.navigate("IntroScreen")}}
                
                >
        <Image source={whatsappImage} 
              style={{width:whatsappWidth,height:imageHeight}}
              
              />
              </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: { margin: 5, fontSize: 18,color:"#727272",fontWeight:"bold" },
});

export default AddFriendsScreen;
