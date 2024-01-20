import React, { useState, useEffect } from 'react';
import { Stack, useRouter, Link, useGlobalSearchParams} from 'expo-router';
import { View, Text, Image, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';

const productDetail = () => {
  const router = useRouter();
    const { productId } = useGlobalSearchParams();
  const [product, setProduct] = useState({});
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
    image: '',
    vegnonveg: '',
    productCustomisations: [],
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [priceWarning, setPriceWarning] = useState('');

  useEffect(() => {
    // Check if all required fields are provided
    const isValid =
      editedProduct.name !== '' &&
      editedProduct.price !== 0 &&
      editedProduct.category !== '' &&
      editedProduct.description !== '' &&
      editedProduct.image !== '' &&
      editedProduct.vegnonveg !== '';

    setIsFormValid(isValid);
  }, [editedProduct]);

  const fetchProductDetails = async () => {
    try { 
      const response = await axios.get(`https://dzo.onrender.com/api/vi/shop/owner/shop/product/${productId}`, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzFmMjE5ZjJjYTA1NGIwNjQ3NzUiLCJpYXQiOjE3MDQ1NzU0NzR9.9Q3tc2QcLs9d5jVG4sF3bER9DR7JHdmieOd8NI5qeMw',
        },
      });

      if (response.data.success) {
        setProduct(response.data.product);
        setEditedProduct(response.data.product); 
      } else {
        console.error('Failed to fetch product details');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const handleInputChange = (field, value) => {
    if (field === 'price') {
      // Check if the price is a valid number
      if (isNaN(value) || value === '') {
        setPriceWarning('Please enter a valid price');
      } else {
        setPriceWarning('');
      }
    }

    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [field]: value,
    }));
  };

  const handleUpdateProduct = async () => {
    if (isNaN(editedProduct.price) || editedProduct.price === '') {
      setPriceWarning('Please enter a valid price');
      return;
    } else {
      setPriceWarning('');
    }

    try {
      const response = await axios.put(`https://dzo.onrender.com/api/vi/shop/owner/shop/update/product/${productId}`, editedProduct, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzFmMjE5ZjJjYTA1NGIwNjQ3NzUiLCJpYXQiOjE3MDQ1NzU0NzR9.9Q3tc2QcLs9d5jVG4sF3bER9DR7JHdmieOd8NI5qeMw',
        },
      });
      if (response.data.success) {    
        console.log('Product updated successfully');
        fetchProductDetails();
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <ScrollView style={{ padding: 10 , flex: 1}}>
       <View style={{marginBottom:20, flexDirection:"row"}}>
        <Image style={{marginEnd:10}} source={require("../assets/images/back_icon.png")}/>
        <Text style={{fontSize: 24, fontWeight:"bold"}}>Update your product</Text>
        
      </View>

      <Image source={{ uri: product.image }} style={styles.productImage} defaultSource={require("../assets/images/plate.png")} />

      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        value={editedProduct.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={[styles.input, priceWarning && styles.inputError]}
        value={editedProduct.price.toString()}
        onChangeText={(text) => handleInputChange('price', text)}
        keyboardType="numeric"
      />
      {priceWarning ? <Text style={styles.warningText}>{priceWarning}</Text> : null}

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={editedProduct.category}
        onChangeText={(text) => handleInputChange('category', text)}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={editedProduct.description}
        onChangeText={(text) => handleInputChange('description', text)}
      />

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        value={editedProduct.image}
        onChangeText={(text) => handleInputChange('image', text)}
      />

<Text style={styles.label}>Veg/Non-Veg</Text>
      <View style={styles.vegNonVegContainer}>
        <TouchableOpacity
          style={[styles.vegNonVegButton, editedProduct.vegnonveg === 'veg' && styles.selectedButton]}
          onPress={() => handleInputChange('vegnonveg', 'veg')}
        >
          <Text style={[styles.buttonText, editedProduct.vegnonveg === 'veg' && styles.selectedButtonText]}>Veg</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.vegNonVegButton, editedProduct.vegnonveg === 'nonveg' && styles.selectedButton]}
          onPress={() => handleInputChange('vegnonveg', 'nonveg')}
        >
          <Text style={[styles.buttonText, editedProduct.vegnonveg === 'nonveg' && styles.selectedButtonText]}>Non-Veg</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={{marginTop:20, borderRadius: 10,width: "100%", backgroundColor: "#000000", alignItems:"center", height: 40, justifyContent:"center"}} onPress={handleUpdateProduct} disabled={!isFormValid}>
        <Text style={{color: "white", fontSize: 18}}>Update Product</Text>
      </TouchableOpacity>   
      <View style={{height:20}}/>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  productImage: {
    borderRadius: 10,
    width: 140,
    height: 140,
    resizeMode: 'cover',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom:8
  },
  input: {
    backgroundColor:"#ffffff",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
 
  },
  inputError: {
    borderColor: 'red',
  },
  warningText: {
    color: 'red',
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  warningText: {
    color: 'red',
    marginBottom: 10,
  },
  vegNonVegContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  vegNonVegButton: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007BFF',
    backgroundColor: '#FFF',
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  buttonText: {
    color: '#007BFF',
  },
  selectedButtonText: {
    color: '#FFF',
  }
});

export default productDetail;