import React, { useState, useEffect } from "react";
import { Stack, useRouter, Link, useGlobalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import ImgUpload from "../components/ImgUpload";
import RemoveImg from "../components/RemoveImg";
import CustomModal from "../components/CustomModal";
import * as SecureStore from 'expo-secure-store'; 

const productDetail = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const { productId } = useGlobalSearchParams();
  const [editedProduct, setEditedProduct] = useState({
    _id: "",
    name: "",
    price: 0,
    category: "",
    description: "",
    image: { key: "", url: "" },
    vegnonveg: "",
    stock: 0,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [priceWarning, setPriceWarning] = useState("");
  const [newImageUrl, setNewImageUri] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [customizations, setCustomizations] = useState([]);

  useEffect(() => {
    // Assume that editedProduct is received from a get request
    if (editedProduct.productCustomisations) {
      setCustomizations(editedProduct.productCustomisations);
    }
  }, [editedProduct]);

  useEffect(() => {
    const isValid =
      editedProduct.name.trim() !== "" &&
      !isNaN(editedProduct.price) &&
      editedProduct.price !== 0 &&
      editedProduct.price !== "" &&
      editedProduct.category.trim() !== "" &&
      editedProduct.description.trim() !== "" &&
      editedProduct.vegnonveg !== "";
    setIsFormValid(isValid);
  }, [editedProduct, newImageUrl]);

  const fetchProductDetails = async () => {
    setIsLoading(true);
    setIsImageUploaded(false);
  
    try {
      const key = "accessTkn";
      const bearerToken = await SecureStore.getItemAsync(key);
  
      if (bearerToken) {
        const productDetailsApiEndpoint = `https://dzo.onrender.com/api/vi/shop/owner/shop/product/${productId}`;
  
        const response = await axios.get(productDetailsApiEndpoint, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });
  
        if (response.data.success) {
          setIsLoading(false);
          setEditedProduct(response.data.product);
          console.log("fetched", response.data.product._id);
        } else {
          setIsLoading(false);
          console.error("Failed to fetch product details");
        }
      } else {
        setIsLoading(false);
        console.error("Token not found in SecureStore");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching product details:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const handleInputChange = (field, value) => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [field]:
        field === "price" ? (value === "" ? "" : parseInt(value)) : value,
    }));
  };

  const handleDeleteProduct = async () => {
    console.log("to delete", editedProduct._id);
    setIsLoading(true);
  
    try {
      const key = "accessTkn";
      const bearerToken = await SecureStore.getItemAsync(key);
  
      if (bearerToken) {
        const deleteProductApiEndpoint = `https://dzo.onrender.com/api/vi/shop/owner/shop/delete/product/${editedProduct._id}`;
  
        const response = await axios.delete(deleteProductApiEndpoint, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });
  
        console.log(response.data);
        setIsSuccess(true);
      } else {
        console.error("Token not found in SecureStore");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsSuccess(false);
        setIsError(false);
        router.back();
      }, 2000);
    }
  };

  const handleUpdateProduct = async () => {
    setIsLoading(true);
  
    try {
      const key = "accessTkn";
      const bearerToken = await SecureStore.getItemAsync(key);
  
      if (bearerToken) {
        const putFormData = new FormData();
  
        if (newImageUrl !== "") {
          putFormData.append("image", {
            uri: newImageUrl,
            type: "image/jpeg",
            name: "image.jpg",
          });
        }
  
        putFormData.append("name", editedProduct.name);
        putFormData.append("price", editedProduct.price);
        putFormData.append("category", editedProduct.category);
        putFormData.append("description", editedProduct.description);
        putFormData.append("vegnonveg", editedProduct.vegnonveg);
        putFormData.append("stock", isNaN(editedProduct.stock) ? 0 : editedProduct.stock);
  
        const updateProductApiEndpoint = `https://dzo.onrender.com/api/vi/shop/owner/shop/update/product/${productId}`;
  
        const response = await axios.put(updateProductApiEndpoint, putFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${bearerToken}`,
          },
        });
  
        if (response.data.success) {
          setIsSuccess(true);
          console.log("Product updated successfully");
        } else {
          setIsError(true);
          console.error("Failed to update product");
        }
      } else {
        console.error("Token not found in SecureStore");
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
  
      setTimeout(() => {
        setIsSuccess(false);
        setIsError(false);
        router.back();
      }, 2000);
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const imgUri = result.assets[0].uri;
      setNewImageUri(imgUri);
      setIsImageUploaded(true);
    } else {
      alert("You did not select any image.");
    }
  };

  const removeSelectedImg = () => {
    setNewImageUri("");
    setIsImageUploaded(false);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          marginBottom: 20,
          flexDirection: "row",
          padding: 10,
          alignItems: "center",
        }}
      >
        <Pressable onPress={router.back}>
          <Image
            style={{ marginEnd: 10 }}
            source={require("../assets/images/back_icon.png")}
          />
        </Pressable>

        <Text style={{ fontSize: 22, fontWeight: "bold" }}>
          Update your product
        </Text>
      </View>

      {isImageUploaded ? (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: editedProduct.image.url }}
            style={{ height: 120, width: 120, borderRadius: 80 }}
          />
          <Image
            source={require("../assets/images/right_arrow.png")}
            style={{ resizeMode: "cover" }}
          />
          <Image
            source={{ uri: newImageUrl }}
            style={{ height: 120, width: 120, borderRadius: 80 }}
          />
        </View>
      ) : (
        <View style={{ width: "100%", alignItems: "center" }}>
          <Image
            source={{ uri: editedProduct.image.url }}
            style={{ height: 120, width: 120, borderRadius: 80 }}
          />
        </View>
      )}

      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        value={editedProduct.name}
        onChangeText={(text) => handleInputChange("name", text)}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={[styles.input, priceWarning && styles.inputError]}
        value={editedProduct.price.toString()}
        onChangeText={(text) => handleInputChange("price", text)}
        keyboardType="numeric"
      />
      {priceWarning ? (
        <Text style={styles.warningText}>{priceWarning}</Text>
      ) : null}

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={editedProduct.category}
        onChangeText={(text) => handleInputChange("category", text)}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={editedProduct.description}
        onChangeText={(text) => handleInputChange("description", text)}
      />

      <View style={{ flexDirection: "row", flex: 2, marginHorizontal: 10 }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 10,
              marginBottom: 8,
            }}
          >
            Image
          </Text>
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

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 10,
              marginBottom: 8,
            }}
          >
            Stock
          </Text>
          <View style={styles.stockcontainer}>
            <TouchableOpacity
              onPress={() =>
                handleInputChange("stock", editedProduct.stock - 1)
              }
              style={[
                styles.stockbutton,
                editedProduct.stock === 0 && styles.stockdisabledButton,
              ]}
              disabled={editedProduct.stock === 0}
            >
              <Text style={styles.stockbuttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.stockValue}>{editedProduct.stock}</Text>
            <TouchableOpacity
              onPress={() =>
                handleInputChange("stock", editedProduct.stock + 1)
              }
              style={styles.stockbutton}
            >
              <Text style={styles.stockbuttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.label}>Veg/Non-Veg</Text>
      <View style={styles.vegNonVegContainer}>
        <TouchableOpacity
          style={[
            styles.vegNonVegButton,
            editedProduct.vegnonveg === "veg" && styles.selectedButton,
          ]}
          onPress={() => handleInputChange("vegnonveg", "veg")}
        >
          <Text
            style={[
              styles.buttonText,
              editedProduct.vegnonveg === "veg" && styles.selectedButtonText,
            ]}
          >
            Veg
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.vegNonVegButton,
            editedProduct.vegnonveg === "nonveg" && styles.selectedButton,
          ]}
          onPress={() => handleInputChange("vegnonveg", "nonveg")}
        >
          <Text
            style={[
              styles.buttonText,
              editedProduct.vegnonveg === "nonveg" && styles.selectedButtonText,
            ]}
          >
            Non-Veg
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.label}>Product Customizations:</Text>
        {customizations.map((customization, index) => (
          <View style={{ marginHorizontal: 10 }} key={index}>
            <Text>Customization Name: {customization.name}</Text>
            <Text>Selection Type: {customization.selectionType}</Text>
            <Text>Is Required: {customization.isRequired.toString()}</Text>

            {customization.options && customization.options.length > 0 && (
              <View>
                <Text>Options:</Text>
                {customization.options.map((option, oIndex) => (
                  <View style={{ flexDirection: "row" }} key={oIndex}>
                    <Text>Option Name: {option.optionName}</Text>
                    <Text>Option Price: {option.optionPrice}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={{
          marginTop: 20,
          borderRadius: 10,

          backgroundColor: isFormValid ? "#000000" : "gray",
          alignItems: "center",
          height: 40,
          justifyContent: "center",
          marginHorizontal: 10,
        }}
        onPress={handleUpdateProduct}
        disabled={!isFormValid}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Update Product</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          marginTop: 10,
          borderRadius: 10,

          backgroundColor: "#FFADB0",
          alignItems: "center",
          height: 40,
          justifyContent: "center",
          marginHorizontal: 10,
          borderWidth:1,
          borderColor:"#8D272B"
        }}
        onPress={handleDeleteProduct}
        disabled={!isFormValid}
      >
        <Text style={{ color: "#8D272B", fontSize: 18 }}>Delete Product</Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />

      {isLoading || isSuccess || isError ? (
        <View style={styles.overlay} />
      ) : null}

      <CustomModal visible={isLoading} type="loading" msg="" />
      <CustomModal
        visible={isSuccess}
        type="success"
        msg="Completed successfully"
      />
      <CustomModal
        visible={isError}
        type="error"
        msg="Failed to complete"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 8,
    marginHorizontal: 10,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  inputError: {
    borderColor: "red",
  },
  warningText: {
    color: "red",
    marginBottom: 10,
  },
  inputError: {
    borderColor: "red",
  },
  warningText: {
    color: "red",
    marginBottom: 10,
  },
  vegNonVegContainer: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vegNonVegButton: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3498db",
    backgroundColor: "#FFF",
    padding: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  buttonText: {
    color: "#3498db",
  },
  selectedButtonText: {
    color: "#FFF",
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default productDetail;
