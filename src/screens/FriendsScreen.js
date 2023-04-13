import { FlatList, ScrollView, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";

import { AxiosContext } from "../context/AxiosContext";
import CustomButton from "../components/CustomButton";
import Empty from "../components/Empty";
import ErrorView from "../components/ErrorView";
import { FontAwesome5 } from "@expo/vector-icons";
import FriendItem from "../components/FriendItem";
import Loader from "../components/Loader";

const FriendsScreen = ({ navigation }) => {
  const { authAxios } = React.useContext(AxiosContext);
  const [friendsData, setFriendsData] = React.useState(null);
  const [isLoadingFriendsData, setIsLoadingFriendsData] = React.useState(true);
  const [error, setError] = React.useState(false);

  const getFriends = async () => {
    try{
    setError(false);
    const response = await authAxios.get("/get_friends");
    console.log(response.data);
    if (response.data.status == 0) {
      console.log(response.data.data);
      setFriendsData(response.data.data);
      setIsLoadingFriendsData(false);
    }else{
      setError(true)
      console.log(response.data)
    }
  }catch(err){
    console.log(err)
    setError(true)
  }
  };

  React.useEffect(() => {
    getFriends();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#e9e9e9",
      },
      headerTitle: "Friends",
    });
  }, [navigation]);


  if(error){
    <ErrorView onRetry={getFriends} />
  }

  return isLoadingFriendsData ? (
    <Loader visible={isLoadingFriendsData} />
  ) : friendsData.length > 0 ? (
    <ScrollView style={{ backgroundColor: "#e9e9e9", flex: 1 }}>
      {friendsData.map((item, index) => (
        <React.Fragment key={index}>
          <View style={{ padding: 10 }}>
            <FriendItem
              imageUrl={item.photo}
              name={item.firstname + " " + item.lastname}
              type="friend"
              // number={item.mobile}
              contact_name={item.in_contacts ? item.contact_name : "Not in Contacts"}
              number={item.in_contacts ? null : item.mobile}
              gender={item.gender}
            />
          </View>
          <View
            style={{ borderBottomWidth: 0.5, borderBottomColor: "#DDD" }}
          ></View>
        </React.Fragment>
      ))}
    </ScrollView>
  ) : (
    <View style={{ backgroundColor: "#e9e9e9", flex: 1 }}>
      <Empty
        icon={<FontAwesome5 name="user-friends" size={80} color="#b0b0b0" />}
        description={"You don't have any friends now!"}
        subDescription={"Add friends to Razz them!"}
      />
      <CustomButton
        title="Add Friends"
        onPress={() => navigation.navigate("Tabs", { screen: "Add" })}
        buttonText={"Find Friends"}
        buttonStyles={{ width: "80%", alignSelf: "center", marginVertical: 30,backgroundColor:"#fa7024",borderWidth:0 }}
      />
    </View>
  );
};

export default FriendsScreen;
