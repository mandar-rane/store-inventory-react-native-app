import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import ShopAttribute from "../components/ShopAttribute";
import { Stack, useRouter, Link } from "expo-router";


const ShopDetailsScreen = () => {
  const [shopData, setShopData] = useState(null);
  const router = useRouter();

  const handleToProductScreenNav = () =>{
    router.push({ pathname: "/productScreen" });
  }

  // const shopFromStore = useSelector((state) => state.shopReducer);

  useEffect(() => {
    const apiUrl = "https://dzo.onrender.com/api/vi/shop/owner/shop/details";
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzFmMjE5ZjJjYTA1NGIwNjQ3NzUiLCJpYXQiOjE3MDQ1NzU0NzR9.9Q3tc2QcLs9d5jVG4sF3bER9DR7JHdmieOd8NI5qeMw";

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShopData(response.data.shop);
      })
      .catch((error) => {
        console.error("Error fetching shop details:", error);
      });
  }, []);

  if (!shopData) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: "column", padding: 16, flex:1 }}>
      
      <View style={{marginBottom:20, flexDirection:"row"}}>
        <Image style={{marginEnd:10}} source={require("../assets/images/back_icon.png")}/>
        <Text style={{fontSize: 24, fontWeight:"bold"}}>Your Shop</Text>
        
      </View>


      
      <View
        style={{
          width: "100%",
          alignItems: "center",
          flexDirection: "column",
          marginBottom: 16,
        }}
      >
        <Image
          source={{ uri: shopData.image }}
          style={{
            width: 200,
            height: 200,
            marginBottom: 14,
            resizeMode: "cover",
            borderRadius: 150,
          }}
        />

        <Text style={{ fontSize: 25 }}> {shopData.name}</Text>
      </View>
      <View style={{ flexDirection: "column" }}>
        <TouchableOpacity
          onPress={handleToProductScreenNav}

          style={{
            width:"100%",
            borderRadius: 10,
            
            padding: 10,
            flexDirection: "row",
            backgroundColor: "#ffffff",
            height: 50,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 5,
    
            
            marginBottom:10,

          }}
        >
          <View
            style={{
              padding: 5,
              alignSelf:"start",
              backgroundColor: "#82e6f4",
              borderRadius: 6,
              marginEnd: 10,
            }}
          >
            <Image
              source={require("../assets/images/product_icon.png")}
              style={{ height: 20, width: 20, resizeMode: "cover" }}
            />
          </View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            View Products
          </Text>
        
          
        </TouchableOpacity>

        <View style={{flexDirection: "row", width:"100%", justifyContent:"space-evenly", gap:10, marginBottom:10 }}>
          <ShopAttribute
  
            attribute="Address"
            attributeValue={shopData.address}
          />

          <ShopAttribute
            attribute="Shop Type"
            attributeValue={shopData.shopType}
          />
        </View>

        <View style={{ flexDirection: "row", width:"100%", justifyContent:"space-evenly", gap:10  }}>
          <ShopAttribute
            attribute="Rating"
            attributeValue={shopData.averageRating}
          />

          <ShopAttribute
            attribute="Products"
            attributeValue={shopData.totalProducts}
          />
        </View>
      </View>
      <View style={{position:"absolute", bottom:0, left:0, margin:18, flexDirection:"column", gap:-10, width:"100%", alignItems:"center"}}>
      <Text style={{fontSize: 36, fontWeight:"bold", fontStyle:"italic", color:"#808080"}}>DezDash</Text>
      <Text style={{fontSize: 20, fontWeight:"bold", fontStyle:"italic", color:"#808080"}}>by dezerto</Text>
      </View>
      
    </View>
  );
};

export default ShopDetailsScreen;
