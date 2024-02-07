import {
  Stack,
  useRouter,
  Link,
  useGlobalSearchParams,
  useFocusEffect,
} from "expo-router";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Product from "../components/Product";
import { ScrollView } from "react-native-gesture-handler";

const productScreen = () => {
  const router = useRouter();
  const { token } = useGlobalSearchParams();
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      console.log("resumed");
      fetchProducts();
    }, [])
  );

  const renderGridItem = ({ item, index }) => (
    <View
      style={[
        styles.gridItem,
        { backgroundColor: getCategoryColor(item), flexDirection: "row" },
      ]}
    >
      <Text>{item}</Text>
    </View>
  );

  const fetchProducts = async () => {
    try {
      const key = "accessTkn";
      const bearerToken = await SecureStore.getItemAsync(key);

      if (bearerToken) {
        const productsApiEndpoint =
          "https://dzo.onrender.com/api/vi/shop/owner/shop/products/all";

        const response = await axios.get(productsApiEndpoint, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        if (response.data.success) {
          const organizedProducts = organizeProdByCtg(response.data.products);
          const uniqueCategories = [
            ...new Set(
              response.data.products.map((product) => product.category)
            ),
          ];
          setProductCategories(uniqueCategories);
          setProducts(organizedProducts);
        } else {
          console.error("Failed to fetch products");
        }
      } else {
        console.error("Token not found in SecureStore");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getCategoryColor = (category) => {
    const colorMap = {
      cupcake: "#faedcb",
      cake: "#c9e4de",
      brownie: "#c6def1",
      donut: "#dbcdf0",
      shake: "#f2c6de",
      waffle: "#f7d9c4",
      coffee: "#ffd6a5",
      Mousse: "#fdebeb",
      cookie: "fadde1",
      tiramisu: "f6eee9",
    };
    return colorMap[category] || "#cde8e6";
  };

  // const getCategoryIcon = (category) => {
  //   const iconMap = {
  //     'cupcake': 'back_icon.png',
  //     'cake': 'back_icon.png',
  //   };
  //   return iconMap[category] || '';
  // };

  const organizeProdByCtg = (products) => {
    const organizedProds = {};
    products.forEach((product) => {
      const category = product.category;
      if (!organizedProds[category]) {
        organizedProds[category] = [];
      }
      organizedProds[category].push(product);
    });
    console.log(productCategories);
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
        stock={item.stock}
      />
    </Pressable>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 10 }}>
        <View
          style={{
            marginBottom: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable onPress={router.back}>
            <Image
              style={{ marginEnd: 10 }}
              source={require("../assets/images/back_icon.png")}
            />
          </Pressable>

          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Your Products
          </Text>
        </View>

        <View
          style={{
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
              marginHorizontal: 8,
            }}
          />
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Product Categories
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
        <FlatList
          data={productCategories}
          renderItem={renderGridItem}
          keyExtractor={(item) => item}
          numColumns={3}
        />

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
        <View style={{ height: 80 }} />
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() =>
          router.push({
            pathname: "/addProductScreen",
          })
        }
      >
        <Image source={require("../assets/images/add_icon.png")} />
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
  },

  gridItem: {
    flex: 1,
    margin: 4,
    padding: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default productScreen;
