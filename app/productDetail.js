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
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
  ToastAndroid,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import ImgUpload from "../components/ImgUpload";
import RemoveImg from "../components/RemoveImg";
import CustomModal from "../components/CustomModal";

const productDetail = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const { productId } = useGlobalSearchParams();
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    price: 0,
    category: "",
    description: "",
    image: { key: "", url: "" },
    vegnonveg: "",
    stock: 0,
    productCustomisations: [],
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [priceWarning, setPriceWarning] = useState("");
  const [newImageUrl, setNewImageUri] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);

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
    setIsImageUploaded(false);
    try {
      const response = await axios.get(
        `https://dzo.onrender.com/api/vi/shop/owner/shop/product/${productId}`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzFmMjE5ZjJjYTA1NGIwNjQ3NzUiLCJpYXQiOjE3MDQ1NzU0NzR9.9Q3tc2QcLs9d5jVG4sF3bER9DR7JHdmieOd8NI5qeMw",
          },
        }
      );
      if (response.data.success) {
        setEditedProduct(response.data.product);
        console.log(response.data.product);
      } else {
        console.error("Failed to fetch product details");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
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

  const handleUpdateProduct = async () => {
    setIsLoading(true);
    try {
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
      putFormData.append(
        "stock",
        isNaN(editedProduct.stock) ? 0 : editedProduct.stock
      );
      const response = await axios.put(
        `https://dzo.onrender.com/api/vi/shop/owner/shop/update/product/${productId}`,
        putFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzFmMjE5ZjJjYTA1NGIwNjQ3NzUiLCJpYXQiOjE3MDQ1NzU0NzR9.9Q3tc2QcLs9d5jVG4sF3bER9DR7JHdmieOd8NI5qeMw",
          },
        }
      );
      if (response.data.success) {
        setIsSuccess(true);
        console.log("Product updated successfully");
        fetchProductDetails();
      } else {
        setIsError(true);
        console.error("Failed to update product");
      }
    } catch (error) {
      setIsError(true);
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);

      setTimeout(() => {
        setIsSuccess(false);
        setIsError(false);
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
      <View style={{ marginBottom: 20, flexDirection: "row" }}>
        <Image
          style={{ marginEnd: 10 }}
          source={require("../assets/images/back_icon.png")}
        />
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
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

      <View style={{ flexDirection: "row", flex: 2 , marginHorizontal:10}}>
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

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Stock</Text>
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

      <TouchableOpacity
        style={{
          marginTop: 20,
          borderRadius: 10,
          width: "100%",
          backgroundColor: isFormValid ? "#000000" : "gray",
          alignItems: "center",
          height: 40,
          justifyContent: "center",
        }}

        onPress={handleUpdateProduct}
        disabled={!isFormValid}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Update Product</Text>
      </TouchableOpacity>
      <View style={{ height: 20 }} />

      {isLoading || isSuccess || isError ? (
        <View style={styles.overlay} />
      ) : null}

      {/* Loading Modal */}
      <CustomModal visible={isLoading} type="loading" msg=""/>

      {/* Success Modal */}
      <CustomModal visible={isSuccess} type="success" msg="Product updated successfully"/>

      {/* Error Modal */}
      <CustomModal visible={isError} type="error" msg="Failed to update product"/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 8,
    marginHorizontal:10
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginHorizontal:10
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
    marginHorizontal:10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
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
