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
  };
};

const trailTextMapping = (attr) => {
  switch (attr.toLowerCase()) {
    case "rating":
      return "/5 Stars";
    case "products":
      return " Total";
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
        height: 80,
        width: 60,
        flex: 1,
        
        padding: 10,
        alignItems: "start",
        justifyContent: "center",
        borderRadius: 15,
        margin: 10,
        backgroundColor:"#ffffff",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 5
    
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "start", width:"100%" }}>
        <View style={{ padding: 5, backgroundColor: "#82e6f4", borderRadius: 6, marginEnd:4 }}>
          <Image
            source={attributeIconMapping(attribute)}
            style={{ height: 20, width: 20, resizeMode: "cover" }}
          />
        </View>

        <Text style={{ fontSize: 17, fontWeight: "bold"}}> {attribute}</Text>
      </View>
      <View style={{ width: "100%", alignItems: "start", marginTop:4}}>
        <Text style={{ fontSize: 16 }}>{attributeValue}{trailTextMapping(attribute)}</Text>
      </View>
    </View>
  );
};

export default ShopAttribute;
