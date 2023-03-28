import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { UserContext } from '../context/UserContext';

const LastNameScreen = ({navigation}) => {
  const {user,updateUser} = React.useContext(UserContext);

  const handleNext = () => {
    navigation.navigate("GenderScreen")
  };
  const handleLastName = (text) => {
    updateUser({lastname:text})
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.question}>What's your last name?</Text>
        <TextInput
          style={styles.input}
          value={user.lastname}
          onChangeText={handleLastName}
          placeholder="Last Name"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          fontSize={20}
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
    backgroundColor: '#FF8C00',
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

export default LastNameScreen;
