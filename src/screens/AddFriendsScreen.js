import * as Sharing from 'expo-sharing';

import {
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
import Loader from "../components/Loader";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";

const AddFriendsScreen = ({ navigation }) => {
  const { authAxios } = React.useContext(AxiosContext);
  const [addFriendsData, setAddFriendsData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const getAddFriendsData = async () => {
    setIsLoading(true);
    const response = await authAxios.get("http://65.0.2.61:8000/get_school_friends_and_requests");
    console.log(response.data.data)
    if (response.data.status == 0) {
      setAddFriendsData(response.data.data);
      setIsLoading(false);
    }
  };

  const shareMessage = async () => {
    const message = 'Hello, this is a test message!';
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
  
    try {
      // Check if sharing is available on the device
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        alert('Sharing is not available on this device');
        return;
      }
  
      // Open share dialog with the pre-filled message
      await Sharing.shareAsync(shareUrl);
    } catch (error) {
      console.error('Error while sharing message:', error);
    }
  };
  


  useFocusEffect(
    React.useCallback(() => {
        getAddFriendsData()
    },[])
  )

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor("#8C92AC");
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  const sendFriendRequest = async (user_id) => {
    return authAxios.post('/send_friend_request',{user_id:user_id})
}

  const friendRequestAccept = async (user_id) => {
    return authAxios.post('/friend_request_action',{user_id:user_id,concern:"accept"})
  }

  const friendRequestDecline = async (user_id) => {
    return authAxios.post('/friend_request_action',{user_id:user_id,concern:"decline"})
  }

  return (
    isLoading ? <Loader visible={isLoading} /> :
    <View
      style={{
        flex: 1,
        // marginTop: getStatusBarHeight(),
        backgroundColor: "#8C92AC",
      }}
    >
      <Text style={styles.heading}>Friend Requests</Text>
      {addFriendsData["friend_requests"].length == 0 ? <Text style={{textAlign:"center",margin:10}}>You don't have any new friend requests.</Text> :
      <>
      {addFriendsData["friend_requests"].slice(0, 2).map((item, index) => (
        <>
          <View style={{ padding: 10 }} key={item.user_id}>
            <FriendItem
            //   key={item.user_id}
              imageUrl={item.photo}
              name={item.firstname + " " +  item.lastname}
              type="request"
              number={item.mobile}
              onAccept={() => friendRequestAccept(item.user_id)}
                onDecline={() => friendRequestDecline(item.user_id)}
            />
          </View>
          <View
            style={{ borderBottomWidth: 0.5, borderBottomColor: "#DDD" }}
          ></View>
        </>
      ))}
      <TouchableOpacity
        style={{ margin: 10 }}
        onPress={() => {
          navigation.navigate("AddFriendsDetailScreen", {
            context: "request",
            data: addFriendsData["friend_requests"],
          });
        }}
      >
        <Text style={{ textAlign: "center", fontSize: 15 }}>See more</Text>
      </TouchableOpacity>
      </>}
      <View
        style={{ borderBottomWidth: 0.5, borderBottomColor: "black" }}
      ></View> 
      <Text style={styles.heading}>Add friends from school</Text>
      {addFriendsData["from_school"].length == 0 ? <Text style={{textAlign:"center",margin:10}}>You don't have any new friend requests.</Text> :
      <>
      {addFriendsData["from_school"].slice(0, 2).map((item, index) => (
        <>
          <View style={{ padding: 10 }} key={item.user_id}>
            <FriendItem
            //   key={item.user_id}
              imageUrl={item.photo}
              name={item.firstname + " " +  item.lastname}
              type="add"
              number={item.mobile}
              onAdd={() => sendFriendRequest(item.user_id)}

            />
          </View>
          <View
            style={{ borderBottomWidth: 0.5, borderBottomColor: "#DDD" }}
          ></View>
        </>
      ))}
      <TouchableOpacity
        style={{ margin: 10 }}
        onPress={() => {
          navigation.navigate("AddFriendsDetailScreen", {
            context: "add",
            data: addFriendsData["from_school"],
          });
        }}
      >
        <Text style={{ textAlign: "center", fontSize: 15 }}>See more</Text>
      </TouchableOpacity>
      </>}
      <View
        style={{ borderBottomWidth: 0.5, borderBottomColor: "black" }}
      ></View>
      {/* <Text style={styles.heading}>Invite your contacts</Text>
      {addFriendsDummyData["invite"].slice(0, 2).map((item, index) => (
        <>
          <View style={{ padding: 10 }} key={index}>
            <FriendItem
              key={index}
              imageUrl={item.image_url}
              name={item.name}
              type="invite"
              number={item.number}
            />
          </View>
          <View
            style={{ borderBottomWidth: 0.5, borderBottomColor: "#DDD" }}
          ></View>
        </>
      ))}
      <TouchableOpacity
        style={{ margin: 10 }}
        onPress={() => {
          navigation.navigate("AddFriendsDetailScreen", {
            context: "invite",
            data: addFriendsDummyData["invite"],
          });
        }}
      >
        <Text style={{ textAlign: "center", fontSize: 15 }}>See more</Text>
      </TouchableOpacity>
      <View
        style={{ borderBottomWidth: 0.5, borderBottomColor: "black" }}
      ></View> */}
      <View style={{alignItems:"center",flex:1,justifyContent:"center"}}>
      <CustomButton buttonText={"Invite on WhatsApp"} onPress={shareMessage}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: { textAlign: "center", margin: 10, fontSize: 18 },
});

export default AddFriendsScreen;
