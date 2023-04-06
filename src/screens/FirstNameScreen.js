import React, { useLayoutEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import { UserContext } from '../context/UserContext';

const FirstNameScreen = ({navigation}) => {
    const {user,updateUser} = React.useContext(UserContext);

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
  
    const handleNext = () => {
      navigation.navigate('LastNameScreen')
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.question}>What's your first name?</Text>
          <TextInput
            style={styles.input}
            value={user.firstname}
            onChangeText={handleFirstName}
            placeholder="First Name"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            autoFocus={true}
          />
        </View>
        <CustomButton 
        buttonStyles={user.firstname.length != 0 ? styles.nextButton:[styles.nextButton,styles.disabledButton]}
        onPress = {handleNext}
        buttonText={"Next"}
        textStyles={styles.nextButtonText}
        disabled={user.firstname.length == 0}
        />
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
    }
  });
  

  export default FirstNameScreen;