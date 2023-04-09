import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useEffect, useLayoutEffect } from "react";

import ActionModal from "../components/ActionModal";
import { AxiosContext } from "../context/AxiosContext";
import CustomButton from "../components/CustomButton";
import ElevatedBox from "../components/ElevatedBox";
import Loader from "../components/Loader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import boyImage from "../../assets/images/boy.png"
import girlImage from "../../assets/images/girl.png"
import lockImage from "../../assets/images/lock.png"

// import { likeViewDummyData } from "../data/dummyLikeViewData";

const LikeViewScreen = ({ route, navigation }) => {
  const { authAxios } = React.useContext(AxiosContext);
  const like_id = route.params.like_id;
  const gender = route.params.gender;

  const [likeViewData, setLikeViewData] = React.useState(null);
  const [isLoadingLikeViewData, setIsLoadingLikeViewData] =
    React.useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [revealInfo, setRevealInfo] = useState(null);
  const [isRevealLoading, setIsRevealLoading] = useState(false);

  const handleToggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleRevealPress = async () => {
    if (!likeViewData.revealed) {
      const response = await revealLike();
      if (response.data.status === 0) {
        handleToggleModal();
      } else if (response.data.status === 3 || response.data.status === 4) {
        navigation.navigate("PricingScreen", {
          like_id: like_id,
          gender: gender,
          from: "reveal",
          user_id: response.data.user_id,
        });
      }
    } else {
      handleToggleModal();
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        // backgroundColor:gender == "boy"?"#4A90E2":"#F06292"
        backgroundColor: "black",
      },
      headerTintColor: "white",
    });
  }, [navigation]);

  const revealLike = async () => {
    setIsRevealLoading(true);
    const response = await authAxios.get("/reveal_like", {
      params: { like_id: like_id },
    });
    console.log(response.data);
    if (response.data.status == 0) {
      console.log(response.data.data);
      setRevealInfo(response.data.data);
      setIsRevealLoading(false);
    }
    return response;
  };

  const getLikeViewData = async () => {
    setIsLoadingLikeViewData(true);
    const response = await authAxios.get(
      "/get_like_details",
      { params: { like_id: like_id } }
    );
    if (response.data.status == 0) {
      setLikeViewData(response.data.data);
      console.log(response.data.data);
      setIsLoadingLikeViewData(false);
    }
  };

  useEffect(() => {
    getLikeViewData();
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar backgroundColor={"black"} barStyle="light-content" />

      {!isLoadingLikeViewData ? (
        <View style={styles.content}>
          <View
            style={{
              backgroundColor: gender ==  "boy" ? "#3f85fa": "#fd4996",
              flex: 4,
              justifyContent: "space-around",
              borderRadius:15
            }}
          >
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
              <Image
                source={
                  gender == "boy"
                    ? boyImage
                    : girlImage
                }
                style={styles.image}
              />
              <Text
                style={{ alignSelf: "center", color: "white", fontSize: 15 }}
              >
                From a {gender}
              </Text>
            </View>
            {/* <View> */}
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.questionText}>{likeViewData["ques"]}</Text>
                {getOptionView(likeViewData,gender)}
                <Text style={{color:"white",textAlign:"center",fontWeight:"bold"}}>razzapp.com</Text>
              </View>
            {/* </View> */}
          </View>
          <View
            style={{
              backgroundColor: "black",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <CustomButton
              buttonText={getButtonText(likeViewData, revealInfo)}
              buttonStyles={{
                backgroundColor: "black",
                width: "80%",
                alignSelf: "center",
                backgroundColor:"#444444",
                borderWidth:0
              }}
              onPress={handleRevealPress}
              icon={getButtonIcon(likeViewData, revealInfo)}
            />
          </View>
        </View>
      ) : (
        <Loader visible={isLoadingLikeViewData} />
      )}
      {likeViewData && (
        <ActionModal
          isVisible={modalVisible}
          toggleModal={handleToggleModal}
          modalStyle={{
            backgroundColor: gender == "boy" ? "#4A90E2" : "#F06292",
          }}
        >
          {getModalView(likeViewData, revealInfo, isRevealLoading)}
        </ActionModal>
      )}
    </View>
  );
};

const getModalView = (likeViewData, revealInfo, isRevealLoading) => {
  if (likeViewData.revealed) {
    return (
      <>
        <Image
          source={{ uri: likeViewData.photo }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginHorizontal: 10,
            alignSelf: "center",
          }}
        />
        <Text
          style={{ textAlign: "center", fontSize: 20, color: "white" }}
        >{`${likeViewData.firstname} ${likeViewData.lastname}`}</Text>
      </>
    );
  } else if (isRevealLoading) {
    return <Loader visible={isRevealLoading} />;
  } else if (revealInfo != null) {
    return (
      <>
        <Image
          source={{ uri: revealInfo.photo }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginHorizontal: 10,
            alignSelf: "center",
          }}
        />
        <Text
          style={{ textAlign: "center", fontSize: 20, color: "white" }}
        >{`${revealInfo.firstname} ${revealInfo.lastname}`}</Text>
        <Text style={{ textAlign: "center", fontSize: 15, color: "white" }}>
          You have {revealInfo.reveals} reveals remaining!
        </Text>
      </>
    );
  } else {
    return <Loader visible={isRevealLoading} />;
  }
};

const getButtonText = (likeViewData, revelInfo) => {
  if (likeViewData && likeViewData.revealed == false && revelInfo != null) {
    return `${revelInfo.firstname} ${revelInfo.lastname}`;
  } else if (likeViewData && likeViewData.revealed == true) {
    return `${likeViewData.firstname} ${likeViewData.lastname}`;
  } else {
    return "See who sent it";
  }
};

const getButtonIcon = (likeViewData, revelInfo) => {
  if (likeViewData && likeViewData.revealed == false && revelInfo != null) {
    return (
      <Image
        source={{ uri: revelInfo.photo }}
        style={{
          width: 30,
          height: 30,
          borderRadius: 50,
          marginHorizontal: 10,
        }}
      />
    );
  } else if (likeViewData && likeViewData.revealed == true) {
    return (
      <Image
        source={{ uri: likeViewData.photo }}
        style={{
          width: 30,
          height: 30,
          borderRadius: 50,
          marginHorizontal: 10,
        }}
      />
    );
  } else {
    return (
      // <MaterialIcons
      //   name="lock"
      //   size={24}
      //   color="white"
      //   style={{ marginHorizontal: 5 }}
      // />
      <Image source={lockImage} style={{height:24,width:24,marginRight:5}}/>
    );
  }
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    margin: 20,
  },
  questionText: {
    color: "white",
    alignSelf: "center",
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    fontWeight:"bold"
  },
  content: {
    flex: 1,
    backgroundColor:"black",
    padding:5
    // justifyContent: "space-around",
  },
});

const getOptionView = (likeViewData,gender) => {
  const selected_id = likeViewData["selected_id"];
  const selectedOption = likeViewData["option_list"].findIndex(
    (obj) => obj.user_id == selected_id
  );
  console.log(selectedOption);
  return (
    <>
      <View style={{ flexDirection: "row" }}>
        {likeViewData["option_list"].slice(0, 2).map((item, index) => {
          return (
            <ElevatedBox
              style={{
                padding: 20,
                flex: 1,
                backgroundColor: selectedOption == index ? "#ffffff" : gender == 'girl' ? "#ffb1d2": '#a3c5ff',
              }}
              text={item.firstname + " " + item.lastname}
              textStyle={{color: gender == 'girl' ? "#fd4996" : '#3f85fa',fontWeight:"bold"}}
              disabled={true}
              key={index}
            />
          );
        })}
      </View>
      <View style={{ flexDirection: "row" }}>
        {likeViewData["option_list"].slice(2, 4).map((item, index) => {
          return (
            <ElevatedBox
              style={{
                padding: 20,
                flex: 1,
                backgroundColor:
                  selectedOption == index + 2 ? "#ffffff" : gender == 'girl' ? "#ffb1d2": '#a3c5ff',
              }}
              text={item.firstname + " " + item.lastname}
              textStyle={{color: gender == 'girl' ? "#fd4996" : '#3f85fa',fontWeight:"bold"}}
              disabled={true}
              key={index}
            />
          );
        })}
      </View>
    </>
  );
};

export default LikeViewScreen;
