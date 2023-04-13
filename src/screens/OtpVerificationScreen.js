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
import CustomText from "../components/CustomText";
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

  const {user,updateUserId} = React.useContext(UserContext);
  const {updateAuthState} = React.useContext(AuthContext)
  const {publicAxios} = React.useContext(AxiosContext);
  const isLogin = route.params?.isLogin || false;
  const [errorMessage,setErrorMessage] = useState(null);

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
    setErrorMessage(null)
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

      return publicAxios.post('/get_otp', { mobile: '91'+ user.phone,"task":"resend" })
    }

  const { otp, otpResponse,otpError, handleOtpChange, handleOtpSubmit,isOtpValidating } =
    useOtpValidation(validateOtp);

const {timeRem, resendResponse,resendError, handleResendOtp,resendOngoing} = useOtpResend(resendOtp,60);

useEffect(() => {
  
    if(otpResponse){
      console.log(otpResponse.data)
    }
    if(otpResponse && otpResponse.data.status == 0){
        console.log(otpResponse.data.jwt_token)
        saveToStorage("authToken",otpResponse.data.jwt_token)
        updateAuthState({token:otpResponse.data.jwt_token,isSignUp:!isLogin})
        
        console.log("Setting user_id",otpResponse.data.user_id)
        saveToStorage("userId",otpResponse.data.user_id)
        updateUserId(otpResponse.data.user_id)
      
    }else if(otpResponse && otpResponse.data.status == 1){
      setErrorMessage("The OTP you entered is incorrect. Please try again!")
    }else if(otpResponse && otpResponse.data.status == 2){
      setErrorMessage("The mobile number you entered is not registered. Please signup!")
    }else if(otpResponse && otpResponse.data.status == 3){
      setErrorMessage("Ops!We encontered an error. Please try again!")
    }else if(otpResponse && otpResponse.data.status == 4){
      setErrorMessage("The mobile number you entered is already registered. Please login!")
    }

},[otpResponse])
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <CustomText style={styles.title}>Enter the OTP you received</CustomText>
        <View style={styles.root}>
          <CodeField
            value={otp}
            onChangeText={handleOtpChange}
            renderCell={({ index, symbol, isFocused }) => (
              <CustomText key={index} style={styles.cell}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </CustomText>
            )}
            cellCount={4}
            keyboardType="number-pad"
            autoFocus
          />
        </View>
            {getStatusRender(timeRem,resendResponse,resendOngoing,handleResendOtp)}
            {errorMessage && <CustomText style={{color:"white",textAlign:"center",fontSize:18,marginTop:10}}>{errorMessage}</CustomText>}
            {otpError && <CustomText style={{color:"white",textAlign:"center",fontSize:18,marginTop:10}}>{"Some error occured on our servers!Please try again!"}</CustomText>}
            {resendError && <CustomText style={{color:"white",textAlign:"center",fontSize:18,marginTop:10}}>{"Some error occured on our servers!Please try again!"}</CustomText>}

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
        return <CustomText style={{textAlign:"center"}}>Did not received the Otp?Resend in {timeRem}s</CustomText>
    }else if(!resendOngoing){
        return <TouchableOpacity onPress={handleResendOtp}>
        <CustomText style={{"textDecorationLine":"underline",color:"blue",textAlign:"center"}} >Resend Otp</CustomText>
        </TouchableOpacity>
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
