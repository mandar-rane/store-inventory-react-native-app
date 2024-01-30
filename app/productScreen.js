import { Stack, useRouter, Link, useGlobalSearchParams } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Product from "../components/Product";
import { ScrollView } from "react-native-gesture-handler";

const productScreen = () => {
  const router = useRouter();
  const { token } = useGlobalSearchParams();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://dzo.onrender.com/api/vi/shop/owner/shop/products/all",
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzFmMjE5ZjJjYTA1NGIwNjQ3NzUiLCJpYXQiOjE3MDQ1NzU0NzR9.9Q3tc2QcLs9d5jVG4sF3bER9DR7JHdmieOd8NI5qeMw",
            },
          }
        );
        if (response.data.success) {
          const organizedProducts = organizeProdByCtg(response.data.products);
          setProducts(organizedProducts);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const organizeProdByCtg = (products) => {
    const organizedProds = {};

    products.forEach((product) => {
      const category = product.category;

      if (!organizedProds[category]) {
        organizedProds[category] = [];
      }

      organizedProds[category].push(product);
    });

    return organizedProds;
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/productDetail",
          params: { productId: item._id },
        })
      }
    >
      <Product
        url={item.image.url}
        productName={item.name}
        productPrice={item.price}
        vegnonveg={item.vegnonveg}
        isCustomizable={item.productCustomisations.length}
      />
    </Pressable>
  );

  return (
    <View style={{ flex:1 }}>
      <ScrollView style={{padding:10}}>
      <View style={{marginBottom:20, flexDirection:"row"}}>
        <Image style={{marginEnd:10}} source={require("../assets/images/back_icon.png")}/>
        <Text style={{fontSize: 24, fontWeight:"bold"}}>Your Products</Text>
        
      </View>

      
        {Object.keys(products).map((category) => (
          <FlatList
            key={category}
            data={products[category]}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            ListHeaderComponent={() => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 24,
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#abb7b7",
                    marginHorizontal: 8,
                  }}
                />
                <View>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {category.toUpperCase() + "S"}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#abb7b7",
                    marginHorizontal: 8,
                  }}
                />
              </View>
            )}
          />
        ))}
        <View style={{ height: 20 }} />

        
      </ScrollView>
      <TouchableOpacity
          style={styles.floatingButton}
          onPress={() =>
            router.push({
              pathname: "/addProductScreen",
            })
          }
        >
          <Image source={require('../assets/images/add_icon.png')} />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 20, 
    right: 20, 
    backgroundColor: "#04cde9", 
    padding: 10,
    borderRadius: 30, 
  }
});
export default productScreen;
