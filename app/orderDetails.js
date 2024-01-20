import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { Stack, useRouter, Link, useGlobalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import OrderMetadata from "../components/OrderMetadata";
import OrderProduct from "../components/OrderProduct";

const orderDetails = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const { orderId } = useGlobalSearchParams();

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `https://dzo.onrender.com/api/vi/shop/owner/shop/order/${orderId}`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzFmMjE5ZjJjYTA1NGIwNjQ3NzUiLCJpYXQiOjE3MDQ1NzU0NzR9.9Q3tc2QcLs9d5jVG4sF3bER9DR7JHdmieOd8NI5qeMw",
          },
        }
      );
      setOrderDetails(response.data.order);
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
    <View style={{ padding: 10, backgroundColor: "#f6f8fc",flex:1}}>
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
                source={require("dezdash/assets/images/dezdash_icon.png")}
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
                backgroundColor: "#636E72",
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
                backgroundColor: "#636E72",
                marginHorizontal: 12,
              }}
            />
          </View>
        </View>
      </View>

      <View
        style={{
          alignItems: "center",
          marginBottom: 20,
          borderRadius: 10,
          borderColor: "black",
          borderWidth: 1
          
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

      <View
        style={{
          
          backgroundColor: "#ffffff",
          alignSelf: "baseline",
          width: "100%",
          padding: 10,
          borderRadius: 10,
          borderColor: "black",
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

      {/* <View>
      <Text>Order ID: {orderDetails._id}</Text>
      <Text>User: {orderDetails.user.username} ({orderDetails.user.phone})</Text>
      
      <FlatList
        data={orderDetails.orderItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
            <Text>Selected Customization: {item.selectedCustomisations[0].options[0].optionName}</Text>
          </View>
        )}
      />

      <Text>Order Addons:</Text>
      <FlatList
        data={orderDetails.orderAddOns}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.addOn.name}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Total Price: {item.totalPrice}</Text>
          </View>
        )}
      />

      <Text>Order Status: {orderDetails.orderStatus}</Text>
    </View> */}
    <View style={{position:"absolute", bottom:0, left:0, margin:18, flexDirection:"column", gap:-10, width:"100%", alignItems:"center"}}>
      <Text style={{fontSize: 36, fontWeight:"bold", fontStyle:"italic", color:"#808080"}}>DezDash</Text>
      <Text style={{fontSize: 20, fontWeight:"bold", fontStyle:"italic", color:"#808080"}}>by dezerto</Text>
      </View>
    </View>
  );
};

export default orderDetails;
