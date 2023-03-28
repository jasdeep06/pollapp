import * as Contacts from 'expo-contacts';
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
import React, { useEffect, useState } from "react";

import { FontAwesome } from "@expo/vector-icons";
import { UserContext } from '../context/UserContext';
import { getStatusBarHeight } from "react-native-status-bar-height";

const buttonWidth = Dimensions.get("window").width * 0.8;

const PermissionsScreen = ({navigation}) => {
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  // const [locationGranted, setLocationGranted] = useState(true);
  // const [contactsGranted, setContactsGranted] = useState(false);
  const [isRequestingContacts, setIsRequestingContacts] = useState(false);
  const {user,updateUser} = React.useContext(UserContext);

  const requestLocationPermission = async () => {
    if (isRequestingLocation) {
      return;
    }

    setIsRequestingLocation(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "In order for the gas app to work properly, you need to enable location!",
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
      updateUser({'location':location})
    } catch (error) {
      console.log("Error requesting location permission:", error);
    }
    setIsRequestingLocation(false);
  };

  const requestContactsPermission = async () => {
    if(isRequestingContacts){
      return;
    }
    setIsRequestingContacts(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
  
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'In order for the gas app to work properly, you need to enable contacts access!',
          [
            {
              text: 'Go to Settings',
              onPress: () => Linking.openSettings(),
            },
            { text: 'Cancel' },
          ],
        );
        return;
      }
  
      const { data } = await Contacts.getContactsAsync();
      setIsRequestingContacts(false);
      // setContactsGranted(true);
      updateUser({'contacts':data})
      // data.forEach((contact) => {
      //   console.log(`Contact name: ${contact.name}`);
      //   if (contact.phoneNumbers) {
      //     contact.phoneNumbers.forEach((phoneNumber) => {
      //       console.log(`Phone number: ${phoneNumber.number}`);
      //     });
      //   }
      // });
    } catch (error) {
      console.log('Error requesting contacts permission:', error);
    }
  };
  
  useEffect(() => {
    if(user.location != null && user.contacts != null){
      navigation.navigate("GradeSelectionScreen")
    }
  }, [user.location, user.contacts])



  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF8C00" barStyle="light-content" />
      <View style={styles.logoContainer}>
        <Image
          style={styles.appLogo}
          source={{
            uri: "https://ving-assets.s3.ap-south-1.amazonaws.com/app_images/fire-fireball.gif",
          }}
        />
      </View>
      <Text style={styles.descriptionText}>
        Gas needs to find your school and suggest friends
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={requestLocationPermission}
        >
          <FontAwesome name={user.location != null ? "check" : "map-marker"} size={24} color="black" />
          {user.location != null ? <Text style={styles.buttonText}>Location Enabled</Text>:<Text style={styles.buttonText}>Enable Location</Text>}
          {isRequestingLocation && (
            <ActivityIndicator size="small" color="black" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={requestContactsPermission}
        >
          <View style={styles.buttonContent}>
            <FontAwesome name={user.contacts != null ? "check" :  "address-book"} size={24} color="black" />
            {user.contacts != null ? <Text style={styles.buttonText}>Contacts Enabled</Text>: <Text style={styles.buttonText}>Enable Contacts</Text>}
            {isRequestingContacts && (
            <ActivityIndicator size="small" color="black" />
          )}
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.privacyText}>
        <FontAwesome name="lock" size={14} color="white" /> Gas cares intensely
        about privacy. We will never text or spam your contacts.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF8C00",
    alignItems: "center",
    // marginTop: getStatusBarHeight(), // Add padding equal to the status bar height + 20
  },
  appLogo: {
    width: 150,
    height: 150,
    marginTop: "15%",
  },
  descriptionText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 30,
  },
  buttonsContainer: {
    width: "80%",
    alignItems: "center", // Add this line to center the buttons horizontally
  },
  button: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 15,
    alignItems: "center",
    flexDirection: "row", // Add this line to align icon and text horizontally
    justifyContent: "center", // Add this line to center the icon and text
    width: buttonWidth,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10, // Add this line to separate the icon and text
  },
  privacyText: {
    fontSize: 12,
    textAlign: "center",
    color: "white",
    position: "absolute",
    bottom: 20,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginTop: "15%",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PermissionsScreen;
