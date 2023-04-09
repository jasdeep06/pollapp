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

import CustomButton from "../components/CustomButton";
import { FontAwesome } from "@expo/vector-icons";
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
    <View style={styles.container}>
      <StatusBar backgroundColor="#fa7024" barStyle="light-content" />

      <View style={{ flex: 1 }} />
      <View style={{ flex: 4, alignItems: "center" }}>
        <Image source={razzImage} style={{ width: 200, height: 70 }} />
        <Text style={styles.descriptionText}>
          Razz needs to find your school and suggest friends
        </Text>
        <View style={{ marginTop: 10,width:"100%",alignItems:"center" }}>
          <CustomButton
            buttonText={
              user.location != null ? "Location enabled" : "Enable location"
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
              user.contacts != null ? "Contacts enabled" : "Enable contacts"
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

      <Text style={{ color: "white", margin: 10, textAlign: "center" }}>
        <FontAwesome name="lock" size={14} color="white" /> Razz cares intensely
        about privacy. We will never text or spam your contacts.
      </Text>
    </View>
  );
};

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
  }
});

export default PermissionsScreen;
