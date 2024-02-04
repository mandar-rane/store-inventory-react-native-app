import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "placed":
      return "#daa520";
    case "cancelled":
      return "#CC2936";
    case "delivered":
      return "#378805";
    case "otw":
      return "#ff6701";
    default:
      return "#ededed"; // Default color
  }
};

const Order = ({
  orderId,
  orderTotal,
  orderDate,
  orderImage,
  itemQty,
  orderStatus,
}) => {
  // Format the date using moment
  const formattedDate = orderDate;

  return (
    <View>
      <View>
        <View
          style={{
            padding: 10,

            flexDirection: "row",
            borderTopWidth: 1,
            borderTopColor: "#bdbdbd",
          }}
        >
          <View style={{ width: "45%" }}>
            <Text
              numberOfLines={1}
              style={{
                marginBottom: 8,
                width: 150,
                fontWeight: "bold",
                color: "#2D3436",
              }}
            >
              Order# {orderId}
            </Text>
            <TouchableOpacity
              style={{
                marginBottom: 8,
                borderRadius: 6,
                height: 30,
                width: 90,
                padding: 4,
                backgroundColor: getStatusColor(orderStatus),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#FFF" }}>
                {orderStatus.toUpperCase()}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                marginBottom: 3,
                fontWeight: "bold",
                color: "#636E72",
              }}
            >
              {formattedDate}
            </Text>
            <Text
              style={{
                marginBottom: 6,
                fontWeight: "bold",
                color: "#ed7014",
              }}
            >
              {itemQty} ITEM(S)
            </Text>
            <Text>Total: ${orderTotal}</Text>
          </View>
          <View
            style={{
              width: "45%",
              alignItems: "end",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Image
              source={{ uri: orderImage }}
              style={{ width: 55, height: 55, borderRadius: 10 }}
            />
          </View>
          <View
            style={{
              width: "10%",
              justifyContent: "center",
              alignItems: "start",
              transform: [{ rotate: "180deg" }],
            }}
          >
            <Image
              source={require("dezdash/assets/images/back_icon.png")}
              style={{ width: 20, height: 20, borderRadius: 10 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Order;
