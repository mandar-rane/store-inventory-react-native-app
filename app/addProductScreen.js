import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ImgUpload from "../components/ImgUpload";
import RemoveImg from "../components/RemoveImg";
import axios from "axios";

const addProductScreen = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: 0,
    category: "",
    description: "",
    image: "",
    vegnonveg: "",
    stock: 0,
  });

  const handleCreateProduct = async () => {
    try {
      const postFormData = new FormData();
      postFormData.append("name", productData.name);
      postFormData.append("price", productData.price);
      postFormData.append("category", productData.category);
      postFormData.append("description", productData.description);
      postFormData.append("vegnonveg", productData.vegnonveg);
      postFormData.append("stock", productData.stock.toString());
      postFormData.append("image", {
          uri: productData.image,
          type:'image/jpeg',
          name:'image.jpg'
        });

      

      const response = await axios.post(
        "https://dzo.onrender.com/api/vi/shop/owner/shop/new/product",
        postFormData,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzFmMjE5ZjJjYTA1NGIwNjQ3NzUiLCJpYXQiOjE3MDQ1NzU0NzR9.9Q3tc2QcLs9d5jVG4sF3bER9DR7JHdmieOd8NI5qeMw",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product created successfully!", response);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const [isFormValid, setIsFormValid] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  useEffect(() => {
    const isValid =
      productData.name.trim() !== "" &&
      !isNaN(productData.price) &&
      productData.price !== 0 &&
      productData.category.trim() !== "" &&
      productData.description.trim() !== "" &&
      productData.image !== "" &&
      productData.vegnonveg !== "";
    setIsFormValid(isValid);
    console.log(productData);
  }, [productData]);

  const handleVegNonVegSelection = (vegnonveg) => {
    setProductData({ ...productData, vegnonveg });
  };

  // const handleImageSelection = (image) => {
  //   setProductData({...productData, image})
  // }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const imgUri = result.assets[0].uri;
      setProductData({ ...productData, image: imgUri });
      setIsImageUploaded(true);
    } else {
      alert("You did not select any image.");
    }
  };

  const removeSelectedImg = () => {
    setProductData({ ...productData, image: "" });
    setIsImageUploaded(false);
  };

  return (
    <View style={{ flexDirection: "column", padding: 15 }}>
      <View style={{ marginBottom: 20, flexDirection: "row" }}>
        <Image
          style={{ marginEnd: 10 }}
          source={require("../assets/images/back_icon.png")}
        />
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Add product</Text>
      </View>

      {productData.image !== "" ? (
        <Image
          source={{ uri: productData.image }}
          style={{
            width: "100%",
            height: 180,
            resizeMode: "contain",
            marginVertical: 10
          }}
        />
      ) : (
        <Image
          source={require("../assets/images/plate.png")}
          style={{
            width: "100%",
            height: 180,
            resizeMode: "contain",
            marginVertical: 10,
          }}
        />
      )}

      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <Text
          style={{
            color: "black",
            fontWeight: "bold",
            fontSize: 24,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Add Product
        </Text>
      </View>
      <TextInput
        maxLength={35}
        keyboardType="default"
        style={styles.input}
        placeholder="Product Name"
        onChangeText={(text) => setProductData({ ...productData, name: text })}
      />
      <TextInput
        style={[styles.input]}
        placeholder="Price"
        maxLength={5}
        keyboardType="numeric"
        onChangeText={(text) =>
          setProductData({ ...productData, price: parseInt(text) })
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        onChangeText={(text) =>
          setProductData({ ...productData, category: text })
        }
      />
      <TextInput
        multiline={true}
        maxLength={200}
        style={styles.descInput}
        placeholder="Description"
        onChangeText={(text) =>
          setProductData({ ...productData, description: text })
        }
      />
      <View style={{ flexDirection: "row" , marginBottom:30}}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Image</Text>
          {isImageUploaded ? (
            <Pressable onPress={removeSelectedImg}>
              <RemoveImg />
            </Pressable>
          ) : (
            <Pressable onPress={pickImageAsync}>
              <ImgUpload />
            </Pressable>
          )}
        </View>

        <View >
          <Text style={styles.label}>Stock</Text>
          <View style={styles.stockcontainer}>
            <TouchableOpacity
              onPress={() =>
                setProductData({ ...productData, stock: productData.stock - 1 })
              }
              style={[
                styles.stockbutton,
                productData.stock === 0 && styles.stockdisabledButton,
              ]}
              disabled={productData.stock === 0}
            >
              <Text style={styles.stockbuttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.stockValue}>{productData.stock}</Text>
            <TouchableOpacity
              onPress={() =>
                setProductData({ ...productData, stock: productData.stock + 1 })
              }
              style={styles.stockbutton}
            >
              <Text style={styles.stockbuttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.vegNonVegContainer}>
        <TouchableOpacity
          style={[
            styles.vegNonVegButton,
            productData.vegnonveg === "veg" && styles.selectedButton,
          ]}
          onPress={() => handleVegNonVegSelection("veg")}
        >
          <Text
            style={[
              styles.buttonText,
              productData.vegnonveg === "veg" && styles.selectedButtonText,
            ]}
          >
            Veg
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.vegNonVegButton,
            productData.vegnonveg === "nonveg" && styles.selectedButton,
          ]}
          onPress={() => handleVegNonVegSelection("nonveg")}
        >
          <Text
            style={[
              styles.buttonText,
              productData.vegnonveg === "nonveg" && styles.selectedButtonText,
            ]}
          >
            Non-Veg
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Add Product"
        onPress={handleCreateProduct}
        disabled={!isFormValid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  inputError: {
    borderColor: "red",
  },
  descInput: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  warningText: {
    color: "red",
    marginBottom: 10,
  },
  vegNonVegContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  vegNonVegButton: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#007BFF",
    backgroundColor: "#FFF",
    padding: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  buttonText: {
    color: "#007BFF",
  },
  selectedButtonText: {
    color: "#FFF", // Change the text color for the selected button
  },
  stockcontainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockbutton: {
    display: "flex",
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    width: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  stockbuttonText: {
    color: "white",
    fontSize: 20,
  },
  stockValue: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  stockdisabledButton: {
    backgroundColor: "#bdc3c7", // Grey out color
  },
});

export default addProductScreen;
