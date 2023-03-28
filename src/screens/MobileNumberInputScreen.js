import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';

import { AxiosContext } from '../context/AxiosContext';
import { UserContext } from '../context/UserContext';

const MobileNumberInputScreen = ({navigation}) => {
    // const [mobileNumber, setMobileNumber] = useState('');
    const {user,updateUser} = React.useContext(UserContext);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const {publicAxios} = React.useContext(AxiosContext);

    const handleNextButton = async () => {
      console.log('Mobile Number:', user.phone);
      setIsSendingOtp(true);
      const result  = await publicAxios.post('/get_otp', { phone: user.phone,"task":"send" })
      if(result.data.status == 0){
        console.log("OTP sent successfully");
        navigation.navigate("OtpVerificationScreen")
        setIsSendingOtp(false);
      }
      else{
        console.log("Error sending OTP");
      }
    };
    const handleMobileNumberChange = (text) => {
        const filteredText = text.replace(/[^0-9]/g, '');
        updateUser({'phone':filteredText});
      };
  
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#FF8C00" />
        <View style={styles.content}>

        <Text style={styles.title}>Enter your phone number</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.mobileInput}
            keyboardType="numeric"
            maxLength={10}
            onChangeText={(text) => handleMobileNumberChange(text)}
            value={user.phone}
            placeholder="Mobile Number"
          />
        </View>
        <Text style={styles.warning}>
          Remember - never sign up with another person's phone number.
        </Text>
        </View>

        <View style={styles.buttonContainer}>

        <TouchableOpacity
          style={[
            styles.nextButton,
            user.phone && user.phone.length === 10
              ? styles.nextButtonEnabled
              : styles.nextButtonDisabled,
          ]}
          onPress={handleNextButton}
          disabled={user.phone == null || user.phone.length !== 10}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          {isSendingOtp && <ActivityIndicator/>}
        </TouchableOpacity>
        </View>

      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF8C00',
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingTop: 30,
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
    nextButton: {
      borderRadius: 30,
      borderWidth: 1,
      borderColor: '#FFFFFF',
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginBottom: 10,
      width: '85%',
      alignItems: 'center',
    },
    nextButtonEnabled: {
      backgroundColor: '#FF8C00',
    },
    nextButtonDisabled: {
      backgroundColor: '#CCCCCC',
    },
    nextButtonText: {
      fontSize: 18,
      color: '#FFFFFF',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        alignSelf:'flex-end'
      },
  });

  export default MobileNumberInputScreen;
