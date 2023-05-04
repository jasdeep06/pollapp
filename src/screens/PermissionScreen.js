import * as Contacts from "expo-contacts";
import * as Location from "expo-location";

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";

import ActionModal from "../components/ActionModal";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../context/UserContext";
import checkImage from "../../assets/images/check.png";
import contactsImage from "../../assets/images/contacts.png";
import { getStatusBarHeight } from "react-native-status-bar-height";
import mapImage from "../../assets/images/map.png";
import razzImage from "../../assets/images/razz.png";

const buttonWidth = Dimensions.get("window").width * 0.8;

const PermissionsScreen = ({ navigation }) => {
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  // const [locationGranted, setLocationGranted] = useState(true);
  // const [contactsGranted, setContactsGranted] = useState(false);
  const [isRequestingContacts, setIsRequestingContacts] = useState(false);
  const { user, updateUser } = React.useContext(UserContext);
  const [isModalVisible, setIsModalVisible] = useState(true);

  const [locationDeclined, setLocationDeclined] = useState(false);
  const [contactsDeclined, setContactsDeclined] = useState(false);

  const storeDeclineStatus = async (key) => {
    try {
      await AsyncStorage.setItem(key, "true");
    } catch (e) {
      console.log("Error storing decline status:", e);
    }
  };

  const loadDeclineStatus = async () => {
    try {
      const locationDeclinedStatus = await AsyncStorage.getItem("locationDeclined");
      const contactsDeclinedStatus = await AsyncStorage.getItem("contactsDeclined");
      setLocationDeclined(locationDeclinedStatus === "true");
      setContactsDeclined(contactsDeclinedStatus === "true");
    } catch (e) {
      console.log("Error loading decline status:", e);
    }
  };

  useEffect(() => {
    loadDeclineStatus();
  }, []);



  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }




  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: "#fa7024",
      },
      headerTitle: "Please allow access",
    });
  }, [navigation]);

  const requestLocationPermission = async () => {
    if (isRequestingLocation) {
      return;
    }

    setIsRequestingLocation(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setIsRequestingLocation(false);
        if(locationDeclined){
        Alert.alert(
          "Permission Denied",
          "In order for the Razz app to work properly, you need to enable location!",
          [
            {
              text: "Go to Settings",
              onPress: () => Linking.openSettings(),
            },
            { text: "Cancel" },
          ]
        );
        }else{
          setLocationDeclined(true);
          storeDeclineStatus("locationDeclined")
        }
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log("User location:", location);
      // setLocationGranted(true);
      updateUser({ location: location });
    } catch (error) {
      console.log("Error requesting location permission:", error);
    }
    setIsRequestingLocation(false);
  };

  const requestContactsPermission = async () => {
    if (isRequestingContacts) {
      return;
    }
    setIsRequestingContacts(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status !== "granted") {
        setIsRequestingContacts(false);

        if(contactsDeclined){
        Alert.alert(
          "Permission Denied",
          "In order for the Razz app to work properly, you need to enable contacts access!",
          [
            {
              text: "Go to Settings",
              onPress: () => Linking.openSettings(),
            },
            { text: "Cancel" },
          ]
        );
        }else{
          setContactsDeclined(true);
          storeDeclineStatus("contactsDeclined")
        }
        return;
      }

      const { data } = await Contacts.getContactsAsync();
      setIsRequestingContacts(false);
      updateUser({ contacts: data });
    } catch (error) {
      console.log("Error requesting contacts permission:", error);
    }
  };

  useEffect(() => {
    if (user.location != null && user.contacts != null) {
      navigation.navigate("GradeSelectionScreen");
    }
  }, [user.location, user.contacts]);

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fa7024" barStyle="light-content" />

      <View style={{ flex: 1 }} />
      <View style={{ flex: 4, alignItems: "center" }}>
        <Image source={razzImage} style={{ width: 200, height: 70 }} />
        <CustomText style={styles.descriptionText}>
          Razz needs to find your school and suggest friends
        </CustomText>
        <View style={{ marginTop: 10, width: "100%", alignItems: "center" }}>
          <CustomButton
            buttonText={
              user.location != null ? "Location enabled" : getButtonString("location")
            }
            buttonStyles={{ width: "80%", backgroundColor: "white" }}
            textStyles={{ marginLeft: 5, color: "black" }}
            icon={
              isRequestingLocation ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <Image
                  source={user.location != null ? checkImage : mapImage}
                  style={{ width: 24, height: 24 }}
                />
              )
            }
            onPress={requestLocationPermission}
          />

          <CustomButton
            buttonText={
              user.contacts != null ? "Contacts enabled" : getButtonString("contacts")
            }
            buttonStyles={{ width: "80%", backgroundColor: "white" }}
            textStyles={{ marginLeft: 5, color: "black" }}
            icon={
              isRequestingContacts ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <Image
                  source={user.contacts != null ? checkImage : contactsImage}
                  style={{ width: 24, height: 24 }}
                />
              )
            }
            onPress={requestContactsPermission}
          />
        </View>
      </View>

      <CustomText style={{ color: "white", margin: 10, textAlign: "center" }}>
        <FontAwesome name="lock" size={14} color="white" /> Razz cares intensely
        about privacy. We will never text or spam your contacts.
      </CustomText>

      {(Platform.OS == 'ios' && user.location == null && user.contacts == null) && <ActionModal
        isVisible={isModalVisible}
        backdropOpacity={0.7}
        modalStyle={{ backgroundColor: "white" }}
        showDismiss={false}
      >
        <View style={styles.permissionContainer}>
          <CustomText style={styles.title}>Razz requires following permissions behind this popup:</CustomText>

          <View style={styles.permissionRow}>
            <Image source={contactsImage} style={{ width: 24, height: 24 }} />
            <CustomText style={styles.permissionText}>
              Contacts
            </CustomText>
            <CustomText style={{fontSize:16,marginTop:5}}>To find and recommend friends on Razz.</CustomText>
            <CustomText style={{fontSize:16,marginTop:5}}>To validate friends on Razz ensuring your safety.</CustomText>
          </View>

          <View style={styles.permissionRow}>
            <Image source={mapImage} style={{ width: 24, height: 24 }} />
            <CustomText style={styles.permissionText}>
              Location
            </CustomText>
            <CustomText style={{fontSize:16,marginTop:5}}>To find your school.</CustomText>
          </View>
          <CustomButton 
          buttonText="Continue" 
          buttonStyles={{backgroundColor:"#fa7024",width:"80%",marginTop:30}}
          onPress={toggleModal}/>
        </View>
      </ActionModal>}
    </SafeAreaView>
  );
};

const getButtonString = (cond) => {
  if (cond == 'location') {
    if (Platform.OS == "ios" ) {
      return "Continue Location Access";
    }else{
      return "Enable Location";
    }
  }else{
    if (Platform.OS == "ios" ) {
      return "Continue Contacts Access";
    }else{
      return "Enable Contacts";
    }
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fa7024",
    // alignItems: "center",
    // marginTop: getStatusBarHeight(), // Add padding equal to the status bar height + 20
  },
  appLogo: {
    width: 200,
    height: 70,
    marginTop: "15%",
  },
  descriptionText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 30,
    marginVertical: 30,
    color: "white",
  },
  permissionContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 19,
    marginBottom: 20,
    textAlign:"center"
  },
  permissionRow: {
    alignItems: "center",
    marginVertical: 10,
  },
  permissionText: {
    marginLeft: 10,
    fontSize: 20,
  },
});

export default PermissionsScreen;
