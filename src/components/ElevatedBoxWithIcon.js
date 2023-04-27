import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CustomText from './CustomText';
import { Entypo } from '@expo/vector-icons';
import React from 'react';

const ElevatedBoxWithIcon = (props) => {
  console.log(typeof(props.icon))
  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      <View style={styles.content}>
        <View style={styles.leftContent}>
          { typeof(props.icon) == 'number' ?
          
          <Image
            source={props.icon}
            style={styles.icon}
          />:
          <Image
            source={{uri:props.icon}}
            style={styles.icon}
          />
          
          }
          <View style={styles.leftTextGroup}>
          <View style={{flexDirection:"row"}}>
          <CustomText style={[styles.leftText,props.styleLeft]}>{props.leftText}</CustomText>
          {props.showDot && <Entypo name="dot-single" size={24} color="#2f47ff" style={{marginBottom:0}}/>}
          </View>
          {props.leftSubText && <CustomText style={[styles.leftSubText,props.styleLeftSub]}>{props.leftSubText}</CustomText>}
          </View>
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
    // justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    flex:1,

  },
  icon: {
    height: 40,
    width: 40,
    alignSelf: 'center',
    borderRadius: 20,
  },
  leftText: {
    marginLeft: 10,
    fontSize: 16,
    flex:1
  },
  leftTextGroup:{
    flexDirection:"column",
    alignSelf:"center",
    flex:1,
    },
  rightText: {
    alignSelf: 'center',
    color:"#b6b6b6"
  },
  leftSubText:{
    marginLeft: 10,
    color:"#6c6c6c"
  }
});

export default ElevatedBoxWithIcon;
