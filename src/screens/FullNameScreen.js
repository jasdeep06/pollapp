import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';

import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import { Platform } from 'expo-modules-core';
import { UserContext } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';

const FullNameScreen = ({navigation}) => {
    const {user,updateUser} = React.useContext(UserContext);
    const firstNameRef = useRef(null);


    useFocusEffect(
      React.useCallback(() => {
        if(firstNameRef.current){
          firstNameRef.current.focus();
        }
        return () => {}
      },[])
    )

    useLayoutEffect(() => {
      navigation.setOptions({
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "#fa7024",
        },
      });
    }, [navigation]);

    const handleFirstName = (text) => {
        updateUser({firstname:text})
    }

    const handleLastName = (text) => {
        updateUser({lastname:text})
    }
  
    const handleNext = () => {
      navigation.navigate('GenderScreen')
    };
  
    return (
      <SafeAreaView style={styles.container}>
       
        <View style={styles.content}>
          <CustomText style={styles.question}>What's your name?</CustomText>
          <TextInput
            style={styles.input}
            value={user.firstname}
            onChangeText={handleFirstName}
            placeholder="Firstname"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            autoFocus={true}
            ref={firstNameRef}
          />
          <TextInput
            style={styles.input}
            value={user.lastname}
            onChangeText={handleLastName}
            placeholder="Lastname"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            // autoFocus={true}
          />
            <CustomText style={styles.warning}>
            Remember - To avoid impersonation, this name along with your mobile number would be seen by people who you add friends on Razz.
            </CustomText>        
        </View>
        <KeyboardAvoidingView 
        style={Platform.OS == 'ios'  ? {flex:1} : {}}>
        <CustomButton 
        buttonStyles={user.firstname.length != 0 && user.lastname.length !=0 ? styles.nextButton:[styles.nextButton,styles.disabledButton]}
        onPress = {handleNext}
        buttonText={"Next"}
        textStyles={styles.nextButtonText}
        disabled={user.firstname.length == 0  || user.lastname.length == 0}
        />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fa7024', // Replace with your desired orange color
      paddingHorizontal: 24,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
    },
    question: {
      color: 'white',
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 16,
    },
    input: {
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: 20, // Increase the font size
        marginBottom: 32,
        textAlign: 'center',
      },
    nextButton: {
      backgroundColor: '#ffffff',
      borderRadius: 30,
      paddingVertical: 12,
      marginBottom: 16,
      alignSelf: 'center',
      width: '85%',
      borderWidth:0
    },
    nextButtonText: {
      color: '#fa7024',
      fontSize: 18,
      textAlign: 'center',
    },
    disabledButton: {
      backgroundColor: '#fdbf9c'
    },
    warning: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
      },
  });
  

  export default FullNameScreen;