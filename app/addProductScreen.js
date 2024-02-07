import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Switch,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import ImgUpload from "../components/ImgUpload";
import RemoveImg from "../components/RemoveImg";
import axios from "axios";
import CustomModal from "../components/CustomModal";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

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

  const [customizations, setCustomizations] = useState([]);

  const addCustomization = () => {
    const newCustomization = {
      name: "",
      isRequired: false,
      selectionType: "",
      options: [{ optionName: "", optionPrice: "" }],
    };
    setCustomizations([...customizations, newCustomization]);
  };

  const removeCustomization = (index) => {
    const updatedCustomizations = [...customizations];
    updatedCustomizations.splice(index, 1);
    setCustomizations(updatedCustomizations);
  };

  const updateCustomization = (index, field, value) => {
    const updatedCustomizations = [...customizations];
    updatedCustomizations[index][field] = value;
    setCustomizations(updatedCustomizations);
  };

  const addOption = (index) => {
    const updatedCustomizations = [...customizations];
    updatedCustomizations[index].options.push({
      optionName: "",
      optionPrice: "",
    });
    setCustomizations(updatedCustomizations);
  };

  const removeOption = (cIndex, oIndex) => {
    const updatedCustomizations = [...customizations];
    updatedCustomizations[cIndex].options.splice(oIndex, 1);
    setCustomizations(updatedCustomizations);
  };

  const renderOptions = (cIndex) => {
    return customizations[cIndex].options.map((option, oIndex) => (
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
          marginVertical: 4,
        }}
        key={oIndex}
      >
        <TextInput
          style={{
            flex: 2,
            borderWidth: 1,
            borderColor: "#bdbdbd",
            padding: 4,
            margin: 4,
            borderRadius: 8,
            backgroundColor: "#ffffff",
          }}
          placeholder="Option Name"
          value={option.optionName}
          onChangeText={(text) =>
            updateOption(cIndex, oIndex, "optionName", text)
          }
        />
        <TextInput
          style={{
            flex: 2,
            borderWidth: 1,
            borderColor: "#bdbdbd",
            padding: 4,
            margin: 4,
            borderRadius: 8,
            backgroundColor: "#ffffff",
          }}
          placeholder="Option Price"
          value={option.optionPrice}
          onChangeText={(text) =>
            updateOption(cIndex, oIndex, "optionPrice", text)
          }
        />
        <TouchableOpacity
          style={{ flex: 1, alignItems: "center" }}
          onPress={() => removeOption(cIndex, oIndex)}
        >
          <Image source={require("../assets/images/detete_icon.png")} />
        </TouchableOpacity>
      </View>
    ));
  };

  const updateOption = (cIndex, oIndex, field, value) => {
    const updatedCustomizations = [...customizations];
    updatedCustomizations[cIndex].options[oIndex][field] = value;
    setCustomizations(updatedCustomizations);
  };

  const handleCreateProduct = async () => {
    setIsLoading(true);

    try {
      const key = "accessTkn";
      const bearerToken = await SecureStore.getItemAsync(key);

      if (bearerToken) {
        const postFormData = new FormData();

        postFormData.append("name", productData.name);
        postFormData.append("price", productData.price);
        postFormData.append("category", productData.category);
        postFormData.append("description", productData.description);
        postFormData.append("vegnonveg", productData.vegnonveg);
        postFormData.append("stock", productData.stock.toString());
        postFormData.append("image", {
          uri: productData.image,
          type: "image/jpeg",
          name: "image.jpg",
        });

        postFormData.append(
          "productCustomisations",
          JSON.stringify(customizations),
          { contentType: "application/json" }
        );

        const createProductApiEndpoint =
          "https://dzo.onrender.com/api/vi/shop/owner/shop/new/product";

        const response = await axios.post(
          createProductApiEndpoint,
          postFormData,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setIsSuccess(true);
        console.log("Product created successfully!", response);
      } else {
        console.error("Token not found in SecureStore");
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
      console.error("Error creating product:", error);
    } finally {
      setIsLoading(false);

      setTimeout(() => {
        setIsSuccess(false);
        setIsError(false);
        router.back();
      }, 2000);
    }
  };

  const [isFormValid, setIsFormValid] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

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
    <ScrollView style={{ flexDirection: "column", padding: 15, flex: 1 }}>
      <View style={{ marginBottom: 20, flexDirection: "row" }}>
        <Pressable onPress={router.back}>
          <Image
            style={{ marginEnd: 10 }}
            source={require("../assets/images/back_icon.png")}
          />
        </Pressable>

        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Add product</Text>
      </View>

      {productData.image !== "" ? (
        <Image
          source={{ uri: productData.image }}
          style={{
            width: "100%",
            height: 180,
            resizeMode: "contain",
            marginVertical: 10,
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
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <View style={{ flex: 1 }}>
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

        <View>
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

      <Text style={{ alignItems: "center", fontSize: 18, marginBottom: 10 }}>
        Customizations
      </Text>

      <ScrollView>
        {customizations.map((customization, index) => (
          <View key={index}>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#000000",
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <TextInput
                style={{
                  backgroundColor: "#ffffff",
                  borderWidth: 1,
                  borderColor: "#bdbdbd",
                  padding: 4,
                  marginVertical: 4,
                  borderRadius: 8,
                }}
                placeholder="Customization Name"
                value={customization.name}
                onChangeText={(text) =>
                  updateCustomization(index, "name", text)
                }
              />

              <View style={{ flexDirection: "row" }}>
                <TextInput
                  style={{
                    flex: 1,
                    backgroundColor: "#ffffff",
                    borderWidth: 1,
                    borderColor: "#bdbdbd",
                    padding: 4,
                    marginVertical: 4,

                    borderRadius: 8,
                  }}
                  placeholder="Selection Type"
                  value={customization.selectionType}
                  onChangeText={(text) =>
                    updateCustomization(index, "selectionType", text)
                  }
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text style={{ marginLeft: 10 }}>Is Required:</Text>
                  <Switch
                    value={customization.isRequired}
                    onValueChange={(value) =>
                      updateCustomization(index, "isRequired", value)
                    }
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#bdbdbd",
                  }}
                />
                <View>
                  <Text style={{ marginHorizontal: 8, textAlign: "center" }}>
                    Options
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#bdbdbd",
                  }}
                />
              </View>

              {renderOptions(index)}

              <View style={{ flexDirection: "column", flex: 1 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                    marginBottom: 6,
                    borderWidth: 1,
                    borderColor: "#000000",
                  }}
                  onPress={() => addOption(index)}
                >
                  <Text>Add Option</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#000000",
                    padding: 10,
                    alignItems: "center",
                    borderRadius: 8,
                    marginBottom: 6,
                  }}
                  onPress={() => removeCustomization(index)}
                >
                  <Text style={{ color: "#ffffff" }}>Remove Customization</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={{
            backgroundColor: "#3498db",
            padding: 10,
            alignItems: "center",
            borderRadius: 8,
            marginBottom: 6,
          }}
          onPress={addCustomization}
        >
          <Text style={{ color: "#ffffff" }}>Add Customization</Text>
        </TouchableOpacity>
      </ScrollView>

      <Button
        title="Add Product"
        onPress={handleCreateProduct}
        disabled={!isFormValid}
      />

      <View style={{ height: 40 }} />

      {isLoading || isSuccess || isError ? (
        <View style={styles.overlay} />
      ) : null}

      <CustomModal visible={isLoading} type="loading" msg="" />
      <CustomModal
        visible={isSuccess}
        type="success"
        msg="Product created successfully"
      />
      <CustomModal
        visible={isError}
        type="error"
        msg="Failed to create product"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    height: 40,
    borderColor: "#bdbdbd",
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
    borderColor: "#bdbdbd",
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
    borderColor: "#bdbdbd",
    backgroundColor: "#FFF",
    padding: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#3498db",
    borderColor: "#bdbdbd",
  },
  buttonText: {
    color: "#3498db",
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default addProductScreen;
