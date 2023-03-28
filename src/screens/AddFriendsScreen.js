import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AxiosContext } from "../context/AxiosContext";
import FriendItem from "../components/FriendItem";
import Loader from "../components/Loader";
import React from "react";
import { addFriendsDummyData } from "../data/dummyAddFriendsData";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useFocusEffect } from "@react-navigation/native";

const AddFriendsScreen = ({ navigation }) => {
  const { authAxios } = React.useContext(AxiosContext);
  const [addFriendsData, setAddFriendsData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const getAddFriendsData = async () => {
    setIsLoading(true);
    const response = await authAxios.get("/get_school_friends_and_requests");
    if (response.data.status == 0) {
      setAddFriendsData(response.data.data);
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
        getAddFriendsData()
    },[])
  )

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
    <ScrollView
      style={{
        flex: 1,
        marginTop: getStatusBarHeight(),
        backgroundColor: "#8C92AC",
      }}
    >
      <Text style={styles.heading}>Friend Requests</Text>
      {addFriendsData["friend_requests"].slice(0, 2).map((item, index) => (
        <>
          <View style={{ padding: 10 }} key={index}>
            <FriendItem
              key={item.user_id}
              imageUrl={item.image_url}
              name={item.firstname + " " +  item.lastname}
              type="request"
              number={item.number}
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
      <View
        style={{ borderBottomWidth: 0.5, borderBottomColor: "black" }}
      ></View> 
      <Text style={styles.heading}>Add friends from school</Text>
      {addFriendsData["from_school"].slice(0, 2).map((item, index) => (
        <>
          <View style={{ padding: 10 }} key={index}>
            <FriendItem
              key={item.user_id}
              imageUrl={item.image_url}
              name={item.firstname + " " +  item.lastname}
              type="add"
              number={item.number}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: { textAlign: "center", margin: 10, fontSize: 18 },
});

export default AddFriendsScreen;
