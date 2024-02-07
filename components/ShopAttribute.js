import React from "react";
import { View, Image, Text } from "react-native";

const attributeIconMapping = (attr) => {
  switch (attr.toLowerCase()) {
    case "address":
      return require("../assets/images/location_icon.png");
    case "rating":
      return require("../assets/images/rating_icon.png");
    case "products":
      return require("../assets/images/product_icon.png");
    case "shoptype":
      return require("../assets/images/shop_icon_1.png"); // Default image
    default:
      return require("../assets/images/shop_icon_1.png");
  }
};

const trailTextMapping = (attr) => {
  switch (attr.toLowerCase()) {
    case "rating":
      return "/5 Stars";
    case "products":
      return "";
    default:
      return "";
  }
};

const ShopAttribute = ({ attribute, attributeValue }) => {
  // Additional text based on the attribute

  return (
    <View
      style={{
        flexDirection: "column",

        width: 150,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        padding: 16,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
      }}
    >
      <Image
        source={attributeIconMapping(attribute)}
        style={{ height: 30, width: 30, resizeMode: "cover", marginBottom: 4 }}
      />

      <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: "bold" }}>
        {attributeValue}
        {trailTextMapping(attribute)}
      </Text>
      <Text style={{ fontSize: 14 }}> {attribute}</Text>
    </View>
  );
};

export default ShopAttribute;
