import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const StockUpdater = ({onCountChange}) => {
  const [stock, setStock] = useState(0);

  const incrementStock = () => {
    setStock(stock + 1);
    onCountChange(stock + 1);
  };

  const decrementStock = () => {
    if (stock > 0) {
      setStock(stock - 1);
      onCountChange(stock-1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={decrementStock}
        style={[styles.button, stock === 0 && styles.disabledButton]}
        disabled={stock === 0}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.stockValue}>{stock}</Text>
      <TouchableOpacity onPress={incrementStock} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    display:"flex",
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    width:45,
    alignItems:"center",
    justifyContent:"center"
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  stockValue: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7', // Grey out color
  },
});

export default StockUpdater;
