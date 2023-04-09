import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React,{useLayoutEffect} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { AxiosContext } from '../context/AxiosContext';
import { CommonActions } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import deleteImage from "../../assets/images/dustbin.png"
import signOutImage from "../../assets/images/sign_out.png"
import { useNavigation } from '@react-navigation/native';

function getShortenedSchoolName(schoolName) {
  // Split the school name into words
  const words = schoolName.split(' ');

  // Get the first two words
  const firstTwoWords = words.slice(0, 2).join(' ');

  // Get the first 15 characters
  const firstFifteenChars = schoolName.substring(0, 15);

  // Choose the longer option
  const result = firstTwoWords.length > firstFifteenChars.length ? firstTwoWords : firstFifteenChars;

  // Append "..." to the result and return it
  return result + '...';
}


const MyAccountScreen = ({ navigation }) => {
//   const profileData = {
//     photo: 'https://www.w3schools.com/howto/img_avatar.png',
//     firstname: 'John',
//     lastname: 'Doe',
//     school: 'Sample School',
//     grade: '12th Grade',
//     mobile: '911234567890',
//     gender:"boy"
//   };

useLayoutEffect(() => {
  navigation.setOptions({
    headerTintColor: "black",
    headerStyle: {
      backgroundColor: "#e9e9e9",
    },
  });
}, [navigation]);






  const [profileData, setProfileData] = React.useState(null);
  const [isLoadingProfileData, setIsLoadingProfileData] = React.useState(true);
  const { authAxios } = React.useContext(AxiosContext);
  const { updateAuthToken } = React.useContext(AuthContext);

    const getProfile = async () => {
    setIsLoadingProfileData(true);
    const response = await authAxios.get("/get_profile")
    if (response.data.status == 0) {
        setProfileData(response.data.data);
        setIsLoadingProfileData(false);
    }
  }

    React.useEffect(() => {
    getProfile();
    }, []);

  const signOut = async () => {
    try {
      console.log('Signing out...')
      await AsyncStorage.removeItem('authToken');
      updateAuthToken(null);
      navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
            { name: 'MobileNumberInputScreen',params:{isLogin:true} }
        ]
    }))
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
       {profileData == null || isLoadingProfileData ? <Loader />: <>
      <Image style={styles.image} source={{ uri: profileData.photo }} />
      <View style={styles.infoContainer}>
        {[
          { key: 'Name', value: profileData.firstname + ' ' + profileData.lastname },
          { key: 'School', value: getShortenedSchoolName(profileData.school) },
          { key: 'Grade', value: profileData.grade },
          { key: 'Mobile', value: profileData.mobile },
          { key: 'Gender', value: profileData.gender },
        ].map((item, index) => (
          <React.Fragment key={index}>
            <View style={styles.infoItem}>
              <Text style={styles.keyText}>{item.key}:</Text>
              <Text style={styles.valueText}>{item.value}</Text>
            </View>
            {index !== 4 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>


      <View style={styles.buttonContainer}>
        <CustomButton
          buttonText={'Sign Out'}
          buttonStyles={styles.customButtonStyle}
          // icon={<AntDesign name="logout" size={24} color="white" style={styles.icon} />}
          icon={<Image source={signOutImage} style={{width:24,height:24,marginRight:5}}/>}
          // Add your sign out logic onPress
          onPress={signOut}
        />
        <CustomButton
          buttonText={'Delete Account'}
          buttonStyles={styles.customButtonStyle}
          icon={<Image source={deleteImage} style={{width:24,height:24,marginRight:5}}/>}
          // Add your delete account logic onPress
          onPress={() => {}}
        />
      </View>
      </>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9e9e9',
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    alignSelf: 'center',
    // borderColor:"blue",
    // borderWidth:3
  },
  detailsText: {
    fontSize: 18,
    color: '#8C92AC',
    marginLeft: 20,
    marginVertical: 5,
  },
  buttonContainer: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonStyle: {
    width: '70%',
    alignSelf: 'center',
    marginVertical: 10,
    backgroundColor:"#fa7024",
    borderWidth:0
  },
  icon: {
    marginRight: 10,
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    margin: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    // justifyContent:"center"
  },
  keyText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#6b6b6b',
    opacity: 0.7,
    marginRight: 20,
  },
  valueText: {
    fontSize: 18,
    color: '#9c9c9c',
    textAlign:"center"
  },
  divider: {
    borderBottomColor: '#8C92AC',
    borderBottomWidth: 1,
    opacity: 0.3,
    marginBottom: 15,
  },

});

export default MyAccountScreen;
