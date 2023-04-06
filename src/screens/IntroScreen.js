import { ImageBackground, StyleSheet, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import React from 'react';

const IntroScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/intro.png')}
        resizeMode="contain"
        style={styles.image}
      >
        {/* Add any additional content here, if needed */}
      </ImageBackground>
      <CustomButton buttonStyles={{backgroundColor:"#fa7024",width:"80%",alignSelf:"center",borderWidth:0}}
                    buttonText={"Get Started!"}
                    OnPress={() => {navigation.navigate("Tabs")}}
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
