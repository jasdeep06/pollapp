import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import CustomText from "./CustomText";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width
console.log(screenHeight)
const cardHeight = (screenHeight- screenHeight*0.25) / 2; // 200 is an arbitrary value to accommodate other elements on the screen
const cardWidth = (screenWidth - 100) /2
console.log(cardHeight)

function removeDecimalZeroes(priceString) {
  // Extract currency symbol and number parts using regex
  const regex = /([^0-9.-]*)([0-9]*\.?[0-9]+)/;
  const match = priceString.match(regex);
  
  if (match) {
    const currencySymbol = match[1];
    const price = parseFloat(match[2]);
    const cleanedPrice = price.toFixed(price % 1 === 0 ? 0 : 2);

    return currencySymbol + cleanedPrice;
  } else {
    // Return the original string if it doesn't match the expected format
    return priceString;
  }
}


const PricingCard = ({ index, imageSrc, price, description, isSelected, onSelect }) => {
//   const [isSelected, setIsSelected] = useState(false);

  const handlePress = () => {
    if (!isSelected) {
      onSelect(index);
    }
  };

  const renderDescription = () => {
    return description.map((item, index) => (
      <CustomText key={index} style={[styles.descriptionItem, isSelected ? styles.selectedDescriptionItem : null,{fontWeight:"bold"}]}>
        {index == 0 || item === "unlimited" ? item : item + " Days"} <CustomText style={[styles.descriptionItem, isSelected ? styles.selectedDescriptionItem : null,{fontWeight:"normal"}]}>{index == 0 ? "Reveal(s)":"Validity"}</CustomText>
      </CustomText>
    ));
  };

  return (
    <TouchableOpacity
      style={[styles.card, isSelected ? styles.selectedCard : null]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {/* <Image source={{ uri: imageSrc }} style={styles.image} /> */}
      <Image source={imageSrc} style={styles.image}/>
      <CustomText style={[styles.price, isSelected ? styles.selectedPrice : null]}>
        {removeDecimalZeroes(price)}
      </CustomText>
      <View style={styles.description}>{renderDescription()}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 35,
    alignItems: "center",
    justifyContent: "center",
    margin: 7,
    width: 160,
    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 10,
    height:cardHeight,
    width:cardWidth
  },
  selectedCard: {
    backgroundColor: "#fff66d",
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#ec5400",
  },
  // selectedPrice: {
  //   color: "#fff",
  // },
  description: {
    alignItems: "center",
  },
  descriptionItem: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 5,
    color: "#333",
  },
  // selectedDescriptionItem: {
  //   color: "#fff",
  // },
});

export default PricingCard;
