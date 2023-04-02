import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import React from "react";

const Empty = ({icon,description,subDescription}) => (
  <View style={styles.emptyLikesContainer}>
    {/* Use the "heart-outline" icon from Ionicons */}
    {icon}
    <Text style={styles.emptyLikesTitle}>{description}</Text>
    <Text style={styles.emptyLikesDescription}>
        {subDescription}
    </Text>
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
    color: "#ccc",
    marginBottom: 10,
  },
  emptyLikesDescription: {
    fontSize: 16,
    textAlign: "center",
    color: "#ccc",
  },
});

export default Empty;
