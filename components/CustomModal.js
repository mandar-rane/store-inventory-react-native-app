// CustomModal.js
import React from 'react';
import { View, Text, ActivityIndicator, Modal, StyleSheet } from 'react-native';

const CustomModal = ({ visible, type, onClose, msg }) => {
  const getContent = () => {
    switch (type) {
      case 'loading':
        return (
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      case 'success':
        return (
          <View style={styles.modalContent}>
            <Text>Product updated successfully</Text>
          </View>
        );
      case 'error':
        return (
          <View style={styles.modalContent}>
            <Text>Failed to update product</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {getContent()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default CustomModal;
