import {
  FlatList,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { AxiosContext } from "../context/AxiosContext";
import CustomText from "../components/CustomText";
import ErrorView from "../components/ErrorView";
import { Feather } from "@expo/vector-icons";
import FriendItem from "../components/FriendItem";
import Loader from "../components/Loader";
import { MixpanelContext } from "../context/MixPanelContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

const AddFriendsDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { context } = route.params;
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [data, setData] = useState(null)
  const { authAxios } = React.useContext(AxiosContext);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const mixpanel = React.useContext(MixpanelContext)


  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle:null
    });
  }, [navigation]);


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

  const shareWhatsAppMessage = async (message) => {
    !__DEV__ && mixpanel.track("whatsapp_invite")
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


  const getData = async () => {
    if(context == "request"){
      try{
        setError(false)
      setIsLoading(true)
      const response = await authAxios.get("/get_requests")
      console.log(response.data)
      if(response.data.status == 0){
        console.log(response.data.data)
        setData(response.data.data)
        setFilteredData(response.data.data)
        setIsLoading(false)
      }else{
        console.log(response.data)
        setError(true)
      }
    }catch(error){
      setError(true)
      console.log(error)
    }
  }else if(context == "add"){
    try{
    setError(false)
    setIsLoading(true)
    const response = await authAxios.get("/get_school_friends")
    if(response.data.status == 0){
      console.log(response.data.data)
      setData(response.data.data)
      setFilteredData(response.data.data)
      setIsLoading(false)
    }else{
      console.log(response.data)
      setError(true)
    }
  }catch(error){
    setError(true)
    console.log(error)
  }
  }
}

  useEffect(() => {
    getData()
  },[])

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const newData = data.filter((item) => {
        const itemData = `${item.firstname.toUpperCase()} ${item.lastname.toUpperCase()} ${item.mobile}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(data);
    }
  };

  const getHeaderTitle = () => {
    if (context == "request") {
      return "Friend Requests";
    } else if (context == "add") {
      return "Add Friends from School";
    } else if (context == "invite") {
      return "Invite your contacts";
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#e9e9e9",
      },
      headerTitle: getHeaderTitle(),
    });
  }, [navigation]);

  if(error){
    <ErrorView onRetry={getData} />
  }

  return (
    isLoading || data == null ? <Loader visible={isLoading}/> :
    // <SafeAreaView style={{flex:1,backgroundColor:"blue"}}>
    <ScrollView style={{ flex: 1, backgroundColor: "#e9e9e9" }}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData}/>}>
      <View style={styles.searchBarContainer}>
        <Feather
          name="search"
          size={20}
          color="black"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBar}
          onChangeText={handleSearch}
          value={searchText}
          placeholder="Search..."
          placeholderTextColor="#888"
        />
      </View>
      {filteredData.length ? filteredData.map((item, index) => (
        <React.Fragment key={item.user_id}>
          <View style={{ padding: 10 }} >
            <FriendItem
              imageUrl={item.photo}
              name={item.firstname + " " + item.lastname}
              type={context}
              // number={item.in_contacts ? item.contact_name + " in contacts" : item.mobile}
              contact_name={item.in_contacts ? item.contact_name : "Not in Contacts"}
                  number={item.in_contacts ? null : item.mobile}
                  onAccept={() => friendRequestAccept(item.user_id)}
                  onDecline={() => friendRequestDecline(item.user_id)}
                  onAdd={() => sendFriendRequest(item.user_id)}
                  gender={item.gender}
                  isSent={context == "add" ? item.is_sent : null}
            />
          </View>
          <View
            style={{ borderBottomWidth: 0.5, borderBottomColor: "#DDD" }}
          ></View>
        </React.Fragment>
      )):<View style={{paddingVertical:20}}><TouchableOpacity onPress={() =>
        shareWhatsAppMessage(
          "Hey, I just found this awesome app called Razz! It's a fun way to see who likes you! https://play.google.com/store/apps/details?id=com.jas1994.pollapp"
        )}><CustomText style={{textAlign:"center",color:"blue",fontSize:18}}>{"Invite \"" + searchText + "\""}</CustomText></TouchableOpacity></View>}
    </ScrollView>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "white",
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    fontSize: 16,
    color: "#888",
    marginHorizontal: 5,
  },

  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 0,
  },

  searchIcon: {
    marginRight: 0,
    marginLeft: 8,
  },
});

export default AddFriendsDetailScreen;
