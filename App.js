import * as SplashScreen from "expo-splash-screen";

import { Image, StyleSheet, Text, View } from 'react-native';

import AddFriendsDetailScreen from './src/screens/AddFriendsDetailScreen';
import AddFriendsScreen from './src/screens/AddFriendsScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./src/context/AuthContext";
import { AuthProvider } from './src/context/AuthContext';
import AuthResolverScreen from "./src/screens/AuthResolverScreen";
import { AxiosProvider } from './src/context/AxiosContext';
import BannerScreen from './src/screens/BannerScreen';
import FirstNameScreen from './src/screens/FirstNameScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import GenderScreen from './src/screens/GenderScreen';
import GradeSelectionScreen from './src/screens/GradeSelectionScreen';
import IntroScreen from "./src/screens/IntroScreen";
import LastNameScreen from './src/screens/LastNameScreen';
import LikeViewScreen from './src/screens/LikeViewScreen';
import LikesScreen from './src/screens/LikesScreen';
import MobileNumberInputScreen from './src/screens/MobileNumberInputScreen';
import MyAccountScreen from './src/screens/MyAccountScreen';
import { NavigationContainer } from "@react-navigation/native";
import OTPVerificationScreen from './src/screens/OtpVerificationScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import PermissionsScreen from './src/screens/PermissionScreen';
import PhotoScreen from './src/screens/PhotoScreen';
import PollScreen from './src/screens/PollScreen';
import PricingScreen from './src/screens/PricingScreen';
import ProfileScreen from './src/screens/ProfieScreen';
import SchoolSelectionScreen from './src/screens/SchoolSelectionScreen';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './src/context/UserContext';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();





const TabNavigator = () => {
  return (
    <Tab.Navigator tabBarPosition='bottom' screenOptions={{swipeEnabled:false}}>
      <Tab.Screen
        name="Polls"
        component={PollScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused, color }) => {
            return (
              <Image
                source={focused ? require("./assets/images/polls_selected.png") : require("./assets/images/polls_unselected.png")}
                // style={
                //   focused
                //     ? { opacity: 1, height: 25, width: 25, }
                //     : { opacity: 0.4, height: 25, width: 25 }
                // }
                style={{
                  height:35,
                  width:35,
                  alignSelf:"center"
                }}
              />
            );
          },
          tabBarIconStyle:{
            margin:5
            
          }
          // tabBarContentContainerStyle:{backgroundColor:"red"}
        }}
      />
      
      <Tab.Screen
        name="Likes"
        component={LikesScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused, color }) => {
            return (
              <Image
              source={focused ? require("./assets/images/likes_selected.png") : require("./assets/images/likes_unselected.png")}
              // style={
              //     focused
              //       ? { opacity: 1, height: 25, width: 25 }
              //       : { opacity: 0.4, height: 25, width: 25 }
              //   }
              style={{
                height:35,
                width:35,
                alignSelf:"center"
              }}
              />
            );
          },
          tabBarIconStyle:{
            margin:5
            
          }
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused, color }) => {
            return (
              <Image
              source={focused ? require("./assets/images/profile_selected.png") : require("./assets/images/profile_unselected.png")}
                // style={
                //   focused
                //     ? { opacity: 1, height: 25, width: 25 }
                //     : { opacity: 0.4, height: 25, width: 25 }
                // }
                style={{
                  height:35,
                  width:35,
                  alignSelf:"center"

                }}
              />
            );
          },
          tabBarIconStyle:{
            margin:5
            
          }

        }}
        
        
      />
      <Tab.Screen
        name="Add"
        component={AddFriendsScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused, color }) => {
            return (
              <Image
              source={focused ? require("./assets/images/add_selected.png") : require("./assets/images/add_unselected.png")}
                // style={
                //   focused
                //     ? { opacity: 1, height: 25, width: 25 }
                //     : { opacity: 0.4, height: 25, width: 25 }
                // }
                style={{
                  height:35,
                  width:35,
                  alignSelf:"center",

                }}
              />
            );
          },
          tabBarIconStyle:{
            margin:5
            
          }
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {




  return (
    
    <NavigationContainer>
      <AuthProvider>
          <AxiosProvider>
      <UserProvider>
      <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen name = "Auth" component = {AuthResolverScreen} options={{headerShown:false}} />
        <Stack.Screen name = "BannerScreen" component = {BannerScreen} options={{headerShown:false}} />
        <Stack.Screen name = "Permissions" component = {PermissionsScreen} options={{headerShown:true,headerTitle:"Please allow access",headerTitleStyle:{'fontSize':15},headerTitleAlign:'center',headerStyle:{'backgroundColor':'#FF8C00'}}} />
        <Stack.Screen name = "GradeSelectionScreen" component = {GradeSelectionScreen} options={{headerShown:true,headerTitle:"What grade are you in?",headerTitleStyle:{'fontSize':15,color:"white"},headerTitleAlign:'center',headerStyle:{'backgroundColor':'#FF8C00'}}} />
        <Stack.Screen name = "SchoolSelectionScreen" component = {SchoolSelectionScreen} options={{headerShown:true,headerTitle:"Pick your school",headerTitleStyle:{'fontSize':15,color:"white"},headerTitleAlign:'center',headerStyle:{'backgroundColor':'#FF8C00'}}} />
        <Stack.Screen name = "FirstNameScreen" component = {FirstNameScreen} options={{headerShown:true,headerTitle:"",headerStyle:{'backgroundColor':'#FF8C00'}}} />
        <Stack.Screen name = "LastNameScreen" component = {LastNameScreen} options={{headerShown:true,headerTitle:"",headerStyle:{'backgroundColor':'#FF8C00'}}} />
        <Stack.Screen name = "GenderScreen" component = {GenderScreen} options={{headerShown:true,headerTitle:"",headerStyle:{'backgroundColor':'#FF8C00'}}} />
        <Stack.Screen name = "PhotoScreen" component = {PhotoScreen} options={{headerShown:true,headerTitle:"",headerStyle:{'backgroundColor':'#FF8C00'}}} />
        <Stack.Screen name = "MobileNumberInputScreen" component = {MobileNumberInputScreen} options={{headerShown:true,headerTitle:"",headerStyle:{'backgroundColor':'#FF8C00'}}} />
        <Stack.Screen name = "OtpVerificationScreen" component = {OtpVerificationScreen} options={{headerShown:true,headerTitle:"",headerStyle:{'backgroundColor':'#FF8C00'}}} />
        <Stack.Screen name = "Tabs" component={TabNavigator} options={{headerShown:false}} />
        <Stack.Screen name = "LikeViewScreen" component={LikeViewScreen} options={{headerShown:true,headerTitle:"",headerStyle:{'backgroundColor':'#4A90E2'}}}/>
        <Stack.Screen name="FriendsScreen" component={FriendsScreen} options={{headerShown:true,headerTitle:"",headerStyle:{'backgroundColor':'#4A90E2'}}}/>
        <Stack.Screen name="AddFriendsDetailScreen" component={AddFriendsDetailScreen} options={{headerShown:true,headerTitle:"",headerStyle:{'backgroundColor':'#8C92AC'}}}/>
        <Stack.Screen name="PricingScreen" component={PricingScreen} options={{headerShown:true,headerTitle:"",headerStyle:{'backgroundColor':'#8C92AC'}}}/>
        <Stack.Screen name="MyAccountScreen" component={MyAccountScreen} options={{headerShown:true,headerTitle:"",headerStyle:{'backgroundColor':'#8C92AC'}}}/>
        <Stack.Screen name="IntroScreen" component={IntroScreen} options={{headerShown:false}}/>

      </Stack.Navigator>
      </UserProvider>
      </AxiosProvider>
      </AuthProvider>
    </NavigationContainer>
    
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
