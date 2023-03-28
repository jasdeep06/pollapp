import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
          <Text style={[styles.leftText,props.styleLeft]}>{props.leftText}</Text>
        </View>
        <Text style={[styles.rightText,props.styleRight]}>{props.rightText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 10,
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
    height: 30,
    width: 30,
    alignSelf: 'center',
  },
  leftText: {
    alignSelf: 'center',
    marginLeft: 10,
    fontSize: 15,
  },
  rightText: {
    alignSelf: 'center',
  },
});

export default ElevatedBoxWithIcon;
