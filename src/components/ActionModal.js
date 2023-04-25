import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { Feather } from '@expo/vector-icons';
import Modal from "react-native-modal";

const ActionModal = ({ isVisible, toggleModal, children,modalStyle,backdropOpacity,showDismiss=true }) => {

  return (
    <View>
      <Modal isVisible={isVisible} style={[styles.modal,modalStyle]} backdropOpacity={backdropOpacity ? backdropOpacity : 0.9}>
        <View>
          <View style={styles.closeIcon}>
          {showDismiss && <Feather name="x" size={24} color="black" onPress={toggleModal}/>}
            </View>

          {children}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    marginTop: "50%",
    marginLeft: "10%",
    marginRight: "10%",
    borderRadius: 10,
    flex: 0,
    paddingBottom: 20,
  },
  closeIcon: {
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "row",
    padding: 5,
  },
});

export default ActionModal;
