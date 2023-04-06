import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import boyImage from "../../assets/images/boy.png"
import girlImage from "../../assets/images/girl.png"

const GenderScreen = ({navigation}) => {
  const {user,updateUser} = React.useContext(UserContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: "#fa7024",
      },
    });
  }, [navigation]);

  const handleGenderSelect = (gender) => {
    updateUser({'gender':gender})
    navigation.navigate('PhotoScreen')
  };

  const isSelected = (gender) => {
    return user.gender === gender;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={{flex:1}}/>
        <View style={{flex:2}}>
        <Text style={styles.question}>What's your gender?</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={[
              styles.iconContainer,
              isSelected('boy') ? styles.selectedIcon : styles.unselectedIcon,
            ]}
            onPress={() => handleGenderSelect('boy')}
          >
            {/* <MaterialCommunityIcons name="face-man-shimmer" size={60} color="white" /> */}
            <Image source={boyImage} style={{height:100,width:100}}/>
            <Text style={styles.iconLabel}>Boy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconContainer,
              isSelected('girl') ? styles.selectedIcon : styles.unselectedIcon,
            ]}
            onPress={() => handleGenderSelect('girl')}
          >
            {/* <MaterialCommunityIcons name="face-woman-shimmer" size={60} color="white" /> */}
            <Image source={girlImage} style={{height:100,width:100}}/>
            <Text style={styles.iconLabel}>Girl</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </View>
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
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  iconContainer: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 4,
  },
  selectedIcon: {
    backgroundColor: '#934215',
  },
  unselectedIcon: {
    backgroundColor: '#fc955c',
  },
  iconLabel: {
    color: 'white',
    fontSize: 18,
    marginTop: 8,
  },
});

export default GenderScreen;
