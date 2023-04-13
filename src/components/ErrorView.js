// ErrorScreen.js

import { Image, RefreshControl, ScrollView, Text } from 'react-native';

import { Dimensions } from 'react-native';
import React from 'react';

const ErrorView = ({ onRetry }) => {
    const screenWidth = Dimensions.get('window').width;
    const errorWidth = screenWidth * 0.8;
    const errorHeight = errorWidth
return(
  <ScrollView
    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
    refreshControl={<RefreshControl refreshing={false} onRefresh={onRetry} />}
  >
    {/* <Text style={{ fontSize: 20, marginBottom: 20 }}>An error occurred. Please try again.</Text> */}
    <Image source={require('../../assets/images/error.png')} style={{width:errorWidth,height:errorHeight,opacity:0.7}} />
  </ScrollView>
)
};

export default ErrorView;
