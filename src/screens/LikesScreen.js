import { Image, RefreshControl, ScrollView, StatusBar, Text, View } from "react-native";
import React, { useEffect } from "react";

import { AxiosContext } from "../context/AxiosContext";
import ElevatedBoxWIthIcon from "../components/ElevatedBoxWithIcon";
import Empty from "../components/Empty";
import {Ionicons} from "@expo/vector-icons"
import Loader from "../components/Loader";
import blackFlameImage from '../../assets/images/top_black_flame_png.png'
import blueFlameImage from '../../assets/images/blue_flame.png'
import { getStatusBarHeight } from "react-native-status-bar-height";
import pinkFlameImage from '../../assets/images/pink_flame.png'
import seenFlameImage from '../../assets/images/seen_flame.png'
import { useFocusEffect } from "@react-navigation/native";

const LikesScreen = ({ navigation }) => {
  const { authAxios } = React.useContext(AxiosContext);
  const [likes, setLikes] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor("#e9e9e9");
      StatusBar.setBarStyle("dark-content");
    }, [])
  );

  const getLikes = async () => {
    setIsFetching(true);
    const response = await authAxios.get("http://65.0.2.61:8000/get_likes");
    console.log(response.data);
    if (response.data.status == 0) {
      console.log("Likes fetched successfully");
      console.log(response.datax);
      setLikes(response.data.data);
      setIsFetching(false);
    } else {
      console.log(response.data);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getLikes();
    }, [])
  );

  const handleLikePress = (like_id, gender) => {
    // console.log(like_id)
    navigation.navigate("LikeViewScreen", { like_id: like_id, gender: gender });
  };
  return (
    <View
      style={{
        flex: 1,
        // marginTop: getStatusBarHeight(),
        backgroundColor: "#e9e9e9",
      }}
    >
      <View style={{marginVertical:10,marginBottom:20,alignItems:"center"}}>
      <Image source={blackFlameImage} style={{width:80,height:80}}/>
      <Text style={{ fontSize: 18, color: "#6c6c6c" }}>
        See who liked you!
      </Text>
      </View>
      {!isFetching ? (
        likes.length > 0 ? (
          <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={getLikes}/>}>
            {likes.map((item, index) => {
              return (
                <ElevatedBoxWIthIcon
                  key={index}
                  styleLeft={{ color: item.read ? "#a3a3a3" : "#000000" }}
                  styleRight={{ color: item.read ? "#a3a3a3" : "#000000" }}
                  leftText={"From a " + item.gender}
                  style={{
                    margin: 10,
                    backgroundColor: item.read ? "#f9f9f9" : "#ffffff",
                  }}
                  rightText={item.time}
                  icon={getFlameIcon(item.read,item.gender)}
                  onPress={() => {
                    handleLikePress(item.like_id, item.gender);
                  }}
                />
              );
            })}
          </ScrollView>
        ) : (
          <Empty icon={<Ionicons name="flame-outline" size={80} color="#ccc" />} 
                      description={"No likes yet!"}
                      subDescription={"Your likes will appear here!"}/>
        )
      ) : (
        <Loader visible={isFetching} />
      )}
    </View>
  );
};

const getFlameIcon = (read,gender) => {
  if(read){
    return seenFlameImage
  }
  else if(gender == 'boy'){
    return blueFlameImage
  }
  else if(gender == 'girl'){
    return pinkFlameImage
  }

}

export default LikesScreen;
