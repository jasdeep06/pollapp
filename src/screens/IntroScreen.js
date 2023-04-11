import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import React,{useEffect} from 'react';

import CustomButton from '../components/CustomButton';

const IntroScreen = ({navigation}) => {


  useFocusEffect(
    React.useCallback(() => {
      console.log('Current navigation state: from intro screen', JSON.stringify(navigation.getState(), null, 2));
      return () => {
        // Cleanup or unsubscribe if needed
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ImageBackground
        source={require('../../assets/images/intro.png')}
        resizeMode="contain"
        style={styles.image}
      >
        {/* Add any additional content here, if needed */}
      </ImageBackground>
      <CustomButton buttonStyles={{backgroundColor:"#fa7024",width:"80%",alignSelf:"center",borderWidth:0}}
                    buttonText={"Get Started!"}
                    // onPress={() => {navigation.navigate("Tabs")}}
                    onPress={() => {
                      navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [
                          { name: 'Tabs' },
                        ],
                      }))
                    }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#ffffff"
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default IntroScreen;
