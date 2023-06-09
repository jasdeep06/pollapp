import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CustomText from './CustomText';
import React from 'react';

const ElevatedBoxWithIcon = (props) => {
  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <Image
            source={props.icon}
            style={styles.icon}
          />
          <CustomText style={[styles.leftText,props.styleLeft]}>{props.leftText}</CustomText>
        </View>
        <CustomText style={[styles.rightText,props.styleRight]}>{props.rightText}</CustomText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    margin: 10,
    padding: 15,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
  },
  icon: {
    height: 40,
    width: 40,
    alignSelf: 'center',
  },
  leftText: {
    alignSelf: 'center',
    marginLeft: 10,
    fontSize: 16,
  },
  rightText: {
    alignSelf: 'center',
  },
});

export default ElevatedBoxWithIcon;
