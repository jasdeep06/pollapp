import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import React,{useState} from "react";
import { useEffect, useLayoutEffect } from "react";

import ActionModal from "../components/ActionModal";
import { AxiosContext } from "../context/AxiosContext";
import CustomButton from "../components/CustomButton";
import ElevatedBox from "../components/ElevatedBox";
import Loader from "../components/Loader";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

// import { likeViewDummyData } from "../data/dummyLikeViewData";



const LikeViewScreen = ({route,navigation}) => {

  const {authAxios} = React.useContext(AxiosContext);
  const like_id = route.params.like_id;
  const gender = route.params.gender;

  const [likeViewData,setLikeViewData] = React.useState(null)
  const [isLoadingLikeViewData,setIsLoadingLikeViewData] = React.useState(true)

  const [modalVisible, setModalVisible] = useState(false);
  const [revealInfo,setRevealInfo] = useState(null)
  const [isRevealLoading,setIsRevealLoading] = useState(false)

  

  const handleToggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleRevealPress = () => {
    if(!likeViewData.revealed){
        revealLike()
    }
    handleToggleModal()
  }


  useLayoutEffect (() => {
    navigation.setOptions({
      headerStyle:{
        backgroundColor:gender == "boy"?"#4A90E2":"#F06292"
      }
    })
  },[navigation])

  const revealLike = async () => {
    setIsRevealLoading(true)
    const response = await authAxios.get('/reveal_like',{params:{like_id:like_id}})
    if(response.data.status == 0){
        console.log(response.data.data)
        setRevealInfo(response.data.data)
        setIsRevealLoading(false)
    }
  }


  const getLikeViewData = async () => {
    setIsLoadingLikeViewData(true)
    const response = await authAxios.get('/get_like_details',{params:{like_id:like_id}})
    if(response.data.status == 0){
        setLikeViewData(response.data.data)
        console.log(response.data.data)
        setIsLoadingLikeViewData(false)
    }

  }

  useEffect(() => {
    getLikeViewData()
  },[])


  return (
    <View style={{ backgroundColor: gender == "boy"?"#4A90E2":"#F06292", flex: 1,padding:20 }}>
      <StatusBar backgroundColor={gender == "boy"?"#4A90E2":"#F06292"} barStyle="light-content" />
      {!isLoadingLikeViewData ? <View style={styles.content}>
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Image
            source={
              gender == "boy"
                ? require("../../assets/images/boy.png")
                : require("../../assets/images/girl.png")
            }
            style={styles.image}
          />
          <Text style={{ alignSelf: "center", color: "white",fontSize:15 }}>
            From a {gender}
          </Text>
        </View>
        <View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.questionText}>
              {likeViewData["question"]}
            </Text>
            {getOptionView(likeViewData)}
          </View>
        </View>
        <CustomButton
buttonText = {getButtonText(likeViewData,revealInfo)}  
buttonStyles={{ backgroundColor: "black" }}
  onPress={handleRevealPress}
 icon={getButtonIcon(likeViewData,revealInfo)}
/>
      </View>:<Loader visible={isLoadingLikeViewData} />}
      {likeViewData && (<ActionModal isVisible={modalVisible} toggleModal={handleToggleModal} modalStyle={{backgroundColor: gender == "boy"?"#4A90E2":"#F06292"}}>
        {getModalView(likeViewData,revealInfo,isRevealLoading)}
        </ActionModal>)}
    </View>
  );
};


const getModalView = (likeViewData,revealInfo,isRevealLoading) => {
    if(likeViewData.revealed){
        return (
            <>
            <Image source={{uri:likeViewData.photo}}   style={{ width: 100, height: 100,borderRadius:50,marginHorizontal:10,alignSelf:"center" }}      />
        <Text style={{textAlign:"center",fontSize:20,color:"white"}}>{`${likeViewData.firstname} ${likeViewData.lastname}`}</Text>

            </>
        )
    }else if(isRevealLoading){
        return <Loader visible={isRevealLoading} />
    }else if(revealInfo != null){
        return(
        <>
            <Image source={{uri:revealInfo.photo}}   style={{ width: 100, height: 100,borderRadius:50,marginHorizontal:10,alignSelf:"center" }}      />
        <Text style={{textAlign:"center",fontSize:20,color:"white"}}>{`${revealInfo.firstname} ${revealInfo.lastname}`}</Text>
        <Text style={{textAlign:"center",fontSize:15,color:"white"}}>You have {revealInfo.num_reveals} reveals remaining!</Text>

            </>
        )
    }else{
        return <Loader visible={isRevealLoading} />
    }
}

const getButtonText = (likeViewData,revelInfo) => {
    if(likeViewData && likeViewData.revealed == false && revelInfo != null){
        return `${revelInfo.firstname} ${revelInfo.lastname}`
    }else if(likeViewData && likeViewData.revealed == true){
        return `${likeViewData.firstname} ${likeViewData.lastname}`
    }else{
        return "See who sent it"
    }

}

const getButtonIcon = (likeViewData,revelInfo) => {
    if(likeViewData && likeViewData.revealed == false && revelInfo != null){
        return <Image source={{uri:revelInfo.photo}}   style={{ width: 30, height: 30,borderRadius:50,marginHorizontal:10 }}/>
    }else if(likeViewData && likeViewData.revealed == true){
        return <Image source={{uri:likeViewData.photo}}   style={{ width: 30, height: 30,borderRadius:50,marginHorizontal:10 }}/>
    }else{
        return <MaterialIcons name="lock" size={24} color="white" style={{ marginHorizontal: 5 }} />
    }
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    margin:20
  },
  questionText: {
    color: "white",
    alignSelf: "center",
    fontSize: 20,
    textAlign: "center",
    margin:10
  },
    content: {
    flex: 1,
    justifyContent: "space-around",
    }
});

const getOptionView = (likeViewData) => {
  const selected_id = likeViewData["selected_id"];
  const selectedOption = likeViewData['option_list'].findIndex(obj => obj.user_id == selected_id);
  console.log(selectedOption)
  return (
    <>
      <View style={{ flexDirection: "row" }}>
        {likeViewData["option_list"].slice(0, 2).map((item, index) => {
          return (
            <ElevatedBox
              style={{ padding: 20, flex: 1,backgroundColor:selectedOption==index?"white":"#6D6D6D" }}
              text={item.firstname + " " + item.lastname}
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
              style={{ padding: 20, flex: 1,backgroundColor:selectedOption==index+2?"white":"#6D6D6D" }}
              text={item.firstname + " " + item.lastname}
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
