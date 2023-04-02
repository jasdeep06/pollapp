import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";

import { AxiosContext } from "../context/AxiosContext";
import CustomButton from "../components/CustomButton";
import Loader from "../components/Loader";
import PricingCard from "../components/PricingCard";
import Purchases from "react-native-purchases";

function parsePurchases(purchases) {
    const products = [];
  
    for (const key in purchases.all) {
      const product = purchases.all[key];
  
      const price = product.availablePackages[0]['product'].priceString;
      const description = product.serverDescription.split(",").slice(1);
  
      const parsedProduct = {
        imageSrc: product.serverDescription.split(",")[0],
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
  const like_id = route.params && route.params.like_id;
  const gender = route.params && route.params.gender;
  const from = route.params && route.params.from;

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


useEffect(() => {
    if(trasactionVerified && from == 'reveal'){
        navigation.navigate("LikeViewScreen",{like_id:like_id,gender:gender})
    }
},[trasactionVerified])

const checkTransactionVerification = async (purchaseDate, productId, retryCount = 0) => {
    setTransactionLoading(true)
    try {
      const response = await authAxios.post('/check_transaction_verification', {
        purchaseDate: purchaseDate,
        productId: productId,
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
    try {
        const purchaseMade = await Purchases.purchasePackage(selectedPkg);
        const transactionObj = purchaseMade.customerInfo.nonSubscriptionTransactions.at(-1);
        const purchaseDate = transactionObj.purchaseDate;
        const productId = transactionObj.productId;
        checkTransactionVerification(purchaseDate, productId);
      } catch (e) {
        if (!e.userCancelled) {
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
          console.log("User cancelled!");
        }
      }
  }



  useEffect(() => {
    const get_offerings = async () => {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        Purchases.configure({apiKey:'goog_bClHlaubcaVscmrRoRbWdxZmcyD'})
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
    <StatusBar backgroundColor={"#8C92AC"} barStyle="light-content" />
    {transactionLoading && <Text style={{textAlign:'center',marginTop:20}}>Verifying Payment.....</Text>}
    </> :
    <SafeAreaView style={styles.container}>
              <StatusBar backgroundColor={"#8C92AC"} barStyle="light-content" />

      <Text style={{textAlign:"center",fontSize:20,marginHorizontal:20}}>You have 0 reveals left!To know who razzed you,Buy now!</Text>
      <View style={styles.pricingCards}>{renderPricingCards()}</View>
      <CustomButton buttonStyles={[styles.nextButton, selectedCardIndex === null ? styles.disabledButton : null]}
                    onPress={handleNextPress}
                    disabled={selectedCardIndex === null}
                    buttonText={getButtonText(transactionLoading,transactionTimeOut,trasactionVerified)}/>
    </SafeAreaView>
  );
};

const getButtonText = (transactionLoading,transactionTimeOut,trasactionVerified) => {
    if(transactionLoading){
        return "Verifying Payment....."
    }else if(transactionTimeOut){
        return "Next"
    }else if(trasactionVerified){
        return "Payment Successful!"
    }else{
        return "Next"
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8C92AC",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  pricingCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#FF5A60",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width:"80%"
  },
  disabledButton: {
    backgroundColor: "#FFA5B1",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PricingScreen;
