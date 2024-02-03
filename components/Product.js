import react from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";

const Product = ({
  url,
  productName,
  productPrice,
  vegnonveg,
  isCustomizable,
  stock,
}) => {
  const renderVegSymbol = () => {
    if (vegnonveg === "veg") {
      return (
        <Image
          style={{ height: 30, width: 30 }}
          source={require("../assets/images/veg_icon.png")}
        />
      );
    } else if (vegnonveg === "nonveg") {
      return (
        <Image
          style={{ height: 30, width: 30 }}
          source={require("../assets/images/nveg_icon.png")}
        />
      );
    }
    return null;
  };

  const renderCustomizable = () => {
    if (isCustomizable === 0) {
      return null;
    } else if (isCustomizable === 1) {
      return <Text>customizable</Text>;
    }

    return null;
  };

  const renderStock = () => {
    if (stock === 0) {
      return <Text style={{ color: "red" }}>Out of Stock</Text>;
    } else if (stock !== 0 && !isNaN(stock)) {
      return <Text style={{ color: "green" }}>In Stock: {stock}</Text>;
    }else{
      return <Text style={{ color: "red" }}>Out of Stock</Text>;
    }
  };

  return (
    <View
      style={{
        elevation: 5,
        marginBottom: 10,
        flexDirection: "column",
        borderWidth: 1,
        borderColor: "#abb7b7",
        borderRadius: 16,
        backgroundColor: "#ffffff",
      }}
    >
      <Image
        source={{ uri: url }}
        style={{
          height: 200,
          width: "100%",
          resizeMode: "cover",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      />
      <View style={{ flexDirection: "column", padding: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{productName}</Text>
        <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
          <Text style={{ fontSize: 22, flex: 1 }}>${productPrice}</Text>
          {renderVegSymbol()}
        </View>
        {renderCustomizable()}
        {renderStock()}
      </View>
    </View>
  );
};

export default Product;
