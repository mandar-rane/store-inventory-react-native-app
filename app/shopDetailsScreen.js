import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import axios from "axios";
// import { useSelector } from "react-redux";
import ShopAttribute from "../components/ShopAttribute";
import { useRouter,useFocusEffect } from "expo-router";
import MapViewComp from "../components/MapViewComp";
import * as SecureStore from "expo-secure-store";
import LottieView from "lottie-react-native";
import DEZ_OWNER_BASE_URL from "../utils/apiConfig";
const ShopDetailsScreen = () => {
  const [shopData, setShopData] = useState(null);
  const router = useRouter();
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShopDataFetched, setShopDataFetched] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log("resumed");
      fetchShopDetails();
    }, [])
  );

  const handleToProductScreenNav = () => {
    router.push({ pathname: "/productScreen" });
  };

  const handleUserDetailPress = () => {
    setIsExpanded(!isExpanded);
  };

  // const shopFromStore = useSelector((state) => state.shopReducer);

  const fetchShopDetails = async () => {
    try {
      const key = "accessTkn";
      const bearerToken = await SecureStore.getItemAsync(key);

      if (bearerToken) {
        const shopDetailsApiEndpoint = `${DEZ_OWNER_BASE_URL}/shop/details`;

        const response = await axios.get(shopDetailsApiEndpoint, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        setShopData(response.data.shop);
        setShopDataFetched(true);
        console.log(response.data.shop);
      } else {
        console.error("Token not found in SecureStore");
      }
    } catch (error) {
      console.error("Error retrieving token from SecureStore:", error);
    }
  };

  useEffect(() => {
    fetchShopDetails();
  }, []);

  return (
    <ScrollView style={{ flexDirection: "column", padding: 10 }}>
      <View
        style={{ marginBottom: 20, flexDirection: "row", alignItems: "center" }}
      >
        <Image
          style={{ marginEnd: 10 }}
          source={require("../assets/images/back_icon.png")}
        />
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>Your Shop</Text>
      </View>

      {isShopDataFetched ? (
        <View>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              flexDirection: "column",
              marginBottom: 20,
            }}
          >
            <Image
              source={{ uri: shopData.image.url }}
              style={{
                width: 200,
                height: 200,
                marginBottom: 14,
                resizeMode: "cover",
                borderRadius: 150,
              }}
            />

            <Text style={{ fontSize: 25 }}> {shopData.name.charAt(0).toUpperCase() + shopData.name.slice(1)}</Text>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/updateShopScreen",
                })
              }
            >
              <Text style={{ textDecorationLine: "underline" }}>
                Update Details
              </Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: "column" }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <ShopAttribute
                attribute="Address"
                attributeValue={shopData.address}
              />

              <ShopAttribute
                attribute="Shop Type"
                attributeValue={shopData.shopType}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <ShopAttribute
                attribute="Rating"
                attributeValue={shopData.averageRating}
              />

              <ShopAttribute
                attribute="Products"
                attributeValue={shopData.totalProducts}
              />
            </View>

            <Pressable
              onPress={handleToProductScreenNav}
              style={{
                marginBottom: 20,
                flexDirection: "column",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 5,
                backgroundColor: "#ffffff",
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  width: "100%",

                  padding: 10,
                  flexDirection: "row",

                  height: 50,
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../assets/images/product_icon.png")}
                  style={{
                    height: 20,
                    marginEnd: 8,
                    width: 20,
                    resizeMode: "cover",
                  }}
                />

                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginEnd: 8 }}
                >
                  Products
                </Text>
                <Image
                  source={require("../assets/images/back_icon.png")}
                  style={{
                    height: 20,
                    marginEnd: 8,
                    width: 20,
                    resizeMode: "cover",
                    transform: [{ rotate: "180deg" }],
                  }}
                />
              </View>
            </Pressable>
            <Pressable
              onPress={handleUserDetailPress}
              style={{
                marginBottom: 20,
                flexDirection: "column",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 5,
                backgroundColor: "#ffffff",
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  width: "100%",
                  padding: 10,
                  flexDirection: "row",
                  height: 50,
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../assets/images/user_icon.png")}
                  style={{
                    height: 20,
                    marginEnd: 8,
                    width: 20,
                    resizeMode: "cover",
                  }}
                />

                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginEnd: 6 }}
                >
                  Owner Details
                </Text>
                <Image
                  source={require("../assets/images/back_icon.png")}
                  style={{
                    height: 20,
                    marginEnd: 8,
                    width: 20,
                    resizeMode: "cover",
                    transform: isExpanded
                      ? [{ rotate: "90deg" }]
                      : [{ rotate: "270deg" }],
                  }}
                />
              </View>
              {isExpanded && (
                <View
                  style={{
                    padding: 10,
                    borderTopWidth: 1,
                    borderTopColor: "#ccc",
                  }}
                >
                  {/* Add more user details here */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text>Name: {shopData.shopOwner.name}</Text>
                    <Image
                      style={{ width: 18, height: 18 }}
                      source={require("../assets/images/pencil_icon.png")}
                    />
                  </View>

                  <Text>Phone: {shopData.shopOwner.phone}</Text>
                  {/* Add more user details as needed */}
                </View>
              )}
            </Pressable>

            <View
              onPress={handleToProductScreenNav}
              style={{
                flexDirection: "column",
                shadowColor: "#000",
                padding: 10,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 5,
                backgroundColor: "#ffffff",
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  marginBottom: 10,
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../assets/images/map_icon.png")}
                  style={{
                    height: 20,
                    marginEnd: 8,
                    width: 20,
                    resizeMode: "cover",
                  }}
                />

                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginEnd: 8 }}
                >
                  Shop Location
                </Text>
              </View>
              <MapViewComp shop={shopData} />
            </View>
          </View>
          <View style={{ height: 40 }} />
        </View>
      ) : (
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: screenWidth,
            height: screenHeight - 150,
          }}
        >
          <LottieView
            source={require("../assets/anims/orders_search_anim.json")}
            style={{
              marginEnd: 16,
              height: 250,
              width: 250,
            }}
            autoPlay={true}
            loop={true}
            speed={1}
          />

          <Text style={{ fontStyle: "italic", fontSize: 20 }}>
            Fetching Shop Details...
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ShopDetailsScreen;
