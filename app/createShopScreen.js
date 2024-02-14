import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  ToastAndroid,
  StyleSheet,
  Pressable,
} from "react-native";
import axios from "axios";
import ImgUpload from "../components/ImgUpload";
import RemoveImg from "../components/RemoveImg";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import CustomModal from "../components/CustomModal";
import { useRouter } from "expo-router";
import DEZ_OWNER_BASE_URL from "../utils/apiConfig";

const createShopPage = () => {
  const router = useRouter();
  const [shopData, setShopData] = useState({
    name: "",
    address: "",
    category: "",
    shopType: "",
    image: "",
    latitude: "",
    longitude: "",
  });

  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const imgUri = result.assets[0].uri;
      setShopData({ ...shopData, image: imgUri });
      setIsImageUploaded(true);
    } else {
      alert("You did not select any image.");
    }
  };
  const removeSelectedImg = () => {
    setShopData({ ...shopData, image: "" });
    setIsImageUploaded(false);
  };
  const handleCreateShop = async () => {
    setIsLoading(true);
    try {
      const key = "accessTkn";
      const bearerToken = await SecureStore.getItemAsync(key);

      if (bearerToken) {
        const formData = new FormData();
        formData.append("name", shopData.name);
        formData.append("address", shopData.address);
        formData.append("shopType", shopData.shopType);
        formData.append("latitude", shopData.latitude);
        formData.append("longitude", shopData.longitude);
        formData.append("image", {
          uri: shopData.image,
          type: "image/jpeg",
          name: "image.jpg",
        });

        const createShopApiEndpoint = `${DEZ_OWNER_BASE_URL}/new/shop`;

        const response = await axios.post(createShopApiEndpoint, formData, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(response.data);
        setIsSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          setIsSuccess(false);
          setIsError(false);
          router.replace({ pathname: "/ordersScreen" });
        }, 2000);
      } else {
        console.error("Token not found in SecureStore");
        setIsError(true);
        setIsLoading(false);
        setTimeout(() => {
          setIsSuccess(false);
          setIsError(false);
          //SHOW ERROR DIALOG
          //...
        }, 2000);
      }
    } catch (error) {
      setIsError(true);
      console.error(error);
      setIsLoading(false);
      setTimeout(() => {
        setIsSuccess(false);
        setIsError(false);
        //SHOW ERROR DIALOG
        //...
      }, 2000);
    }
  };

  return (
    <ScrollView style={{ flexDirection: "column", flex: 1 }}>
      <View style={{ marginBottom: 20, flexDirection: "row" }}>
        <Pressable onPress={router.back}>
          <Image
            style={{ marginEnd: 10 }}
            source={require("../assets/images/back_icon.png")}
          />
        </Pressable>

        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Create Shop</Text>
      </View>

      {shopData.image !== "" ? (
        <Image
          source={{ uri: shopData.image }}
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

      <Text style={styles.label}>Shop Name</Text>
      <TextInput
        style={[styles.input]}
        value={shopData.name}
        onChangeText={(text) => setShopData({ ...shopData, name: text })}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={[styles.input]}
        value={shopData.address}
        onChangeText={(text) => setShopData({ ...shopData, address: text })}
      />

      <Text style={styles.label}>Shop Type</Text>
      <TextInput
        style={[styles.input]}
        value={shopData.shopType}
        onChangeText={(text) => setShopData({ ...shopData, shopType: text })}
      />

      <Text style={styles.label}>Latitude</Text>
      <TextInput
        style={[styles.input]}
        value={shopData.latitude}
        onChangeText={(text) => setShopData({ ...shopData, latitude: text })}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Longitude</Text>
      <TextInput
        style={[styles.input]}
        value={shopData.longitude}
        onChangeText={(text) => setShopData({ ...shopData, longitude: text })}
        keyboardType="numeric"
      />

      <View style={{ flex: 1, alignItems: "center", marginBottom: 10 }}>
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

      <Button title="Create Shop" onPress={handleCreateShop} />

      <View style={{ height: 40 }}></View>
      {isLoading || isSuccess || isError ? (
        <View style={styles.overlay} />
      ) : null}

      <CustomModal visible={isLoading} type="loading" msg="" />
      <CustomModal
        visible={isSuccess}
        type="success"
        msg="Shop created successfully"
      />
      <CustomModal visible={isError} type="error" msg="Failed to create shop" />
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
    marginHorizontal: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 8,
    marginHorizontal: 10,
  },
});

export default createShopPage;
