import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  SectionList,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Stack, useRouter, Link, useGlobalSearchParams } from "expo-router";
import { useDispatch } from "react-redux";
import { setShopDetails } from "../redux/actions/shopActions";
import Order from "../components/Order";

const OrdersScreen = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const dispatch = useDispatch();

  const handleSetShopDetails = (item) => {
    dispatch(setShopDetails(item));
  };

  useEffect(() => {
    const bearerToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzFmMjE5ZjJjYTA1NGIwNjQ3NzUiLCJpYXQiOjE3MDQ1NzU0NzR9.9Q3tc2QcLs9d5jVG4sF3bER9DR7JHdmieOd8NI5qeMw";

    const shopDetailsApiEndpoint =
      "https://dzo.onrender.com/api/vi/shop/owner/shop/details";

    axios
      .get(shopDetailsApiEndpoint, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
      .then((response) => {
        handleSetShopDetails(response.data.shop);
      })
      .catch((error) => {
        console.error("Error fetching shop details:", error);
      });

    const fetchAllOrdersApiEndpoint =
      "https://dzo.onrender.com/api/vi/shop/owner/shop/orders/all";

    axios
      .get(fetchAllOrdersApiEndpoint, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
      .then((response) => {
        setOrders(response.data.orders);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  const renderOrderItem = ({ item }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/orderDetails",
          params: { orderId: item._id },
        })
      }
    >
      <Order
        orderId={item._id}
        orderTotal={item.orderTotal}
        orderDate={item.createdAtDate}
        orderImage={item.orderItems[0].image}
        itemQty={item.orderItems.length}
        orderStatus={item.orderStatus}
      />
    </Pressable>
  );
  
  const ordersByStatus = orders.reduce((acc, order) => {
    const status = order.orderStatus.toLowerCase();
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(order);
    return acc;
  }, {});

  const sections = Object.keys(ordersByStatus)
    .sort((a, b) => {
      // Specify the desired order
      const order = ['placed', 'delivered', 'cancelled'];
      return order.indexOf(a) - order.indexOf(b);
    })
    .map((status) => ({
      title: status.toUpperCase(),
      data: ordersByStatus[status],
    }));
  
    if(!orders){

      return(
        <Text>LOL</Text>
      )
    }

  return (
    <ScrollView
      style={{ flexDirection: "column", padding: 10, backgroundColor: "white" }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          marginBottom: 30,
        }}
      >
        <View style={{ flex: 1 }}>
          <Image
            style={{ width: 30, height: 30, resizeMode: "contain" }}
            source={require("dezdash/assets/images/shop_icon.png")}
          />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: -2,
          }}
        >
          <Text
            style={{ fontSize: 25, fontWeight: "bold", fontStyle: "italic" }}
          >
            DezDash
          </Text>
          <Image
            style={{ width: 25, height: 25, resizeMode: "contain" }}
            source={require("dezdash/assets/images/dezdash_icon.png")}
          />
        </View>

        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Image
            style={{ width: 30, height: 30, resizeMode: "contain" }}
            source={require("dezdash/assets/images/user_icon.png")}
          />
        </View>
      </View>

      <View
        style={{ flexDirection: "row", flex: 1, marginBottom: 30, height: 100 }}
      >
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/shopDetailsScreen",
            })
          }
          style={{
            margin: 10,
            justifyContent: "center",
            height: 100,
            width: 100,
        
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            borderColor: "#bdbdbd",
            borderWidth: 1,
            borderRadius: 25,
          
          }}
        >
          <Image
            source={require("dezdash/assets/images/shop_icon_colored.png")}
            style={{ height: 50, width: 50, marginBottom: 10 }}
          />
          <Text style={{ fontWeight: "bold" }}>Manage Shop</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/productScreen",
            })
          }
          style={{
            margin: 10,
            justifyContent: "center",
            height: 100,
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            backgroundColor:"#ffffff",
            borderRadius: 25,
            borderColor: "#bdbdbd",
            borderWidth: 1,
          }}
        >
          <Image
            source={require("dezdash/assets/images/shop_cart_icon.png")}
            style={{ height: 50, width: 50, marginBottom: 10 }}
          />
          <Text style={{ fontWeight: "bold" }}>Manage Products</Text>
        </Pressable>
      </View>

      <View
        style={{ marginTop: 16,flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <View
          style={{
            
            flex: 1,
            height: 1,
            backgroundColor: "#abb7b7",
            marginHorizontal: 5,
          }}
        />
        <View>
        <Text
          style={{
            marginHorizontal: 16,
            
            fontSize: 24,
            fontWeight: "bold",
          
          }}
        >
          My Orders
        </Text>
        </View>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: "#abb7b7",
            marginHorizontal: 5,
          }}
        />
      </View>
      

      <View
        style={{
          
          flexDirection: "column",
          marginTop: 5,

          borderRadius: 25,
          borderColor: "#bdbdbd",
          borderWidth: 1,
        }}
      >
        

        <SectionList
          sections={sections}
          keyExtractor={(item) => item._id}
          renderItem={renderOrderItem}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{width:"100%", alignItems:"center", marginVertical:10}}>

            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{title} ORDERS</Text>

            </View>
          )}
        />
      </View>

      <View style={{height:20}}/>
    </ScrollView>
  );
};

export default OrdersScreen;
