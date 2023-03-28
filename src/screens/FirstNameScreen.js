import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { UserContext } from '../context/UserContext';

const FirstNameScreen = ({navigation}) => {
    const {user,updateUser} = React.useContext(UserContext);

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
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };
  
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FF8C00', // Replace with your desired orange color
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
      backgroundColor: 'white',
      borderRadius: 30,
      paddingVertical: 12,
      marginBottom: 16,
      alignSelf: 'center',
      width: '85%',
    },
    nextButtonText: {
      color: 'black',
      fontSize: 18,
      textAlign: 'center',
    },
  });
  

  export default FirstNameScreen;