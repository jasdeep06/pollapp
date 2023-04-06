import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

const screenHeight = Dimensions.get("window").height;
console.log(screenHeight)
const cardHeight = (screenHeight-250) / 2; // 200 is an arbitrary value to accommodate other elements on the screen
console.log(cardHeight)

const PricingCard = ({ index, imageSrc, price, description, isSelected, onSelect }) => {
//   const [isSelected, setIsSelected] = useState(false);

  const handlePress = () => {
    if (!isSelected) {
      onSelect(index);
    }
  };

  const renderDescription = () => {
    return description.map((item, index) => (
      <Text key={index} style={[styles.descriptionItem, isSelected ? styles.selectedDescriptionItem : null,{fontWeight:"bold"}]}>
        {index == 0 ? item : item + " Days"} <Text style={[styles.descriptionItem, isSelected ? styles.selectedDescriptionItem : null,{fontWeight:"normal"}]}>{index == 0 ? "Reveal(s)":"Validity"}</Text>
      </Text>
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
      <Text style={[styles.price, isSelected ? styles.selectedPrice : null]}>
        {price}
      </Text>
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
    margin: 15,
    width: 160,
    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 10,
    height:cardHeight
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
