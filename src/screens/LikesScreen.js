import React, { useEffect } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";

import { AxiosContext } from "../context/AxiosContext";
import ElevatedBoxWIthIcon from "../components/ElevatedBoxWithIcon";
import Loader from "../components/Loader";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useFocusEffect } from "@react-navigation/native";

const LikesScreen = ({ navigation }) => {
  
  const {authAxios} = React.useContext(AxiosContext);
  const [likes, setLikes] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor("#8C92AC");
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  const getLikes = async () => {
    setIsFetching(true);
    const response  = await authAxios.get("/get_likes")
    if(response.data.status == 0){
      console.log("Likes fetched successfully")
        console.log(response.datax)
        setLikes(response.data.data)
        setIsFetching(false)
    }
    
  } 

  

  useFocusEffect(
    React.useCallback(() => {
        getLikes()
    },[])
  )

  const handleLikePress = (like_id,gender) => {
    // console.log(like_id)
    navigation.navigate("LikeViewScreen", { like_id: like_id,gender:gender });
  }
  return (
    <View
      style={{
        flex: 1,
        marginTop: getStatusBarHeight(),
        backgroundColor: "#8C92AC",
      }}
    >
      <Text style={{ textAlign: "center", fontSize: 20, color: "white" }}>
        Have a look at your likes!
      </Text>
      {!isFetching ? <ScrollView>
        {likes.map((item, index) => {
          return (
            <ElevatedBoxWIthIcon
              key={index}
              styleLeft={{ color: item.read ? "#6D6D6D" : "black" }}
              styleRight={{ color: item.read ? "#6D6D6D" : "black" }}
              leftText={"From a " + item.gender}
              style={{
                margin: 10,
                backgroundColor: item.read ? "#D3D3D3" : "white",
              }}
              rightText={item.time}
              icon={require("../../assets/images/fire.png")}
              onPress={() => {handleLikePress(item.like_id,item.gender)}}
            />
          );
        })}
      </ScrollView>: <Loader visible={isFetching}/>}
    </View>
  );
};

export default LikesScreen;
