import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
        description
      };
  
      products.push(parsedProduct);
    }
  
    return products;
  }
  

const App = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [offerings,setOfferings] = useState(null)
  const [isLoading,setIsLoading] = useState(true)

  const handleCardSelect = (index) => {
    setSelectedCardIndex(index);
  };




  useEffect(() => {
    const get_offerings = async () => {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        Purchases.configure({apiKey:'goog_bClHlaubcaVscmrRoRbWdxZmcyD'})
        const offerings = await Purchases.getOfferings();
        setOfferings(parsePurchases(offerings))
        setIsLoading(false)
        const purchaseMade = await Purchases.purchasePackage(offerings.all['lifetime']['availablePackages'][0]);
        console.log(purchaseMade)
    }

    get_offerings()
  },[]);

  const renderPricingCards = () => {
    const cardsData = [
      {
        imageSrc: "https://via.placeholder.com/80",
        price: "$9.99",
        description: ["Feature 1", "Feature 2"],
      },
      {
        imageSrc: "https://via.placeholder.com/80",
        price: "$19.99",
        description: ["Feature 1", "Feature 2"],
      },
      {
        imageSrc: "https://via.placeholder.com/80",
        price: "$29.99",
        description: ["Feature 1", "Feature 2"],
      },
    ];

    return offerings.map((cardData, index) => (
      <PricingCard
        key={index}
        index={index}
        imageSrc={cardData.imageSrc}
        price={cardData.price}
        description={cardData.description}
        isSelected={selectedCardIndex === index}
        onSelect={handleCardSelect}
      />
    ));
  };

  return (
    isLoading || offerings == null ?  <Loader visible={isLoading}/>:
    <SafeAreaView style={styles.container}>
      <View style={styles.pricingCards}>{renderPricingCards()}</View>
      <TouchableOpacity
        style={[styles.nextButton, selectedCardIndex === null ? styles.disabledButton : null]}
        onPress={() => console.log("Next button pressed")}
        disabled={selectedCardIndex === null}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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

export default App;
