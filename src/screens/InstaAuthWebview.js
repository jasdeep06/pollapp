import { Button, View } from 'react-native';
import React, { useState } from 'react';

import { Text } from 'react-native';
import WebView from 'react-native-webview';

const getSearchParamFromURL = (url, param) => {
    const include = url.includes(param)
  
    if (!include) return null
  
    const params = url.split(/([&,?,=])/)
    const index = params.indexOf(param)
    const value = params[index + 2]
    return value
  }

const InstaAuthWebview = () => {
  const [accessCode, setAccessCode] = useState(null);
  const [showWebView, setShowWebView] = useState(false);

  const handleWebViewNavigationStateChange = (event) => {
    console.log(event)
    if (event.url.startsWith('razz://auth')) {
    //   const queryParams = new URLSearchParams(event.url.split('?')[1]);
    //   const code = queryParams.get('code');
      const code = getSearchParamFromURL(event.url, 'code')
      console.log("code", code)
      setAccessCode(code);
      setShowWebView(false);
    }
  };

  const handleGetUsername = () => {
    setShowWebView(true);
  };

  if (accessCode) {
    // You can now use the access code to get an access token and fetch the user's Instagram username
    return <View > 

        <Text>{accessCode}</Text>
    </View>;
  }

  if (showWebView) {
    return (
      <WebView
        source={{
          uri: `https://api.instagram.com/oauth/authorize?client_id=185723744388689&redirect_uri=https://api.razzapp.com/redirect&scope=user_profile&response_type=code`,
        }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
    );
  }

  return (
    <View>
      <Button onPress={handleGetUsername} title="Get username" />
    </View>
  );
};

export default InstaAuthWebview;
