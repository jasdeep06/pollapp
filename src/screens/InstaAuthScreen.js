import * as WebBrowser from 'expo-web-browser';

import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ResponseType, makeRedirectUri, useAuthRequest } from 'expo-auth-session';

import CustomText from '../components/CustomText';

WebBrowser.maybeCompleteAuthSession()

const InstaAuthScreen = ({navigation}) => {

    const [username, setUsername] = useState(null);
  const clientId = '185723744388689';
//   const redirectUri = makeRedirectUri({scheme:"com.jas1994.pollapp"})
  const responseType = ResponseType.Code;
  console.log(responseType)
  const redirectUri = 'https://com.jas1994.pollapp/expo-development-client/?url=http%3A%2F%2F192.168.69.226%3A8081'

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri,
      responseType,
      scopes: ['user_profile'],
    },
    {
      authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
    }
  );


  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      fetchInstagramUsername(access_token);
    }
  }, [response]);

  const fetchInstagramUsername = async (accessToken) => {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me?fields=username&access_token=${accessToken}`
      );
      const data = await response.json();
      setUsername(data.username);
      console.log(data.username)
    } catch (error) {
      console.error('Error fetching Instagram username:', error);
    }
  };

    useLayoutEffect(() => {
      navigation.setOptions({
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "#fa7024",
        },
      });
    }, [navigation]);

  
    return (
      <SafeAreaView style={styles.container}>
       
        <View style={styles.content}>
          <CustomText style={styles.question}>Verify your Instagram username</CustomText>
          <TouchableOpacity onPress={() => {
          promptAsync();
        }}>
            <CustomText>Verify</CustomText>
          </TouchableOpacity>
        </View>
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
      justifyContent: 'center',
    },
    question: {
      color: 'white',
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 16,
    }
  });
  

  export default InstaAuthScreen;