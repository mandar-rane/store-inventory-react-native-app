import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const addProductScreen = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
    vegnonveg: "",
  });

  const handleCreateProduct = async () => {
    if (isNaN(productData.price) || productData.price === "") {
      setPriceWarning("Please enter a valid price");
      return;
    } else {
      setPriceWarning(""); // Clear the warning if the price is valid
    }

    try {
      const response = await fetch(
        "https://dzo.onrender.com/api/vi/shop/owner/shop/new/product",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzFmMjE5ZjJjYTA1NGIwNjQ3NzUiLCJpYXQiOjE3MDQ1NzU0NzR9.9Q3tc2QcLs9d5jVG4sF3bER9DR7JHdmieOd8NI5qeMw",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      // Handle the response, e.g., show a success message or navigate to another screen
      console.log("Product created successfully!", response);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const [isFormValid, setIsFormValid] = useState(false);
  const [priceWarning, setPriceWarning] = useState("");

  useEffect(() => {
    // Check if all fields are filled
    const isValid =
      productData.name !== "" &&
      productData.price !== "" &&
      productData.category !== "" &&
      productData.description !== "" &&
      productData.image !== "" &&
      productData.vegnonveg !== "";

    setIsFormValid(isValid);
  }, [productData]);

  const handleVegNonVegSelection = (vegnonveg) => {
    setProductData({ ...productData, vegnonveg });
  };

  return (
    <View style={{ flexDirection: "column", padding: 15 }}>
      <View style={{marginBottom:20, flexDirection:"row"}}>
        <Image style={{marginEnd:10}} source={require("../assets/images/back_icon.png")}/>
        <Text style={{fontSize: 24, fontWeight:"bold"}}>Add product</Text>
        
      </View>
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

      {/* Image preview */}

      {/* Input fields */}
      <TextInput

        maxLength={35}
        keyboardType="default"
        style={styles.input}
        placeholder="Product Name"
        onChangeText={(text) => setProductData({ ...productData, name: text })}
      />
      <TextInput
        style={[styles.input, priceWarning && styles.inputError]}
        placeholder="Price"
        maxLength={5}
        keyboardType="numeric"
        onChangeText={(text) => setProductData({ ...productData, price: text })}
      />
      {priceWarning ? (
        <Text style={styles.warningText}>{priceWarning}</Text>
      ) : null}
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
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        onChangeText={(text) => setProductData({ ...productData, image: text })}
      />
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
      {productData.image !== "" && (
        <Image
          source={{ uri: productData.image }}
          style={{
            width: 200,
            height: 200,
            resizeMode: "cover",
            marginVertical: 10,
          }}
        />
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor:"#ffffff",
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
    backgroundColor:"#ffffff",
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
});

export default addProductScreen;
