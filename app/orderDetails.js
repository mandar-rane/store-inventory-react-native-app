import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Stack, useRouter, Link, useGlobalSearchParams } from "expo-router";

import OrderMetadata from "../components/OrderMetadata";
import OrderProduct from "../components/OrderProduct";
import * as SecureStore from "expo-secure-store";
import DEZ_OWNER_BASE_URL from "../utils/apiConfig";

const orderDetails = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const { orderId } = useGlobalSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const key = "accessTkn";
      const bearerToken = await SecureStore.getItemAsync(key);

      if (bearerToken) {
        const orderDetailsApiEndpoint = `${DEZ_OWNER_BASE_URL}/shop/order/${orderId}`;

        const response = await axios.get(orderDetailsApiEndpoint, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        console.log(response.data.order);
        setOrderDetails(response.data.order);
      } else {
        console.error("Token not found in SecureStore");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);
  if (!orderDetails) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 10, backgroundColor: "#f6f8fc" }}>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ width: "10%" }}>
            <Image source={require("../assets/images/back_icon.png")} />
          </View>
          <View
            style={{
              width: "80%",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 2,
                flexDirection: "row",
                alignItems: "center",
                gap: -2,
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
              >
                DezDash
              </Text>
              <Image
                style={{ width: 30, height: 30, resizeMode: "contain" }}
                source={require("../assets/images/dezdash_icon.png")}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 30,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "#bdbdbd",
                marginHorizontal: 12,
              }}
            />
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Order Details
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "#bdbdbd",
                marginHorizontal: 12,
              }}
            />
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#ffffff",
          alignSelf: "baseline",
          width: "100%",
          padding: 10,
          borderRadius: 10,
          borderColor: "#bdbdbd",
          borderWidth: 1,
          shadowColor: "#000",
        }}
      >
        <View style={{ flexDirection: "row", marginBottom: 2 }}>
          <Text style={{ marginEnd: 5 }}>Order#</Text>
          <Text>{orderDetails._id}</Text>
        </View>

        <View style={{ padding: 5 }}>
          <FlatList
            style={{ marginTop: 4 }}
            data={orderDetails.orderItems}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <OrderProduct
                url={item.image}
                name={item.name}
                qty={item.quantity}
                price={item.price}
                customizations={item.selectedCustomisations}
              />
              //   <View>
              //     <Text>{item.name}</Text>
              //     <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
              //     <Text>Selected Customization: {item.selectedCustomisations[0].options[0].optionName}</Text>
              //   </View>
            )}
          />
        </View>
      </View>
      <View style={{ height: 20 }} />

      <View
        style={{
          alignItems: "center",
          marginBottom: 20,
          borderRadius: 10,
          borderColor: "#bdbdbd",
          borderWidth: 1,
        }}
      >
        <OrderMetadata
          orderID={orderDetails._id}
          custUsername={orderDetails.user.username}
          custPhone={orderDetails.user.phone}
          orderStatus={orderDetails.orderStatus}
          orderTotal={orderDetails.orderTotal}
          orderDate={orderDetails.createdAtDate}
        />
      </View>
    </ScrollView>
  );
};

export default orderDetails;
