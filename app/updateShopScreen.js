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
import EditLocation from "../components/EditLocation";
import MapViewComp from "../components/MapViewComp";
import * as SecureStore from "expo-secure-store";

const updateShopScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [editedShop, setEditedShop] = useState({
    name: "",
    shopType: "",
    image: { key: "", url: "" },
    location: { coordinates: [] },
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [newImageUrl, setNewImageUri] = useState("");

  useEffect(() => {
    const isValid =
      editedShop.name.trim() !== "" && editedShop.shopType.trim() !== "";
    setIsFormValid(isValid);
  }, [editedShop]);

  const fetchShopDetails = async () => {
    setIsLoading(true);
    setIsImageUploaded(false);

    try {
      const key = "accessTkn";
      const bearerToken = await SecureStore.getItemAsync(key);

      if (bearerToken) {
        const shopDetailsApiEndpoint =
          "https://dzo.onrender.com/api/vi/shop/owner/shop/details";

        const response = await axios.get(shopDetailsApiEndpoint, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        if (response.data.success) {
          setIsLoading(false);
          setEditedShop(response.data.shop);
          console.log(response.data.shop);
        } else {
          setIsLoading(false);
          console.error("Failed to fetch shop details");
        }
      } else {
        console.error("Token not found in SecureStore");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching shop details:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchShopDetails();
  }, []);

  const handleInputChange = (field, value) => {
    setEditedShop((prevShop) => ({
      ...prevShop,
      [field]:
        field === "price" ? (value === "" ? "" : parseInt(value)) : value,
    }));
  };

  const handleUpdateShop = async () => {
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

        putFormData.append("name", editedShop.name);
        putFormData.append("shopType", editedShop.shopType);

        const updateShopApiEndpoint =
          "https://dzo.onrender.com/api/vi/shop/owner/update/shop/details";

        const response = await axios.put(updateShopApiEndpoint, putFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        if (response.data.success) {
          setIsSuccess(true);
          console.log("Shop updated successfully");
          fetchShopDetails();
        } else {
          setIsError(true);
          console.error("Failed to update shop");
        }
      } else {
        console.error("Token not found in SecureStore");
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
      console.error("Error updating shop:", error);
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
          margin: 10,
          alignItems: "center",
        }}
      >
        <Image
          style={{ marginEnd: 10 }}
          source={require("../assets/images/back_icon.png")}
        />
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>
          Update your shop
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
            source={{ uri: editedShop.image.url }}
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
            source={{ uri: editedShop.image.url }}
            style={{ height: 120, width: 120, borderRadius: 80 }}
          />
        </View>
      )}

      <Text style={styles.label}>Shop Name</Text>
      <TextInput
        style={styles.input}
        value={editedShop.name}
        onChangeText={(text) => handleInputChange("name", text)}
      />

      <Text style={styles.label}>Shop Type</Text>
      <TextInput
        style={styles.input}
        value={editedShop.shopType}
        onChangeText={(text) => handleInputChange("shopType", text)}
      />

      <View style={{ flexDirection: "row", flex: 2, marginHorizontal: 10 }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 10,
              marginBottom: 6,
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
              marginBottom: 6,
            }}
          >
            Location
          </Text>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/updateLocationScreen",
              })
            }
          >
            <EditLocation />
          </Pressable>
        </View>
      </View>
      {/* <MapViewComp shop={editedShop} /> */}

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
        onPress={handleUpdateShop}
        disabled={!isFormValid}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Update Shop</Text>
      </TouchableOpacity>
      <View style={{ height: 20 }} />

      {/* {isLoading || isSuccess || isError ? (
        <View style={styles.overlay} />
      ) : null} */}

      <CustomModal visible={isLoading} type="loading" msg="" />
      <CustomModal
        visible={isSuccess}
        type="success"
        msg="Shop updated successfully"
      />
      <CustomModal visible={isError} type="error" msg="Failed to update Shop" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6,
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

export default updateShopScreen;
