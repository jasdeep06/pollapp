import { Dimensions, ImageBackground, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";

import { Feather } from "@expo/vector-icons";
import Modal from "react-native-modal";

const ImageModal = ({
  isVisible,
  toggleModal,
  children,
  modalStyle,
  imageSource,
  imageSizePercentage,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <View>
      <Modal isVisible={isVisible} style={[styles.modal, modalStyle]} backdropOpacity={0.5}>
      <View style={styles.closeIcon}>
              <Feather name="x" size={24} color="black" onPress={toggleModal} />
            </View>
        <ImageBackground
          source={imageSource}
          style={{
            width: screenWidth * (imageSizePercentage / 100),
            height: screenHeight * (imageSizePercentage / 100),
            justifyContent:"center",
            alignSelf:"center"
          }}
          resizeMode="contain"
        >
            

        </ImageBackground>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    // marginTop: "50%",
    marginLeft: "1%",
    marginRight: "1%",
    borderRadius: 10,
    flex: 0,
    paddingBottom: 20,
    paddingTop: 10,
  },
  closeIcon: {
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "row",
    padding: 5,
  },
});

export default ImageModal;
