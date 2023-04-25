import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';

import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import { UserContext } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';

const LastNameScreen = ({navigation}) => {
  const {user,updateUser} = React.useContext(UserContext);
  const lastnameRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: "#fa7024",
      },
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      if(lastnameRef.current){
        lastnameRef.current.focus();
      }
      return () => {}
    },[])
  )

  const handleNext = () => {
    navigation.navigate("GenderScreen")
  };
  const handleLastName = (text) => {
    updateUser({lastname:text})
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CustomText style={styles.question}>What's your last name?</CustomText>
        <TextInput
          style={styles.input}
          value={user.lastname}
          onChangeText={handleLastName}
          placeholder="Last Name"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          fontSize={20}
          autoFocus={true}
          ref={lastnameRef}
        />
      </View>
      <KeyboardAvoidingView style={Platform.OS == 'ios'  ? {flex:1} : {}}>
      <CustomButton 
        buttonStyles={user.lastname.length != 0 ? styles.nextButton:[styles.nextButton,styles.disabledButton]}
        onPress = {handleNext}
        buttonText={"Next"}
        textStyles={styles.nextButtonText}
        disabled={user.lastname.length == 0}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fa7024',
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
    fontSize: 20,
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
  }
});

export default LastNameScreen;
