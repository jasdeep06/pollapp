import { Dimensions, Image, StyleSheet, View } from 'react-native';

import Modal from 'react-native-modal';
import React from 'react';

const CircularImageModal = ({ isVisible, toggleModal, imageUri, diameterPercentage }) => {
  const screenWidth = Dimensions.get('window').width;
  const diameter = (screenWidth * diameterPercentage) / 100;

  const modalStyles = StyleSheet.create({
    modal: {
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      height: diameter,
      width: diameter,
      borderRadius: diameter / 2,
      overflow: 'hidden',
    },
    image: {
      height: '100%',
      width: '100%',
      resizeMode: 'cover',
    },
  });

  return (
    <View>
      <Modal isVisible={isVisible} backdropOpacity={0.5} onBackdropPress={toggleModal}>
        <View style={{alignSelf:"center"}}>
          <View style={modalStyles.modal}>
            <Image source={{ uri: imageUri }} style={modalStyles.image} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CircularImageModal;
