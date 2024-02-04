import { useEffect, useState } from "react";
import {
  View,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  Alert,
  // ToastAndroid,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Stack, useRouter, Link } from "expo-router";

const Home = () => {
  const router = useRouter();

  async function redirectUsingToken(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      router.replace({ pathname: "/ordersScreen" });
    }
  }

  useEffect(() => {
    redirectUsingToken("accessTkn")
  },[])

  const [phoneNum, setPhoneNum] = useState("");
  const [isPhoneNumValid, setPhoneNumValid] = useState(false);

  useEffect(() => {
    const phoneNumRegex = /^\d{10}$/;
    if (phoneNumRegex.test(phoneNum)) {
      setPhoneNumValid(true);
    } else {
      setPhoneNumValid(false);
    }
  }, [phoneNum]);

  const handleLogin = () => {
    if (isPhoneNumValid) {
      router.replace({ pathname: "/shopDetailsScreen", params: { phoneNum: phoneNum } });
    } else {
      if (Platform.OS == "android") {
        ToastAndroid.show("Enter Correct Number", ToastAndroid.SHORT);
      } else {
        Alert.alert("Error", "Enter Correct Number");
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Image
        source={require("dezdash/assets/images/login_banner.png")}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "40%",
          marginBottom: 20,
        }}
      />

      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: -5 }}>
          <Text
            style={{ fontSize: 40, fontWeight: "bold", fontStyle: "italic" }}
          >
            DezDash
          </Text>
          <Image
            resizeMode="contain"
            style={{ width: 40, height: 40 }}
            source={require("dezdash/assets/images/dezdash_icon.png")}
          />
        </View>
        <Text style={{ fontStyle: "italic" }}>by Dezerto </Text>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: "#bdbdbd",
            marginHorizontal: 5,
          }}
        />
        <View>
          <Text style={{ width: 120, textAlign: "center" }}>
            Log in or sign up
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: "#bdbdbd",
            marginHorizontal: 5,
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          width: "85%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              alignItems: "center",
              flex: 1,
              borderRadius: 8,
              borderColor: "#bdbdbd",
              borderWidth: 1,
              marginEnd: 5,
              width: 46,
              height: 46,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("dezdash/assets/images/india_flag_icon.png")} // Replace with the path to your flag image
              resizeMode="cover"
              style={{
                width: 30,
                height: 30,
                // borderColor: 'gray',
                // borderWidth: 1,
                // padding:10,
              }}
            />
          </View>

          <View
            style={{
              flex: 4,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 8,
              borderColor: "#bdbdbd",
              height: 46,
              borderWidth: 1,
             
              paddingStart:12
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold", marginEnd:6 }}>+91</Text>

            <TextInput
              placeholder="Enter Phone Number"
              value={phoneNum}
              maxLength={10}
              multiLine="false"
              onChangeText={(text) => setPhoneNum(text)}
              style={{
                fontSize: 15,
                fontWeight: "bold",
              }}
              inputMode="numeric"
            />
          </View>
        </View>

        <Pressable
          android_ripple={{ color: "#999999" }}
          disabled={isPhoneNumValid ? false : true}
          style={{
            backgroundColor: isPhoneNumValid ? "black" : "#999999",
            borderRadius: 10,
            height: 44,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handleLogin}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
            }}
          >
            Continue
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 10,
          gap: 2,
        }}
      >
        <Text style={{ fontSize: 12 }}>By continuing, you agree to our</Text>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <Text style={{ fontSize: 14, textDecorationLine: "underline" }}>
            Terms of Service
          </Text>
          <Text style={{ fontSize: 14, textDecorationLine: "underline" }}>
            Privacy Policy
          </Text>
          <Text style={{ fontSize: 14, textDecorationLine: "underline" }}>
            Content Policy
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Home;
