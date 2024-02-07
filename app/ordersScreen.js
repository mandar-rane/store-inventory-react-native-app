import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  SectionList,
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
// import { setShopDetails } from "../redux/actions/shopActions";
import Order from "../components/Order";
// import LottieView from "lottie-react-native";
import * as SecureStore from "expo-secure-store";
import LottieView from "lottie-react-native";

const OrdersScreen = () => {
  const router = useRouter();
  const screenHeight = Dimensions.get("window").height;
  const [orders, setOrders] = useState([]);
  const [shopData, setShopData] = useState({
    name: "",
    image: { url: "", key: "" },
    shopOwner: { name: "" },
  });
  const [areOrdersRecieved, setAreOrdersRecieved] = useState(false);
  const [isShopDataRecieved, setShopDataRecieved] = useState(false);

  const dispatch = useDispatch();

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
          "https://dzo.onrender.com/api/vi/shop/owner/shop/details";

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
          "https://dzo.onrender.com/api/vi/shop/owner/shop/orders/all";

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

  // if (!orders) {
  //   return <Text>LOL</Text>;
  // }

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
            source={require("dezdash/assets/images/shop_icon.png")}
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
            source={require("dezdash/assets/images/dezdash_icon.png")}
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
            <Image
              style={{ width: 30, height: 30, resizeMode: "contain" }}
              source={require("dezdash/assets/images/user_icon.png")}
            />
          </Pressable>
        </View>
      </View>

      {!areOrdersRecieved && !isShopDataRecieved ? (
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
                {shopData.name}
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
                backgroundColor: "#ffffff",
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
            height: { screenHeight },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LottieView
            source={require("../assets/anims/Animation - 1707254612486.json")}
            style={{ height: 500, width: 500, transform: [{ scale: 1.8 }] }}
            autoPlay={true}
            loop={true}
            speed={1}
          />
        </View>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

export default OrdersScreen;
