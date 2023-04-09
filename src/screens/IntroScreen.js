import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import React,{useEffect} from 'react';

import CustomButton from '../components/CustomButton';
import { useFocusEffect } from '@react-navigation/native';

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
                    onPress={() => {navigation.navigate("Tabs")}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default IntroScreen;
