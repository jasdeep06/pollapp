import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { AxiosContext } from "../context/AxiosContext";
import { Feather } from "@expo/vector-icons";
import FriendItem from "../components/FriendItem";
import Loader from "../components/Loader";
import { useRoute } from "@react-navigation/native";

const AddFriendsDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { context } = route.params;
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [data, setData] = useState(null)
  const { authAxios } = React.useContext(AxiosContext);
  const [isLoading, setIsLoading] = useState(true)


  const sendFriendRequest = async (user_id) => {
    return authAxios.post("http://65.0.2.61:8000/send_request", {
      friend_id: user_id,
    });
  };

  const friendRequestAccept = async (user_id) => {
    return authAxios.post("http://65.0.2.61:8000/request_action", {
      friend_id: user_id,
      concern: "accept",
    });
  };

  const friendRequestDecline = async (user_id) => {
    return authAxios.post("http://65.0.2.61:8000/request_action", {
      friend_id: user_id,
      concern: "decline",
    });
  };


  const getData = async () => {
    if(context == "request"){
      setIsLoading(true)
      const response = await authAxios.get('http://65.0.2.61:8000/get_requests')
      console.log(response.data)
      if(response.data.status == 0){
        console.log(response.data.data)
        setData(response.data.data)
        setFilteredData(response.data.data)
        setIsLoading(false)
      }
  }else if(context == "add"){
    setIsLoading(true)
    const response = await authAxios.get('http://65.0.2.61:8000/get_school_friends')
    if(response.data.status == 0){
      console.log(response.data.data)
      setData(response.data.data)
      setFilteredData(response.data.data)
      setIsLoading(false)
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

  return (
    isLoading || data == null ? <Loader visible={isLoading}/> :
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
      {filteredData.map((item, index) => (
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
            />
          </View>
          <View
            style={{ borderBottomWidth: 0.5, borderBottomColor: "#DDD" }}
          ></View>
        </React.Fragment>
      ))}
    </ScrollView>
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
