import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import React,{useEffect, useLayoutEffect} from 'react';

import ActionModal from '../components/ActionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { AxiosContext } from '../context/AxiosContext';
import { CommonActions } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import ErrorView from '../components/ErrorView';
import Loader from '../components/Loader';
import { MetaContext } from '../context/MetaContext';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native';
import { UserContext } from '../context/UserContext';
import contactsImage from "../../assets/images/contacts.png";
import deleteImage from "../../assets/images/dustbin.png"
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import mapImage from "../../assets/images/map.png";
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
    headerBackTitle:null
  });
}, [navigation]);







  const [profileData, setProfileData] = React.useState(null);
  const [isLoadingProfileData, setIsLoadingProfileData] = React.useState(true);
  const { authAxios } = React.useContext(AxiosContext);
  // const { updateAuthToken,authToken } = React.useContext(AuthContext);
  const {updateAuthState,authState} = React.useContext(AuthContext)
  const {userId,updateUserId,updateUser} = React.useContext(UserContext)
  const [error,setError] = React.useState(false)
  const {updateMetadata} = React.useContext(MetaContext)
  const [isModalVisible,setIsModalVisible] = React.useState(false)
  const [deleteLoading,setDeleteLoading] = React.useState(false)
  const [deleteError,setDeleteError] = React.useState(false)

    const toggleModal = () => {
      setDeleteError(false)
      setIsModalVisible(!isModalVisible);
    }
   

    const getProfile = async () => {
    try{
    setError(false)
    setIsLoadingProfileData(true);
    const response = await authAxios.get("/get_profile")
    if (response.data.status == 0) {
        setProfileData(response.data.data);
        setIsLoadingProfileData(false);
    }else{
      setError(true)
      console.log(response.data)
    }
  }catch(error){
    setError(true)
    console.log(error)
  }
  }

  const deleteAccount = async () => {
    try{
    setDeleteError(false)
    setDeleteLoading(true);
    const response = await authAxios.get("/delete_account")
    if (response.data.status == 0) {
        signOut()
    }else{
      setDeleteError(true)
      setDeleteLoading(false)
      console.log(response.data)
    }
  }catch(error){
    setDeleteError(true)
    setDeleteLoading(false)
    console.log(error)
  }
}

    React.useEffect(() => {
    getProfile();
    }, []);

    React.useEffect(() => {
      console.log("in useEffect")
      if(authState.token == null && userId == null){
        console.log("both null")
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
                // { name: 'MobileNumberInputScreen',params:{isLogin:true} }
                {name:'BannerScreen'}
            ]
        }))
      }
    }, [authState.token,userId]);
    

  const signOut = async () => {
    try {
      console.log('Signing out...')
      await AsyncStorage.removeItem('authToken');
      // updateAuthToken(null);
      updateAuthState({token:null})

      await AsyncStorage.removeItem('userId');
      updateUserId(null)

      updateUser({
        "age":14,
        "location":null,
        "contacts":null,
        "firstname":"",
        "lastname":"",
        "grade":null,
        "school_id":null,
        "gender":null,
        "phone":null,
        "photo":null
      })

      updateMetadata({
        unread_likes: 0,
        friend_requests: 0
      })

    //   navigation.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [
    //         { name: 'MobileNumberInputScreen',params:{isLogin:true} }
    //     ]
    // }))
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  if(error){
    return <ErrorView onRetry={getProfile}/>
  }

  return (
    <SafeAreaView style={styles.container}>
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
              <CustomText style={styles.keyText}>{item.key}:</CustomText>
              <CustomText style={styles.valueText}>{item.value}</CustomText>
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
          // onPress={() => Linking.openURL(`mailto:contact@vinglabs.com?subject=Please%20delete%20my%20account&body=${profileData.mobile}`)}
          onPress = {Platform.OS == 'ios' ?  toggleModal : () => Linking.openURL(`mailto:contact@vinglabs.com?subject=Please%20delete%20my%20account&body=${profileData.mobile}`)}
        />
      </View>
      <TouchableOpacity onPress={() => Linking.openURL(`mailto:contact@vinglabs.com?subject=${profileData.mobile}%20needs%20help.`)}>
      <CustomText style={{textAlign:"center",fontSize:18}}>{"For any queries drop us an email by clicking here!"}</CustomText>
      </TouchableOpacity>
      {Platform.OS == 'ios' && <ActionModal
        isVisible={isModalVisible}
        backdropOpacity={0.7}
        modalStyle={{ backgroundColor: "white" }}
        toggleModal={toggleModal}
      >
        <View style={styles.permissionContainer}>
           <CustomText style={{textAlign:"center",fontSize:18}}>Deleting your account is an irreversible process.Your likes can still be seen by users to maintain normal operations of the app.It may take upto 30 days for us to delete all of your data from our servers.During this time you won't be able to sign up again from this number.</CustomText>
          <CustomText style={{textAlign:"center",fontSize:18,marginTop:15}}>Are you sure you want to continue?</CustomText>
          <CustomButton 
          buttonText={deleteLoading ?  <ActivityIndicator size="small" color="white"/> : "Delete My Account"} 
          buttonStyles={{backgroundColor:"#fa7024",width:"80%",marginTop:30}}
          onPress={deleteAccount}
          disabled = {deleteLoading}/>
          {deleteError && <CustomText style={{textAlign:"center",fontSize:18,marginTop:15,color:"red"}}>{"Something went wrong.Please try again later."}</CustomText>}
        </View>
      </ActionModal>}
      </>}
    </SafeAreaView>
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
  permissionContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 19,
    marginBottom: 20,
    textAlign:"center"
  },
  permissionRow: {
    alignItems: "center",
    marginVertical: 10,
  },
  permissionText: {
    marginLeft: 10,
    fontSize: 20,
  },
});

export default MyAccountScreen;
