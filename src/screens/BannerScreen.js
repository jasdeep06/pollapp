import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState } from 'react';

import { Picker } from '@react-native-picker/picker';
import  {UserContext}  from '../context/UserContext';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const BannerScreen = ({navigation}) => {
  // const [age, setAge] = useState(13);
  const {user,updateUser} = useContext(UserContext);

  const generateAgeOptions = () => {
    let options = [];
    for (let i = 13; i <= 18; i++) {
      options.push(<Picker.Item key={i} label={i.toString()} value={i} />);
    }
    return options;
  };

  return (
    <SafeAreaView style={styles.container}>
         <StatusBar backgroundColor="black" barStyle="light-content" />
       <TouchableOpacity style={styles.loginWrapper} onPress={() => console.log('Log In')}>
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>
      <Image
        style={styles.appLogo}
        source={{ uri: 'https://ving-assets.s3.ap-south-1.amazonaws.com/app_images/fire-fireball.gif' }}
      />
      <Text style={styles.selectAgeText}>Select your age</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={user.age}
          onValueChange={(itemValue) => updateUser({'age':itemValue})}
          style={styles.picker}
        >
          {generateAgeOptions()}
        </Picker>
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Permissions")}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: getStatusBarHeight(), // Add padding equal to the status bar height + 20
      },
  appLogo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  selectAgeText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    marginBottom: 20,
    width: '80%',
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'white',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: '80%',
  },
  button: {
    backgroundColor: '#FF8C00',
    paddingVertical: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginWrapper: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BannerScreen;
