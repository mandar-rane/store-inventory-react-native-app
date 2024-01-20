import react from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";

const OrderMetadata = ({
  orderID,
  custUsername,
  custPhone,
  orderStatus,
  orderTotal,
  orderDate,
}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#ffffff",
        alignSelf: "baseline",
        width: "100%",
        padding: 10,
        borderRadius: 20,
      }}
    >
      <View>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Order Info</Text>
      </View>

      <View
        style={{
          borderBottomColor: "#636E72",
          borderBottomWidth: 1,
          marginBottom: 4,
        }}
      />

      <View style={{ flexDirection: "row", marginBottom: 2 }}>
        <View style={{ width: "30%" }}>
          <Text>Order#</Text>
        </View>
        <View style={{ width: "70%", alignItems: "flex-end" }}>
          <Text>{orderID}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", marginBottom: 2 }}>
        <View style={{ width: "30%" }}>
          <Text>Order Status</Text>
        </View>
        <View style={{ width: "70%", alignItems: "flex-end" }}>
          <Text>{orderStatus}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", marginBottom: 2 }}>
        <View style={{ width: "30%" }}>
          <Text>Order Total</Text>
        </View>
        <View style={{ width: "70%", alignItems: "flex-end" }}>
          <Text>{orderTotal}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", marginBottom: 4 }}>
        <View style={{ width: "30%" }}>
          <Text>Order Placed </Text>
        </View>
        <View style={{ width: "70%", alignItems: "flex-end" }}>
          <Text>{orderDate}</Text>
        </View>
      </View>

      <View>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
          Customer Info
        </Text>
      </View>
      <View
        style={{
          borderBottomColor: "#636E72",
          borderBottomWidth: 1,
          marginBottom: 4,
        }}
      />

      <View style={{ flexDirection: "row", marginBottom: 2 }}>
        <View style={{ width: "50%" }}>
          <Text>Username</Text>
        </View>
        <View style={{ width: "50%", alignItems: "flex-end" }}>
          <Text>{custUsername}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "50%" }}>
          <Text>Phone Num</Text>
        </View>
        <View style={{ width: "50%", alignItems: "flex-end" }}>
          <Text>{custPhone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderMetadata;
