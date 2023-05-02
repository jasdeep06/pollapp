import {
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";

import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import { Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Platform } from "react-native";
import { UserContext } from "../context/UserContext";
import firegif from "../../assets/images/fire-faster.gif";
import razzImage from "../../assets/images/razz.png";
import sadhanaLogo from "../../assets/images/saadhna_infinity_edition.png"

const BannerScreen = ({ navigation }) => {
  // const [age, setAge] = useState(13);
  const { user, updateUser } = useContext(UserContext);

  const generateAgeOptions = () => {
    let options = [];
    for (let i = 14; i <= 18; i++) {
      options.push(<Picker.Item key={i} label={i.toString()} value={i} />);
    }
    return options;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e1e1e" barStyle="light-content" />
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.loginWrapper}
          onPress={() =>
            navigation.navigate("MobileNumberInputScreen", { isLogin: true })
          }
        >
          <CustomText style={styles.loginText}>Log In</CustomText>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }} />
      {/* <Image source={sadhanaLogo} style={{width: 150, height: 150, alignSelf: "center", marginTop: 20}} /> */}
      <View
        style={{
          flex: 6,
          justifyContent: "space-between",
          alignItems: "center",
          // height:Dimensions.get("window").height*0.8
        }}
      >
        <View style={{ alignItems: "center" }}>
          {/* <Image style={styles.appLogo} source={firegif} /> */}
          <Image source={firegif} style={{height:Dimensions.get('screen').height * 0.15,width:Dimensions.get('screen').height * 0.15 /1.28}}/>
          {/* <Image source={razzImage} style={styles.appImage} /> */}
          <Image source={razzImage} style={{height:Dimensions.get('screen').height * (0.15*0.5),width:Dimensions.get('screen').height * (0.15*0.5) * 2.85 }} />
        </View>
        <View style={{ justifyContent: "center" }}>
          <CustomText
            style={{ color: "white", textAlign: "center", marginHorizontal: 30,color:"#bababa" }}
          >
            By entering your age,you agree to our Terms and Privacy Policy
          </CustomText>
        </View>
        <View style={{ width: "100%", alignItems: "center",marginTop:20 }}>
          <CustomText style={styles.selectAgeText}>Enter your age</CustomText>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={user.age}
              onValueChange={(itemValue) => updateUser({ age: itemValue })}
              style={styles.picker}
              itemStyle={{backgroundColor:"#1e1e1e",color:"white"}}
            >
              {generateAgeOptions()}
            </Picker>
          </View>
          <TouchableOpacity onPress={() =>
            navigation.navigate("MobileNumberInputScreen", { isLogin: true })
          }>
          <CustomText style={{color:"white"}}>Already have an account?
              <CustomText style={{color:"#fa7024",fontWeight:"bold"}} > Log In</CustomText>
          </CustomText>
          </TouchableOpacity>
        </View>
        <CustomButton
          buttonText={"Get Started"}
          buttonStyles={{ width: "80%",backgroundColor:"#fa7024",borderWidth:0 }}
          onPress={() => navigation.navigate("Permissions")}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  appLogo: {
    width:120,
    height:154
  },
  appImage: {
    width: 200,
    height: 70,
  },
  selectAgeText: {
    fontSize: 18,
    color: "#ff7528",
    marginBottom: 20,
  },
  pickerWrapper: {
    ...Platform.select({
      ios:{
        borderWidth: 0,
      },
      android:{
        borderWidth: 1,
        borderColor: "white",
    borderRadius: 5
      }
    }),
    
    marginBottom: 10,
    width: "80%",
    backgroundColor:"#1e1e1e"
  },
  picker: {
    // height: 200,
    // width: "100%",
    color: "white",
  },
  loginText: {
    ...Platform.select({
      ios:{
        color: "#fa7024",
        fontSize: 22,
        fontWeight:"bold",
        marginRight:10
      },
      android:{
        color: "#fa7024",
        fontSize: 16,
        fontWeight:"bold",
        marginRight:10
      }
    })
    
  },
});

export default BannerScreen;
