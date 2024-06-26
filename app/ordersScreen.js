import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  SectionList,
  Button,
 
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
// import { setShopDetails } from "../redux/actions/shopActions";
import Order from "../components/Order";
import { usePushNotifications } from "../utils/NotifService";
import * as SecureStore from "expo-secure-store";
import LottieView from "lottie-react-native";
import DEZ_OWNER_BASE_URL from "../utils/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersScreen = () => {
  const router = useRouter();
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const [orders, setOrders] = useState([]);
  const [areOrdersRecieved, setAreOrdersRecieved] = useState(false);
  const [isShopDataRecieved, setShopDataRecieved] = useState(false);
  const [shopData, setShopData] = useState({
    name: "",
    image: { url: "", key: "" },
    shopOwner: { name: "" },
  });
  const dispatch = useDispatch();
  const { expoPushToken, notification } = usePushNotifications();

  const handleSetShopDetails = (item) => {
    setShopData(item);
    // dispatch(setShopDetails(item));
  };

  const fetchShopDetails = async () => {
    try {
      const key = "accessTkn";
      const bearerToken = await SecureStore.getItemAsync(key);

      if (bearerToken) {
        const shopDetailsApiEndpoint =
          `${DEZ_OWNER_BASE_URL}/shop/details`;

        axios
          .get(shopDetailsApiEndpoint, {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          })
          .then((response) => {
            setShopDataRecieved(true);
            handleSetShopDetails(response.data.shop);
            console.log(response.data.shop);
          })
          .catch((error) => {
            console.error("Error fetching shop details:", error);
          });
      } else {
        console.error("Token not found in SecureStore");
      }
    } catch (error) {
      console.error("Error retrieving token from SecureStore:", error);
    }
  };

  const fetchAllOrders = async () => {
    try {
      const key = "accessTkn";
      const bearerToken = await SecureStore.getItemAsync(key);

      if (bearerToken) {
        const fetchAllOrdersApiEndpoint =
        `${DEZ_OWNER_BASE_URL}/shop/orders/all`;;

        axios
          .get(fetchAllOrdersApiEndpoint, {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          })
          .then((response) => {
            setAreOrdersRecieved(true);
            setOrders(response.data.orders);
          })
          .catch((error) => {
            console.error("Error fetching orders:", error);
          });
      } else {
        console.error("Token not found in SecureStore");
      }
    } catch (error) {
      console.error("Error retrieving token from SecureStore:", error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    fetchShopDetails();
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
      const order = ["placed", "delivered", "cancelled"];
      return order.indexOf(a) - order.indexOf(b);
    })
    .map((status) => ({
      title: status.toUpperCase(),
      data: ordersByStatus[status],
    }));

  return (
    <ScrollView style={{ flexDirection: "column", backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          {/* <Image
            style={{ width: 30, height: 30, resizeMode: "contain" }}
            source={require("../assets/images/shop_icon.png")}
          /> */}
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
            source={require("../assets/images/dezdash_icon.png")}
          />
        </View>

        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/createShopScreen",
              })
            }
          >
            {/* <Image
              style={{ width: 30, height: 30, resizeMode: "contain" }}
              source={require("../assets/images/user_icon.png")}
            /> */}
          </Pressable>
        </View>
      </View>

      {areOrdersRecieved && isShopDataRecieved ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#c8f1ec",
              alignItems: "center",
              padding: 10,
              marginBottom: 10,
            }}
          >
            <Image
              style={{
                width: 75,
                height: 75,
                resizeMode: "cover",
                borderRadius: 50,
                marginEnd: 10,
              }}
              source={{ uri: shopData.image.url }}
            />
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {shopData.name.charAt(0).toUpperCase() + shopData.name.slice(1)}
              </Text>
              <Text>Welcome {shopData.shopOwner.name}</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              flex: 1,
              marginBottom: 30,
              height: 100,
            }}
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
                source={require("../assets/images/shop_icon_colored.png")}
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
                backgroundColor: "#ffffff",
                borderRadius: 25,
                borderColor: "#bdbdbd",
                borderWidth: 1,
              }}
            >
              <Image
                source={require("../assets/images/shop_cart_icon.png")}
                style={{ height: 50, width: 50, marginBottom: 10 }}
              />
              <Text style={{ fontWeight: "bold" }}>Manage Products</Text>
            </Pressable>
          </View>

          <View
            style={{
              marginTop: 16,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
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
              margin: 10,
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
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {title} ORDERS
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: screenWidth,
            height: screenHeight -100,
          }}
        >
          <LottieView
            source={require("../assets/anims/orders_search_anim.json")}
            style={{
             
              height:250,
              width:250,
              
        
            }}
            autoPlay={true}
            loop={true}
            speed={1}
          />

          <Text style={{fontStyle:"italic", fontSize:20}}>Fetching Orders...</Text>
        </View>
      )}

      <View style={{ height: 40 }} />
      <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push toen: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>

    </View>
    </ScrollView>
  );
};

export default OrdersScreen;
