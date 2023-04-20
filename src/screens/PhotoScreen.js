import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { AxiosContext } from "../context/AxiosContext";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import Loader from "../components/Loader";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { UserContext } from "../context/UserContext";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useNavigation } from "@react-navigation/native";

const PhotoScreen = () => {
  const { user, updateUser } = React.useContext(UserContext);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [showCamera, setShowCamera] = React.useState(false);
  const [cameraRef, setCameraRef] = React.useState(null);
  const [capturedImage, setCapturedImage] = useState(
    user.photo != null ? user.photo.uri : null
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const { verifyAxios } = React.useContext(AxiosContext);
  const [verificationMessage, setVerificationMessage] = useState(null);
  const [error,setError] = useState(false);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: "#fa7024",
      },
    });
  }, [navigation]);

  const handlePhotoVerification = async (data) => {
    try{
    console.log("Verifying photo");
    setIsVerifying(true);
    await verifyAxios
      .post("/liveness", { image: data.base64 })
      .then((res) => {
        console.log(res.data);
        if (res.data.status == 0) {
          setVerificationMessage("Photo verification successfull!");
          updateUser({ photo: data });
        } else if (res.data.status == 3) {
          setVerificationMessage("Face is not clear!Please try again!");
        } else if (res.data.status == 2) {
          setVerificationMessage(
            "Multiple faces found in the photo!Please try again!"
          );
        } else if (res.data.status == 1) {
          setVerificationMessage("No face found in the photo!Make sure your face is clearly visible and is straight while looking at the camera!");
        } else if(res.data.status == 4){
          setVerificationMessage("Your photo was moderated by our system.Please try again!")
        }else{
          setVerificationMessage("Due to a netwwork issue,we could not verify your image.Kindly retake it!")
          // setCapturedImage(null);
        }
        setIsVerifying(false);
      });
    }catch(err){
      console.log(err)
      setVerificationMessage("Due to a netwwork issue,we could not verify your image.Kindly retake it!")
      setIsVerifying(false);
    }
  };

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: !showCamera, // Hide header when the camera is open
    });
  }, [navigation, showCamera]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault(); // Prevent default action
      unsubscribe(); // Unsubscribe the event on first call to prevent infinite loop
      updateUser({ photo: null });
      navigation.navigate("GenderScreen"); // Navigate to your desired screen
    });
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const ratios = await cameraRef.getSupportedRatiosAsync();
      console.log(ratios);
      const data = await cameraRef.takePictureAsync({ base64: true ,quality:0.1});
      console.log(data.base64.length)
      setCapturedImage(data.uri);
      setShowCamera(false);
      handlePhotoVerification(data);
    }
  };

  const handleNext = () => {
    // console.log(user)
    navigation.navigate("MobileNumberInputScreen");
  };

  const handleRetake = () => {
    updateUser({ photo: null })
    setCapturedImage(null);
    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
  };

  const handleIconPress = async () => {
    const response = await requestPermission();
    if (!response.granted) {
      Alert.alert(
        "Permission Denied",
        "In order to ensure only genuine people join Razz, it is required to click a photo! Please go to settings and enable camera permissions",
        [
          {
            text: "Go to Settings",
            onPress: () => Linking.openSettings(),
          },
          { text: "Cancel" },
        ]
      );
    } else {
      setShowCamera(true);
    }
  };
  if (!permission || !permission.granted || !showCamera) {
    return (
      <View style={styles.container}>
        {/* <StatusBar style="light" backgroundColor="#fa7024" /> */}
        <View style={{ flex: 1 }} />
        <View style={{ flex: 2,alignItems:"center" }}>
          <CustomText style={styles.title}>Add a profile photo</CustomText>
          {capturedImage ? (
            isVerifying ? (
              <ActivityIndicator />
            ) : (
              <>
                <Image source={{ uri: capturedImage }} style={styles.image} />
                <CustomText style={{textAlign:"center",padding:20,color:"white",fontSize:18}}>{verificationMessage}</CustomText>
              </>
            )
          ) : (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={handleIconPress}
            >
              <MaterialIcons name="add-a-photo" size={50} color="white" />
            </TouchableOpacity>
          )}
        </View>
        {/* <View style={styles.buttonContainer}>
            {capturedImage &&
          <TouchableOpacity style={styles.button} onPress={handleRetake}>
            <CustomText style={styles.buttonText}>Retake Photo</CustomText>
          </TouchableOpacity>}
          <TouchableOpacity disabled={user.photo == null} onPress={handleNext} style={[styles.button,user.photo ? {} : styles.disabledButton]}>
            <CustomText style={styles.buttonText}>Next</CustomText>
          </TouchableOpacity>
        </View> */}
        <View style={{width:"100%",alignItems:"center",marginBottom:20}}>
          {capturedImage && <CustomButton buttonText={"Retake Photo"} 
          buttonStyles={styles.button} 
          textStyles={styles.buttonText}
          onPress={handleRetake}/>}
          <CustomButton buttonText={"Next"} 
          buttonStyles={[styles.button,user.photo ? {} : styles.disabledButton]} 
          disabled={user.photo == null} 
          textStyles={styles.buttonText} 
          onPress={handleNext}/>
          {!capturedImage && <TouchableOpacity onPress={handleNext}>
            <CustomText style={{color:"white",fontSize:18,fontWeight:"bold"}}>Skip</CustomText>
          </TouchableOpacity>}
        </View>
      </View>
    );
  } else {
    return (
      <Camera
        style={{ flex: 1, flexDirection: "column" }}
        type={CameraType.front}
        ref={(ref) => setCameraRef(ref)}
        ratio={"1:1"}
      >
        <View style={styles.closeButton}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={{ marginRight: 10, backgroundColor: "red" }}
            onPress={closeCamera}
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.captureButton}>
          <TouchableOpacity onPress={takePicture}>
            <MaterialIcons name="camera" size={60} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fa7024",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 30,
  },
  iconContainer: {
    marginBottom: 100,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 30,
    position: "absolute",
    bottom: 30,
  },
  button: {
    // backgroundColor: "transparent",
    // borderColor: "white",
    // borderWidth: 2,
    // borderRadius: 30,
    // paddingVertical: 15,
    // paddingHorizontal: 20,
    // alignItems: "center",
    // justifyContent: "center",
    // marginBottom: 10,
    borderWidth:0,
    backgroundColor: '#ffffff',
    width:"80%"
  },
  disabledButton: {
    backgroundColor: "#fdbf9c",
  },
  buttonText: {
    // fontSize: 18,
    // fontWeight: "bold",
    color: "#fa7024",
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 50,
    padding: 15,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  closeButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 30,
  },
});

export default PhotoScreen;
