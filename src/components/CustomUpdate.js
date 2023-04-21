import { ActivityIndicator, Image, Linking, StyleSheet, Text, View } from 'react-native';

import CustomButton from './CustomButton';
import CustomText from './CustomText';

const CustomUpdate = ({force}) => {
    return(
        <View style={styles.splashContainer}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/splash_logo.png')} // Replace with your logo file
        />
        <View style={styles.updateContainer}>
          <CustomText style={styles.updateTitle}>App update available</CustomText>
          <CustomText style={styles.updateText}>
            {force ?  "Update Razz to continue using!":"Updating the app to the latest version..."}
          </CustomText>
          {!force ? <ActivityIndicator size="large" color="#fa7024" />:
          <CustomButton
            buttonText="Update Razz"
            buttonStyles={{
                borderWidth:0,
                backgroundColor: '#fa7024',
            }}
            textStyles={{color: "white"}}
            onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=com.jas1994.pollapp")}

          />
          
          }
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    splashContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'black', // Replace with your desired background color
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    updateContainer: {
      marginTop: 20,
      paddingHorizontal: 40,
      alignItems: 'center',
    },
    updateTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color:"white"
    },
    updateText: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
      color:"white"
    },
  });

  export default CustomUpdate;