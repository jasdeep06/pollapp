import { StyleSheet, Text, View } from "react-native";

import CustomText from "./CustomText";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

const Empty = ({icon,description,subDescription}) => (
  <View style={styles.emptyLikesContainer}>
    {/* Use the "heart-outline" icon from Ionicons */}
    {icon}
    <CustomText style={styles.emptyLikesTitle}>{description}</CustomText>
    <CustomText style={styles.emptyLikesDescription}>
        {subDescription}
    </CustomText>
  </View>
);

const styles = StyleSheet.create({
  emptyLikesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyLikesTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#bcbcbc",
    marginBottom: 10,
  },
  emptyLikesDescription: {
    fontSize: 16,
    textAlign: "center",
    color: "#a4a4a4",
    fontWeight: "bold"
  },
});

export default Empty;
