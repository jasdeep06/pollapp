import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { CodeField, Cursor } from "react-native-confirmation-code-field";
import React, { useEffect, useLayoutEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import { AxiosContext } from "../context/AxiosContext";
import { CommonActions } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserContext } from "../context/UserContext";
import useOtpResend from "../hooks/useOtpResend";
import useOtpValidation from "../hooks/useOtpValidation";

const reformatContacts = (contacts) => {
  return contacts.reduce((result, contact) => {
    if ('phoneNumbers' in contact) {
      const uniqueNumbers = new Set();
      contact.phoneNumbers.forEach((number) => {
        let formattedNumber = number.number.replace(/[-\s]/g, '');

        // If the number starts with '+91', remove the '+'
        if (formattedNumber.startsWith('+91')) {
          formattedNumber = formattedNumber.replace('+', '');
        }
        // If the number is 10 digits, prepend '91'
        else if (formattedNumber.length === 10) {
          formattedNumber = '91' + formattedNumber;
        }
        // If the number is 11 digits and starts with '0', remove '0' and prepend '91'
        else if (formattedNumber.length === 11 && formattedNumber.startsWith('0')) {
          formattedNumber = '91' + formattedNumber.substring(1);
        }
        uniqueNumbers.add(formattedNumber);
      });
      
      result.push({
        name: contact.name,
        numbers: Array.from(uniqueNumbers),
      });
    }
    return result;
  }, []);
};



const saveToStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    console.log(err);
  }
};


const OtpVerificationScreen = ({navigation,route}) => {

  const {user,updateUser} = React.useContext(UserContext);
  const {updateAuthToken} = React.useContext(AuthContext);
  const {publicAxios} = React.useContext(AxiosContext);
  const isLogin = route.params?.isLogin || false;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: "#fa7024",
      },
    });
  }, [navigation]);
  
  
  const validateOtp = async (otp) => {
    console.log(!isLogin ?  {
      "mobile": "91" + user.phone,
      "otp": otp,
      "concern":isLogin ? "login":"signup",
      "firstname":user.firstname,
      "lastname":user.lastname,
      "gender":user.gender,
      "age":user.age,
      "school_id":user.school,
      "photo":user.photo.base64.slice(0,100),
      "grade":user.grade,
      "latitude":user.location.coords.latitude,
      "longitude":user.location.coords.longitude,
      "contacts":reformatContacts(user.contacts)
    }:{
      "mobile": "91" + user.phone,
      "otp": otp,
      "concern":"login"
    })
    return publicAxios.post("/verify_otp", !isLogin ?  {
      "mobile": "91" + user.phone,
      "otp": otp,
      "concern":"signup",
      "firstname":user.firstname,
      "lastname":user.lastname,
      "gender":user.gender,
      "age":user.age,
      "school_id":user.school,
      "photo":user.photo.base64,
      "grade":user.grade,
      "latitude":user.location.coords.latitude,
      "longitude":user.location.coords.longitude,
      "contacts":reformatContacts(user.contacts)
    }:{
      "mobile": "91" + user.phone,
      "otp": otp,
      "concern":isLogin ? "login":"signup"
    })
  };


  useLayoutEffect (() => {
    // console.log(reformatContacts(user.contacts))
    navigation.setOptions({
      headerTitle: "Otp sent on " + user.phone
    })
  },[navigation])

    const resendOtp = async () => {
      return publicAxios.post('/get_otp', { phone: user.phone,"task":"resend" })
    }

  const { otp, otpResponse, handleOtpChange, handleOtpSubmit,isOtpValidating } =
    useOtpValidation(validateOtp);

const {timeRem, resendResponse, handleResendOtp,resendOngoing} = useOtpResend(resendOtp,10);

useEffect(() => {
  // console.log(otpResponse)
    //console.log(otpResponse.data.status)
    if(otpResponse){
      console.log(otpResponse.data)
    }
    if(otpResponse && otpResponse.data.status == 0){
        console.log(otpResponse.data.jwt_token)
        saveToStorage("authToken",otpResponse.data.jwt_token)
        updateAuthToken(otpResponse.data.jwt_token)
        if(isLogin){
        // navigation.navigate("Tabs")
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'Tabs' },

            ],
          })
        )
        }else{
          // navigation.navigate("IntroScreen")
        //   navigation.dispatch(
        //     CommonActions.reset({
        //       index: 0,
        //       routes: [
        //         { name: 'IntroScreen' },
        //       ],
        // })
        //   )
        console.log("navigating to intro screen")
        console.log('Current navigation state:', JSON.stringify(navigation.getState(), null, 2));
        navigation.reset({
          index: 0,
          routes: [{ name: 'IntroScreen' }],
        })
      }
    }

},[otpResponse])
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={styles.title}>Enter the OTP you received</Text>
        <View style={styles.root}>
          <CodeField
            value={otp}
            onChangeText={handleOtpChange}
            renderCell={({ index, symbol, isFocused }) => (
              <Text key={index} style={styles.cell}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
            cellCount={4}
            keyboardType="number-pad"
            autoFocus
          />
        </View>
        {/* {timeRem > 0 ? <Text>Did not received the Otp?Resend in {timeRem}s</Text> : <Text style={{"textDecorationLine":"underline",color:"blue"}} onPress={handleResendOtp}>Resend Otp</Text>} */}
            {getStatusRender(timeRem,resendResponse,resendOngoing,handleResendOtp)}
      </View>
      <View>
        <CustomButton
          onPress={handleOtpSubmit}
          buttonText={"Verify"}
          buttonStyles={[
            { marginBottom: 20,borderWidth:0,backgroundColor:"#ffffff" },
            otp.length == 4 ? {} : styles.disabledButton,
          ]}
          icon = {isOtpValidating && <ActivityIndicator/>}
          textStyles={{color: "#fa7024"}}
        />
      </View>
    </SafeAreaView>
  );
};

const getStatusRender = (timeRem,resendResponse,resendOngoing,handleResendOtp) => {
    if(timeRem > 0){
        return <Text style={{textAlign:"center"}}>Did not received the Otp?Resend in {timeRem}s</Text>
    }else if(!resendOngoing){
        return <Text style={{"textDecorationLine":"underline",color:"blue",textAlign:"center"}} onPress={handleResendOtp}>Resend Otp</Text>
    }else if(resendOngoing){
        return <ActivityIndicator size="small" color="white" />
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fa7024",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "white",
    textAlign: "center",
    color:"white"
  },
  root: {
    paddingLeft: "20%",
    paddingRight: "20%",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: "#fdbf9c",
  },
});

export default OtpVerificationScreen;
