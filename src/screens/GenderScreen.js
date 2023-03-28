import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';

const GenderScreen = ({navigation}) => {
  const {user,updateUser} = React.useContext(UserContext);

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
        <Text style={styles.question}>What's your gender?</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            style={[
              styles.iconContainer,
              isSelected('boy') ? styles.selectedIcon : styles.unselectedIcon,
            ]}
            onPress={() => handleGenderSelect('boy')}
          >
            <MaterialCommunityIcons name="face-man-shimmer" size={60} color="white" />
            <Text style={styles.iconLabel}>Boy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconContainer,
              isSelected('girl') ? styles.selectedIcon : styles.unselectedIcon,
            ]}
            onPress={() => handleGenderSelect('girl')}
          >
            <MaterialCommunityIcons name="face-woman-shimmer" size={60} color="white" />
            <Text style={styles.iconLabel}>Girl</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  unselectedIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconLabel: {
    color: 'white',
    fontSize: 18,
    marginTop: 8,
  },
});

export default GenderScreen;
