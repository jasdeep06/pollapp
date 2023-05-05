import { ActivityIndicator, Alert, Button, Dimensions, Image, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';

import { AxiosContext } from '../context/AxiosContext';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import { UserContext } from '../context/UserContext';
import instaImage from '../../assets/images/insta_connect_button.png'

const getSearchParamFromURL = (url, param) => {
    const include = url.includes(param)

  
    if (!include) return null
  
    const params = url.split(/([&,?,=])/)
    const index = params.indexOf(param)
    const value = params[index + 2]
    return value
  }

//   const fetchInstagramUsername = async (accessToken) => {
//     const response = await fetch(`https://graph.instagram.com/me?fields=username&access_token=${accessToken}`);
//     console.log(response)
//     const json = await response.json();
//     return json.username;
//   };

  


const InstagramAuthExternal = ({navigation}) => {
    const [accessCode, setAccessCode] = useState(null);
    const {authAxios} = useContext(AxiosContext);
    const {user,updateUser} = React.useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const screenWidth = Dimensions.get('window').width;

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "#fa7024",
          },
          headerTitle: "Know who already liked you!",
        });
      }, [navigation]);


    const fetchInstagramUsername = async (accessCode) => {
        try{
        setLoading(true)
        const response = await authAxios.post("/insta_username", {access_code: accessCode});
        console.log(response)
        if(response.data.status === 0){
            // setUserName(response.data.username);
            updateUser({insta_username: response.data.username})
            setLoading(false)
        }
    }catch(e){
        console.log(e)
    }
    }
  
    useEffect(() => {
      const handleOpenURL = (event) => {
        console.log(event)
        if (event.url.startsWith('razz://auth')) {
        //   const queryParams = new URLSearchParams(event.url.split('?')[1]);
        //   const code = queryParams.get('code');
            const code = getSearchParamFromURL(event.url, 'code')
          setAccessCode(code);
        }
      };
  
      Linking.addEventListener('url', handleOpenURL);
      return () => {
        Linking.removeEventListener('url', handleOpenURL);
      };
    }, []);

    useEffect(() => {
        if (accessCode) {
            fetchInstagramUsername(accessCode)
        }
    }, [accessCode]);


    const handleNext = () => {
        navigation.navigate("MobileNumberInputScreen")
    }
  
    const handleSkip = () => {
        Alert.alert(
            "Slow Down!",
            "If you skip this step, you will lose all your existing likes!",
            [
              {
                text: "Skip",
                onPress: () => navigation.navigate("MobileNumberInputScreen"),
              },
              { text: "Cancel" },
            ]
          );
    }

    const handleGetUsername = () => {
      const authURL = `https://api.instagram.com/oauth/authorize?client_id=929030505003282&redirect_uri=https://api.razzapp.com/redirect&scope=user_profile&response_type=code`;
      Linking.openURL(authURL);
    };
  
  
    return (
        <SafeAreaView style={styles.container}>
        {/* <CustomText style={{textAlign:"center",color:"white",fontSize:22}}>Know who likes you already!</CustomText> */}

       
        <View style={styles.content}>
          <TouchableOpacity onPress={handleGetUsername} disabled={loading}>
          <Image source={instaImage} style={{width:screenWidth*0.8,height:screenWidth*0.8/3.36,alignSelf:"center"}} />
          </TouchableOpacity>
          {(!user.insta_username && !loading) &&<CustomText style={{textAlign:"center",fontSize:18,color:"white"}}>We only access your instagram username and nothing else.Promise!</CustomText>}
          {user.insta_username && <CustomText style={{textAlign:"center",fontSize:22,color:"white"}}>{user.insta_username}</CustomText>}
          {loading && <ActivityIndicator size="small" color="#ffffff" />}
        </View>
        <CustomButton 
        buttonStyles={user.insta_username ? styles.nextButton:[styles.nextButton,styles.disabledButton]}
        onPress = {handleNext}
        buttonText={"Next"}
        textStyles={styles.nextButtonText}
        disabled={!user.insta_username}
        />
        {!user.insta_username && <TouchableOpacity onPress={handleSkip}>
            <CustomText style={{color:"white",fontSize:18,fontWeight:"bold",textAlign:"center",marginBottom:10}}>Skip</CustomText>
          </TouchableOpacity>}
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fa7024', // Replace with your desired orange color
      paddingHorizontal: 24,
    },
    content: {
      flex: 1,
      flexDirection:"column",
      justifyContent:"center"

    },
    question: {
      color: 'white',
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 16,
    },
    nextButton: {
        backgroundColor: '#ffffff',
        borderRadius: 30,
        paddingVertical: 12,
        marginBottom: 16,
        alignSelf: 'center',
        width: '85%',
        borderWidth:0
      },
      nextButtonText: {
        color: '#fa7024',
        fontSize: 18,
        textAlign: 'center',
      },
      disabledButton: {
        backgroundColor: '#fdbf9c'
      }
  });
  

  export default InstagramAuthExternal;
  