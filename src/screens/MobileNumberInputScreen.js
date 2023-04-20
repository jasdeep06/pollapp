import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';

import { AxiosContext } from '../context/AxiosContext';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import { UserContext } from '../context/UserContext';

const MobileNumberInputScreen = ({navigation,route}) => {
    // const [mobileNumber, setMobileNumber] = useState('');
    const {user,updateUser} = React.useContext(UserContext);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const {publicAxios,sendOtpAxios} = React.useContext(AxiosContext);
    const isLogin = route.params?.isLogin || false;
    const [errorMessage, setErrorMessage] = useState(null);

    useLayoutEffect(() => {
      navigation.setOptions({
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "#fa7024",
        },
      });
    }, [navigation]);

    const handleNextButton = async () => {
      console.log('Mobile Number:', user.phone);
      setErrorMessage(null);
      setIsSendingOtp(true);
      try{
      const result  = await sendOtpAxios.post('/get_otp', { mobile: "91" + user.phone,"task":"send",isLogin:isLogin })
      if(result.data.status == 0){
        console.log("OTP sent successfully");
        navigation.navigate("OtpVerificationScreen",{isLogin:isLogin})
        setIsSendingOtp(false);
      }else if(result.data.status == 2){
        if(isLogin){
          setErrorMessage("The mobile number you entered is not registered. Please signup!");
          setIsSendingOtp(false)
        }else{
          setErrorMessage("The mobile number you entered is already registered. Please login!");
          setIsSendingOtp(false)
        }
      }
      else{
        console.log(respose.data)
        setErrorMessage("Some error occured on our servers!Please try again!");
        setIsSendingOtp(false);
      }
    }catch(err){
      console.log(err);
      setErrorMessage("Some error occured on our servers!Please try again!")
      setIsSendingOtp(false);
    };
  }
    const handleMobileNumberChange = (text) => {
        const filteredText = text.replace(/[^0-9]/g, '');
        updateUser({'phone':filteredText});
      };
  
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fa7024" />
        {isLogin &&
        (<View style={{flexDirection:"row"}}>
          <View style={{flex:1}}/>
          <TouchableOpacity
          onPress={() =>
            navigation.navigate("BannerScreen")
          }
        >
          <CustomText style={styles.loginText}>Sign Up</CustomText>
        </TouchableOpacity>        
        
        </View>)}
        <View style={styles.content}>

        <CustomText style={styles.title}>{isLogin ? "Login using your mobile":"Enter your phone number"}</CustomText>
        <View style={styles.inputContainer}>
          <CustomText style={styles.countryCode}>+91</CustomText>
          <TextInput
            style={styles.mobileInput}
            keyboardType="numeric"
            maxLength={10}
            onChangeText={(text) => handleMobileNumberChange(text)}
            value={user.phone}
            placeholder="Mobile Number"
          />
        </View>
        {!isLogin ?  <CustomText style={styles.warning}>
          Remember - never sign up with another person's phone number.We will send you an OTP.
        </CustomText>:<CustomText style={styles.warning}>
          We will send you an OTP.
        </CustomText>}
        {errorMessage && <CustomText style={{color:"white",textAlign:"center",fontSize:18,margin:10}}>{errorMessage}</CustomText>}
        </View>

        {/* <View style={styles.buttonContainer}> */}

        {/* <TouchableOpacity
          style={[
            styles.nextButton,
            user.phone && user.phone.length === 10
              ? styles.nextButtonEnabled
              : styles.nextButtonDisabled,
          ]}
          onPress={handleNextButton}
          disabled={user.phone == null || user.phone.length !== 10}
        >
          <CustomText style={styles.nextButtonText}>Next</CustomText>
          {isSendingOtp && <ActivityIndicator/>}
        </TouchableOpacity> */}
        <CustomButton 
          buttonStyles={[
            styles.nextButton,
            user.phone && user.phone.length === 10 && !isSendingOtp ? {} :styles.disabledButton
          ]}
          textStyles={styles.nextButtonText}
          buttonText={"Next"}
          disabled={user.phone == null || user.phone.length !== 10 || isSendingOtp}
          onPress={handleNextButton}
          icon={isSendingOtp ? <ActivityIndicator size="small" color="black"/> : null}
          />
        {/* </View> */}

      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fa7024',
        // paddingTop: 30,
        paddingBottom: 30,
      },
      content:{
        flex: 1,
        justifyContent: 'center',
        textAlign:'center'
      },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 10,
      alignSelf: 'center',
      alignItems: 'center',
    },
    countryCode: {
      fontSize: 18,
      marginRight: 10,
      color:"#ffffff"
    },
    mobileInput: {
      borderBottomWidth: 1,
      borderBottomColor: '#FFFFFF',
      fontSize: 18,
      color: '#FFFFFF',
      width: '50%',
    },
    warning: {
      fontSize: 14,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    loginText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "bold",
      marginRight:10
    },
    // nextButton: {
    //   borderRadius: 30,
    //   borderWidth: 1,
    //   borderColor: '#FFFFFF',
    //   paddingHorizontal: 20,
    //   paddingVertical: 10,
    //   marginBottom: 10,
    //   width: '85%',
    //   alignItems: 'center',
    //   backgroundColor: '#ffffff',
    //   alignSelf:"center"
    // },
    // nextButtonEnabled: {
    //   backgroundColor: '#FF8C00',
    // },
    nextButton:{
      borderWidth:0,
      backgroundColor: '#ffffff',
      width:"80%",
      alignSelf:"center"
    },
    disabledButton: {
      backgroundColor: "#fdbf9c",
    },
    nextButtonText: {
      color: "#fa7024",
    },
    // buttonContainer: {
    //     width: '100%',
    //     alignItems: 'center',
    //     alignSelf:'flex-end'
    //   },
  });

  export default MobileNumberInputScreen;
