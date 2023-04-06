import { Alert, Image, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { AxiosContext } from "../context/AxiosContext";
import CustomButton from "../components/CustomButton";
import Loader from "../components/Loader";
import PricingCard from "../components/PricingCard";
import Purchases from "react-native-purchases";
import { ScrollView } from "react-native-gesture-handler";
import heartImage from "../../assets/images/heart.png"
import lifetimeImage from "../../assets/images/lifetime.png"
import oneImage from "../../assets/images/1_card.png"
import threeImage from "../../assets/images/3_card.png"
import { useFocusEffect } from "@react-navigation/native";

function parsePurchases(purchases) {
    const imageDict = {"reveal-1":oneImage,"reveal-3":threeImage,"lifetime":lifetimeImage}
    const products = [];
  
    for (const key in purchases.all) {
      console.log(key)
      const product = purchases.all[key];
  
      const price = product.availablePackages[0]['product'].priceString;
      const description = product.serverDescription.split(",");
  
      const parsedProduct = {
        // imageSrc: product.serverDescription.split(",")[0],
        imageSrc:imageDict[key],
        price,
        description,
        pkg:purchases.all[key]['availablePackages'][0]
      };
  
      products.push(parsedProduct);
    }
  
    return products;
  }
  


const PricingScreen = ({route,navigation}) => {

  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [offerings,setOfferings] = useState(null)
  const [isLoading,setIsLoading] = useState(true)
  const [selectedPkg,setSelectedPkg] = useState(null)
  const [trasactionVerified,setTrasactionVerified] = useState(null)
  const [transactionTimeOut,setTransactionTimeOut] = useState(false)
  const [transactionLoading,setTransactionLoading] = useState(false)
  const { authAxios } = React.useContext(AxiosContext);
  const [preVerificationLoader,setPreVerificationLoader] = useState(false)
  const like_id = route.params && route.params.like_id;
  const gender = route.params && route.params.gender;
  const from = route.params && route.params.from;
  const user_id = route.params && route.params.user_id;

  const handleCardSelect = (index,pkg) => {
    console.log(index,pkg)
    setSelectedPkg(pkg)
    setSelectedCardIndex(index);
    setTransactionTimeOut(false)
  };

useEffect(() => {
    if(!transactionLoading && transactionTimeOut ){
    Alert.alert(
        'Verification Failed',
        'We are working to verify your payment.It should be verified soon.If not, the amount will be refunded shortly.',
        [{ text: 'OK', onPress: () => console.log('Pending payment alert closed') }],
        { cancelable: false }
      );
    }
},[transactionLoading])

useLayoutEffect(() => {
  navigation.setOptions({
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: "#1c1c1c",
    },
  });

}, [navigation]);

useFocusEffect(
  React.useCallback(() => {
    StatusBar.setBackgroundColor("#1c1c1c");
    StatusBar.setBarStyle("dark-content");
  }, [])
);




useEffect(() => {
    if(trasactionVerified && from == 'reveal'){
        navigation.navigate("LikeViewScreen",{like_id:like_id,gender:gender})
    }
},[trasactionVerified])

const checkTransactionVerification = async (purchaseDate, productId, retryCount = 0) => {
    setTransactionLoading(true)
    try {
      const response = await authAxios.post('http://65.0.2.61:8000/verify_transaction', {
        purchase_date: purchaseDate,
        product_id: productId,
      });
  
      if (response.data.status === 0) {
        setTrasactionVerified(true);
        setTransactionLoading(false)
        console.log("Transaction verified!")
      } else if (retryCount < 6) { // Retry a maximum of 6 times (6 * 10 seconds = 60 seconds)
        setTimeout(() => {
            console.log("Retrying...", retryCount)
          checkTransactionVerification(purchaseDate, productId, retryCount + 1);
        }, 10000); // Retry after 10 seconds
      } else {
        setTransactionTimeOut(true)
        setTransactionLoading(false)
        setSelectedCardIndex(null)
        console.log('Transaction verification timed out.');
        // Handle the timeout case here
      }
    } catch (error) {
      if (retryCount < 6) {
        setTimeout(() => {
          checkTransactionVerification(purchaseDate, productId, retryCount + 1);
        }, 10000);
      } else {
        console.log('Transaction verification timed out.');
        setTransactionTimeOut(true)
        setTransactionLoading(false)
        setSelectedCardIndex(null)
      }
    }
  };
  

  const handleNextPress = async () => {
    setPreVerificationLoader(true)
    try {
        const purchaseMade = await Purchases.purchasePackage(selectedPkg,{
            custom_metadata:{
                user_id:user_id
            }
        });
        const transactionObj = purchaseMade.customerInfo.nonSubscriptionTransactions.at(-1);
        const purchaseDate = transactionObj.purchaseDate;
        const productId = transactionObj.productId;
        setPreVerificationLoader(false)
        checkTransactionVerification(purchaseDate, productId);
      } catch (e) {
        if (!e.userCancelled) {
          setPreVerificationLoader(false)
          console.log(e);
      
          // Check for the pending payment error
          if (e.message && e.message.includes("The payment is pending")) {
            // Handle pending payment
            console.log("Payment is pending");
            Alert.alert(
              'Payment Pending',
              'Your payment is currently pending. We will notify you once the transaction is complete.',
              [{ text: 'OK', onPress: () => console.log('Pending payment alert closed') }],
              { cancelable: false }
            );
          } else if (e.message && e.message.includes("not allowed")) {
            // Handle card declined error
            console.log("Card declined");
            Alert.alert(
              'Card Declined',
              'Your card has been declined. Please try again with a different payment method or check your card details.',
              [{ text: 'OK', onPress: () => console.log('Card declined alert closed') }],
              { cancelable: false }
            );
          } else {
            // Handle other errors
            console.log("Other error occurred");
          }
        } else {
          setPreVerificationLoader(false)
          console.log("User cancelled!");
        }
      }
  }



  useEffect(() => {
    const get_offerings = async () => {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        console.log("COnfiguring rc for user",user_id)
        Purchases.configure({apiKey:'goog_bClHlaubcaVscmrRoRbWdxZmcyD',appUserId:user_id})
        Purchases.logIn(user_id)
        const offerings = await Purchases.getOfferings();
        setOfferings(parsePurchases(offerings))
        setIsLoading(false)
    }

    get_offerings()
  },[]);

  const renderPricingCards = () => {

    return offerings.map((cardData, index) => (
      <PricingCard
        key={index}
        index={index}
        imageSrc={cardData.imageSrc}
        price={cardData.price}
        description={cardData.description}
        isSelected={selectedCardIndex === index}
        onSelect={(index) => handleCardSelect(index,cardData.pkg)}
      />
    ));
  };

  return (
    isLoading || offerings == null || transactionLoading ? 
    <>
    <Loader visible={isLoading || transactionLoading}/>
    {transactionLoading && <Text style={{textAlign:'center',marginTop:20}}>Verifying Payment.....</Text>}
    </> :
    // <ScrollView>
    <>
      <Loader visible={preVerificationLoader}/>
      <View style={styles.container}>
              <StatusBar backgroundColor={"#1c1c1c"} barStyle="light-content" />

      <View style={{flex:1}}>
      <Text style={{textAlign:"center",fontSize:20,marginHorizontal:20,color:"#d8d8d8"}}>Buy <Text style={{color:"#ff6a1d"}}>Reveals</Text> to see who liked you</Text>
      <Image source={heartImage} style={{height:40,width:40,alignSelf:"center"}}/>
      </View>
      <View style={styles.pricingCards}>{renderPricingCards()}</View>
      <CustomButton buttonStyles={[styles.nextButton, selectedCardIndex === null ? styles.disabledButton : null]}
                    onPress={handleNextPress}
                    disabled={selectedCardIndex === null}
                    buttonText={getButtonText(transactionLoading,transactionTimeOut,trasactionVerified)}
                    textStyles={selectedCardIndex === null ?  {color:"#a4a4a4"} : {color:"#ffffff"}}
                    />
    </View>
    </>
    // </ScrollView>
  );
};

const getButtonText = (transactionLoading,transactionTimeOut,trasactionVerified) => {
    if(transactionLoading){
        return "Verifying Payment....."
    }else if(transactionTimeOut){
        return "Proceed To Buy"
    }else if(trasactionVerified){
        return "Payment Successful!"
    }else{
        return "Proceed To Buy"
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  pricingCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    // flex:1
  },
  nextButton: {
    backgroundColor: "#fa7024",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width:"80%",
    borderWidth:0
  },
  disabledButton: {
    backgroundColor: "#a65021",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PricingScreen;
