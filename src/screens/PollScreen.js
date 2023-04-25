import {
  ActivityIndicator,
  AppState,
  BackHandler,
  Dimensions,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";

import ActionModal from "../components/ActionModal";
import { AuthContext } from "../context/AuthContext";
import { AxiosContext } from "../context/AxiosContext";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import ElevatedBox from "../components/ElevatedBox";
import ErrorView from "../components/ErrorView";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../components/Loader";
import { MetaContext } from "../context/MetaContext";
import OneSignal from 'react-native-onesignal';
import PollsLoader from "../components/PollsLoader";
import ProgressBar from "../components/ProgressBar";
import Purchases from "react-native-purchases";
import Share from "react-native-share";
import Svg from "react-native-svg";
import { SvgUri } from "react-native-svg";
import { captureRef } from "react-native-view-shot";
import dotImage from "../../assets/images/dot.png";
import flameImage from "../../assets/images/smaller_size_flame.gif"
import { getStatusBarHeight } from "react-native-status-bar-height";
import { images } from "../screens/images";
import lockImage from "../../assets/images/lock_poll.png";
import notEnoughImage from "../../assets/images/not_enough_friends_8_friends.png"
import playAgainImage from "../../assets/images/play_again.png";
import razzImage from "../../assets/images/razz_60_percent.png"
import shareImage from '../../assets/images/poll.png'
import { useFocusEffect } from "@react-navigation/native";
import whatsappImage from "../../assets/images/whatsapp.png";

// import DynamicImage from "../components/DynamicImage";

// import { dummyData } from "../data/pollDummyData";

// import  {dummyData}  from "../data/pollDummyData"

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  return `#${r.padStart(2, "0")}${g.padStart(2, "0")}${b.padStart(2, "0")}`;
}

function randomSoothingColor() {
  console.log("Generating random soothing color...");
  const hue = Math.floor(Math.random() * 361);
  const saturation = Math.floor(Math.random() * 26) + 25;
  const lightness = Math.floor(Math.random() * 21) + 20;

  console.log("generated ", hslToHex(hue, saturation, lightness));
  console.log("wjkk");
  return hslToHex(hue, saturation, lightness);
}

function lightenColor(hexColor, percent) {
  // Remove the '#' from the hex color
  const sanitizedHex = hexColor.replace("#", "");

  // Convert the hex color to RGB
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);

  // Increase the brightness by the given percentage
  const newR = Math.min(Math.round(r * (1 + percent / 100)), 255);
  const newG = Math.min(Math.round(g * (1 + percent / 100)), 255);
  const newB = Math.min(Math.round(b * (1 + percent / 100)), 255);

  // Convert the RGB values back to hex
  const newHexR = newR.toString(16).padStart(2, "0");
  const newHexG = newG.toString(16).padStart(2, "0");
  const newHexB = newB.toString(16).padStart(2, "0");

  return `#${newHexR}${newHexG}${newHexB}`;
}

const PollScreen = ({ navigation }) => {
  // console.log(dummyData);
  // const randomColor = randomSoothingColor();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffleId, setShuffleId] = useState(0);
  const [randomColor, setRandomColor] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { authAxios } = React.useContext(AxiosContext);
  const [polls, setPolls] = useState(null);
  const [isPollsLoading, setIsPollsLoading] = useState(true);
  const [isSendingResponse, setIsSendingResponse] = useState(false);
  const [status, setStatus] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const appState = React.useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [fromBackgroundToActive,setFromBackgroundToActive] = useState(false)
  const {authState} = useContext(AuthContext)
  const {updateMetadata} = useContext(MetaContext)
  const [error,setError] = useState(false)
  const [isMock,setIsMock] = useState(false)
  const viewRef = useRef(null);
  const [inviteModalVisible,setInviteModalVisible] = useState(false)

  const screenWidth = Dimensions.get("window").width

  const whatsappWidth = screenWidth * 0.8
  const whatsappAspectRatio = 752/237
  const imageHeight = whatsappWidth/whatsappAspectRatio

  useEffect(() => {
    if (countdown !== null) {
      const timer = setInterval(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
        } else if (countdown == 0) {
          console.log("calling from effect")
          getPolls();
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  useEffect(() => {
    OneSignal.setAppId("78dca1f0-2a43-4389-94ff-48b36c79e1f5");
    OneSignal.promptForPushNotificationsWithUserResponse()
  },[])

  const toggleInviteModal = () => {
    setInviteModalVisible(!inviteModalVisible)
  }

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     (e) => {
  //       e.preventDefault()
  //       console.log("exiting app ...")
  //       BackHandler.exitApp()
  //     }
  //   )
    
  //   return () => backHandler.remove()

  // },[])

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

  

  
  useEffect(()=> {
    if(status == -2){
      getPolls()
    }
  },[fromBackgroundToActive])


  const captureAndShare = async () => {
    try{
    const uri = await captureRef(viewRef, {
      format:'png',
      quality:1
    })
    const {success} = await Share.open({url:uri,failOnCancel:false})
    if(success){
      if(Platform.OS == 'android'){
      ToastAndroid.showWithGravity(
        'Shared Successfully!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      }
    }
    else{
      if(Platform.OS == 'android'){
      ToastAndroid.showWithGravity(
        'Could not share!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      }
    }
  }catch(e){
    console.log(e)
  }
  }


  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if ((appState.current === 'inactive' || appState.current === 'background') && nextAppState === 'active') {
        console.log("back to active")
        setFromBackgroundToActive(true)
      }else if(appState.current === 'active' && (nextAppState === 'background' || nextAppState == 'inactive')){
        console.log("active to back")
        setFromBackgroundToActive(false)

      }
      appState.current = nextAppState;

    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // AppState.removeEventListener('change', handleAppStateChange);
      handleAppStateChange.remove()
    };
  }, []);



  const handleSkip = () => {
    if (currentIndex < polls.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShuffleId(0);
      setSelectedIndex(null);
    } else {
      console.log("calling from skip!")
      getPolls();
    }
  };

  const getPolls = async () => {
    try{
    setError(false)
    console.log(authState)
    const response = await authAxios.get("get_polls");
    console.log(response.data);
    if (response.data.status == 0) {
      setStatus(0);
      setCurrentIndex(0)
      setCountdown(null)
      setSelectedIndex(null)
      setShuffleId(0)
      setPolls(response.data.data);
      setIsMock(response.data.mock_mode)
      // console.log("Updating metadata")
      updateMetadata({unread_likes: response.data.unread_likes,
        friend_requests: response.data.friend_requests})
      setIsPollsLoading(false);
    } else if (response.data.status == -2) {
      setStatus(-2);
      setCountdown(response.data.data);
    } else if (response.data.status == -1) {
      setStatus(-1);
    }else{
      console.log(response.data)
      setError(true)
    }
  }catch(err){
    console.log(err)
    setError(true)
  }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    // return `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2, '0')}`;
    return [
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ];
  };

  const handleShuffle = (num_shuffles) => {

    // if (shuffleId < 2) {
    //   setShuffleId(shuffleId + 1);
    // }else if(shuffleId == 2){
    //   setShuffleId(0)
    // }
    if (shuffleId < num_shuffles - 1) {
      setShuffleId(shuffleId + 1);
    } else if (shuffleId == num_shuffles - 1) {
      setShuffleId(0);
      if(isMock){
      setInviteModalVisible(true)
      }
    }
  };

  const sendResponse = async (shuffleId, selectedIndex) => {
    console.log("sending...");
    setIsSendingResponse(true);
    const response = await authAxios.post(
      "/add_response_and_like",
      {
        question_id: polls[currentIndex].ques_id,
        selected_id: polls[currentIndex].options.slice(
          4 * shuffleId,
          4 * shuffleId + 4
        )[selectedIndex].user_id,
        option_list: polls[currentIndex].options.slice(
          4 * shuffleId,
          4 * shuffleId + 4
        ),
      }
    );
    if (response.data.status == 0) {
      console.log("response sent");
      setIsSendingResponse(false);
    }else{
      console.log(response.data)
      setIsSendingResponse(false)
    }
  };
  const handleOptionSelect = (shuffleId, selectedIndex) => {
    setSelectedIndex(selectedIndex);
    console.log("doing");
    console.log("Selected index: ", selectedIndex, " Shuffle id: ", shuffleId);
    console.log(
      polls[currentIndex].options.slice(4 * shuffleId, 4 * shuffleId + 4)
    );
    console.log(
      polls[currentIndex].options.slice(4 * shuffleId, 4 * shuffleId + 4)[
        selectedIndex
      ].user_id
    );
    sendResponse(shuffleId, selectedIndex);
  };

  useEffect(() => {
    if (status == 0) {
      setRandomColor(randomSoothingColor());
    }
  }, [currentIndex, status]);

  useFocusEffect(
    React.useCallback(() => {
      if (randomColor != null && status == 0) {
        if(Platform.OS == "android"){
        StatusBar.setBackgroundColor(randomColor);
        StatusBar.setBarStyle("light-content");
        }
      }
    }, [randomColor])
  );


  useFocusEffect(
    React.useCallback(() => {
      console.log("here is it....")
      console.log(status)
      if(status == -1){
        console.log("calling from focus effect")
        getPolls()
      }
    },[status])
  )

  useEffect(() => {
    console.log("getting polls...");
    getPolls();
  }, []);

  if(error){
    return <ErrorView onRetry={getPolls} />
  }

  if (status == -1 || status == -2) {
    const screenWidth = Dimensions.get("screen").width;
    const playAgainAspectRatio = 600 / 114;
    const playAgainWidth = screenWidth * 0.8;
    const playAgainHeight = playAgainWidth / playAgainAspectRatio;
    const [mm, ss] = formatTime(countdown);

    const razzImageWidth = screenWidth * 0.5
    const razzImageHeight = razzImageWidth/3

    const notEnoughImageWidth = screenWidth * 0.6
    const notEnoughImageHeight = notEnoughImageWidth/4.5

    return (
      <SafeAreaView style={[styles.playAgainContainer, { backgroundColor: "#e9e9e9" }]}>
        <StatusBar backgroundColor="#e9e9e9" barStyle="dark-content" />
        {status === -2 && (
          <>
            <Image
              source={playAgainImage}
              style={{ height: playAgainHeight, width: playAgainWidth }}
            />
            <Image source={lockImage} style={{ height: 120, width: 120 }} />
            <CustomText
              style={{
                fontSize: 24,
                marginVertical: 20,
                fontWeight: "bold",
                color: "#656565",
              }}
            >
              New polls in..
            </CustomText>
            <View style={styles.timerContainer}>
              <View style={styles.timerPart}>
                <CustomText style={styles.timerText}>{mm}</CustomText>
              </View>
              <Image
                source={dotImage}
                style={styles.separator}
                resizeMode="contain"
              />
              <View style={styles.timerPart}>
                <CustomText style={styles.timerText}>{ss}</CustomText>
              </View>
            </View>
          </>
        )}

        {status === -1 && (
          // <>
          //   <CustomText style={styles.infoText}>
          //     You need to have at least 12 friends to participate in a poll
          //   </CustomText>
          //   <CustomButton
          //     buttonText="Add Friends"
          //     buttonStyles={styles.addButton}
          //     textStyles={{ color: "black" }}
          //     onPress={() =>
          //       navigation.navigate("Tabs", { screen: "Add Friends" })
          //     } // Replace 'AddFriendsScreen' with the actual name of the screen where users can add friends
          //   />
          // </>
          <>
          <View style={{marginBottom:20}}>
          <Image source={flameImage} style={{height:150,width:118,alignSelf:"center"}} resizeMode="cover"/>
          <Image source={razzImage} style={{height:razzImageHeight,width:razzImageWidth}}/>
          </View>
          <Image source={notEnoughImage} style={{height:notEnoughImageHeight,width:notEnoughImageWidth,marginTop:40,marginBottom:10}}/>
          <CustomButton buttonText={"Add Friends"} 
          buttonStyles={{width:"80%",alignSelf:"center",backgroundColor:"#fa7024",borderWidth:0}}
          onPress={() =>
                   navigation.navigate("Tabs", { screen: "Add" })
               } />
          </>
        )}
      </SafeAreaView>
    );
  } else if (polls && status == 0) {
    // const png = require("../../assets/poll-pngs/" + polls[currentIndex].image)
    const num_shuffles = polls[currentIndex].options.length / 4;

    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: randomColor }]}
        ref={viewRef}
      >
        <CustomText style={styles.pollText}>Poll</CustomText>
        {!isPollsLoading && <ProgressBar
          colorHex={"#FFFFFF"}
          style={styles.progressBar}
          minThickness={0.5}
          maxThickness={3}
          totalSteps={polls.length}
          stepSize={1}
          currentStep={currentIndex + 1}
        />}
        {!isPollsLoading && <CustomText style={styles.stepText}>{currentIndex + 1}/{polls.length}</CustomText>}
        {!isPollsLoading ? (
          <View style={styles.content}>
            <View>
              {/* <Image
                source={images[polls[currentIndex].image]}
                style={styles.image}
              /> */}
              <SvgUri width={120} height={120} style={{alignSelf:"center"}} uri={"https://ving-assets.s3.ap-south-1.amazonaws.com/svgs/"+ polls[currentIndex].image.replace(".png",'.svg')} />
              {/* <DynamicImage
            imageName={polls[currentIndex].image}/> */}
              <CustomText style={styles.questionText}>
                {polls[currentIndex].ques}
              </CustomText>
            </View>
            <View style={styles.column}>
              {getOptionView(
                polls,
                shuffleId,
                currentIndex,
                randomColor,
                selectedIndex,
                handleOptionSelect,
                isMock
              )}
            </View>
            {selectedIndex == null ? (
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.shuffleButton}
                  onPress={() => handleShuffle(num_shuffles)}
                  // disabled={shuffleId == 2}
                >
                  <Ionicons
                    name="shuffle"
                    size={32}
                    // color={shuffleId == 2 ? "black" : "white"}
                    color="white"
                  />
                  <CustomText
                    style={[
                      styles.footerText,
                      // shuffleId == 2 && { color: "black" },
                    ]}
                  >
                    Shuffle Options
                  </CustomText>
                  <CustomText style={{color:"white",alignSelf:"center"}}>{"(" + (shuffleId+1) + "/" + num_shuffles + ")"}</CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkip}
                >
                  <Ionicons
                    name="play-skip-forward-sharp"
                    size={32}
                    color="white"
                  />
                  <CustomText style={styles.footerText}>Skip</CustomText>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={captureAndShare}>
                <CustomText>Share</CustomText>
                </TouchableOpacity> */}
              </View>
            ) : (
              getContinueView(isSendingResponse, handleSkip,captureAndShare,isMock)
            )}
            <ActionModal 
              isVisible={inviteModalVisible} 
              backdropOpacity={0.5} 
              toggleModal={toggleInviteModal}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <CustomText style={{fontSize:18,textAlign:"center",marginHorizontal:5}}>Could not find the name you were looking for?</CustomText>
        <TouchableOpacity 
          onPress={() =>
                shareWhatsAppMessage(
                  "Hey, I just found this awesome app called Razz! It's a fun way to see who likes you! https://play.google.com/store/apps/details?id=com.jas1994.pollapp"
                )}
          // onPress={() => {navigation.navigate("IntroScreen")}}
                
                >
        <Image source={whatsappImage} 
              style={{width:whatsappWidth,height:imageHeight}}
              
              />
              </TouchableOpacity>

      </View>
            </ActionModal>
          </View>
        ) : (
          <Loader visible={isPollsLoading} />
        )}
      </SafeAreaView>
    );
  } else {
    // return <Loader visible={isPollsLoading} />;
    return <SafeAreaView style={{flex:1,backgroundColor:"#ffffff"}}>
    <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />  
    <PollsLoader text={"Loading Polls"} textStyles={{textAlign:"center",fontSize:20,fontWeight:"bold"}}/>
    </SafeAreaView>

  }
};

const renderOption = (
  option,
  index,
  shuffle_id,
  randomColor,
  selectedIndex,
  handleOptionSelect,
  isMock
) => {
  const selected = selectedIndex === index;
  const backgroundColor = selected ? lightenColor(randomColor, 90) : "white";

  function isUUIDv4(inputString) {
    const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidv4Regex.test(inputString);
  }

  return (
    <ElevatedBox
      key={index}
      style={{ flex: 1, padding: 20, backgroundColor }}
      text={isUUIDv4(option.user_id) ? option.firstname + " " + option.lastname : <CustomText><CustomText style={{fontSize:17}}>{option.firstname}</CustomText><CustomText style={{color:"#888888"}}>{" (" + option.lastname + ")"}</CustomText></CustomText> }
      // textStyle = {selected ? {color:"white"} :{}}
      onPress={() => handleOptionSelect(shuffle_id, index)}
      disabled={selectedIndex != null}
    />
  );
};

const getOptionView = (
  polls,
  shuffle_id,
  currentIndex,
  randomColor,
  selectedIndex,
  handleOptionSelect,
  isMock
) => {
  const sampledOptions = polls[currentIndex]["options"].slice(
    shuffle_id * 4,
    shuffle_id * 4 + 4
  );

  return (
    <>
      <View style={{ flexDirection: "row" }}>
        {sampledOptions
          .slice(0, 2)
          .map((option, index) =>
            renderOption(
              option,
              index,
              shuffle_id,
              randomColor,
              selectedIndex,
              handleOptionSelect,
              isMock
            )
          )}
      </View>
      <View style={{ flexDirection: "row" }}>
        {sampledOptions
          .slice(2, 4)
          .map((option, index) =>
            renderOption(
              option,
              index + 2,
              shuffle_id,
              randomColor,
              selectedIndex,
              handleOptionSelect,
              isMock
            )
          )}
      </View>
    </>
  );
};

const getContinueView = (isSendingResponse, handleSkip,captureAndShare,isMock) => {
  const screenWidth = Dimensions.get("screen").width;
  const shareWidth = screenWidth * 0.6;
  const shareHeight = screenWidth/4.63
  if (isSendingResponse) {
    return <ActivityIndicator />;
  } else {
    return (
      <View style={{justifyContent:"center"}}>
      <TouchableOpacity onPress={handleSkip}>
        <CustomText style={styles.continueText}>Tap to continue</CustomText>
      </TouchableOpacity>
      {!isMock &&
      <>
      <TouchableOpacity onPress={captureAndShare}>
      <Image source={shareImage} style={{width:shareWidth,height:shareHeight,alignSelf:"center",marginTop:10}} resizeMode="contain"/>
      </TouchableOpacity>
      <CustomText style={{color:"white",textAlign:"center",fontWeight:"bold"}}>razzapp.com</CustomText>
      </>}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: getStatusBarHeight(),
  },
  playAgainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pollText: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    padding: 2,
  },
  progressBar: {
    padding: 5,
  },
  stepText: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    padding: 5,
  },
  content: {
    justifyContent: "space-around",
    flex: 1,
    padding: 15,
  },
  image: {
    width: 80,
    height: 80,
    alignSelf: "center",
  },
  questionText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    paddingTop: 20,
    fontFamily:'Calibri'
  },
  column: {
    flexDirection: "column",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  shuffleButton: {
    flexDirection: "column",
    alignItems: "center",
  },
  skipButton: {
    flexDirection: "column",
    alignItems: "center",
  },
  footerText: {
    padding: 3,
    color: "white",
    fontSize: 20,
  },
  continueText: {
    textAlign: "center",
    color: "white",
    fontSize: 22,
  },
  separator: {
    height: 40, // The height of the boxes (fontSize of timerText + paddingVertical * 2)
    marginLeft: 5,
    marginRight: 5,
    width: 10,
  },

  // timerText: {
  //   fontSize: 24,
  //   color: 'white',
  //   marginBottom: 10,
  // },
  // timer: {
  //   fontSize: 48,
  //   color: 'black',
  //   fontWeight: 'bold',
  //   marginBottom: 20,
  // },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  timerPart: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    elevation: 10,
  },
  timerText: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "transparent",
  },
});

export default PollScreen;
