import { useState, useEffect } from "react";
import {
  View,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  // ToastAndroid,
  KeyboardAvoidingView,
} from "react-native";
import { Stack, useRouter, Link, useGlobalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

async function saveToken(key, value) {
  await SecureStore.setItemAsync(key, value);
}

const otpScreen = () => {
  const router = useRouter();
  const { phoneNum } = useGlobalSearchParams();
  const [receivedOtp, setOtp] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isOtpValid, setOtpValid] = useState(false);

  useEffect(() =>{
    const otpRegex = /^\d{6}$/;
    if(otpRegex.test(receivedOtp)){
      setOtpValid(true);
    }else{
      setOtpValid(false);
    }

  }, [receivedOtp])

  const handleOtpSubmit = async () => {
    
    if (isOtpValid) {
      try {
        const otpApiUrl =
          "https://dzo.onrender.com/api/vi/shop/owner/login/verify/ot";
        const postData = { phone: phoneNum, otp: receivedOtp };
        const otpResponse = await axios.post(otpApiUrl, postData);

        if (otpResponse.data.success) {
          saveToken("accessTkn", otpResponse.data.token);
          router.push({ pathname: "/ordersScreen" });
        }
      } catch (error) {
        console.log("API Error: ", error);
      }
    } else {
      if (Platform.OS == "android") {
        // ToastAndroid.show("Enter Valid OTP", ToastAndroid.SHORT);
      } else {
        Alert.alert("Error", "Enter Correct Number");
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      const otpApiUrl =
        "https://dzo.onrender.com/api/vi/shop/owner/login/send/ot";
      const postData = { phone: phoneNum };
      const otpResponse = await axios.post(otpApiUrl, postData);
      setButtonDisabled(true);
      setTimer(60);

      setTimeout(() => {
        setButtonDisabled(false);
      }, 60000);

      console.log("API Response", otpResponse.data);
    } catch (error) {
      // ToastAndroid.show("Could not send OTP. Try Resending")
      console.log("API Error: ", error);
    }
  };

  useEffect(() => {
    const makeApiCall = async () => {
      try {
        const otpApiUrl =
          "https://dzo.onrender.com/api/vi/shop/owner/login/send/ot";
        const postData = { phone: phoneNum };
        const otpResponse = await axios.post(otpApiUrl, postData);

        console.log("API Response", otpResponse.data);
      } catch (error) {
        console.log("API Error: ", error);
      }
    };
    makeApiCall();
  }, []);

  useEffect(() => {
    let interval;
    if (isButtonDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isButtonDisabled]);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 12,
      }}
    >
      <Text
        style={{
          alignSelf: "flex-start",

          fontSize: 25,
          fontWeight: "bold",
        }}
      >
        Verify OTP
      </Text>
      <Image
        source={require("dezdash/assets/images/otp_screen_image.png")}
        style={{
          width: "80%",
          height: "50%",
          resizeMode: "contain",
          marginBottom: 10,
        }}
      />

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: "#abb7b7",
            marginHorizontal: 10,
          }}
        />
        <View>
          <Text style={{ textAlign: "center", fontSize: 18 }}>
            Enter the OTP sent to {phoneNum}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: "#abb7b7",
            marginHorizontal: 10,
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
              flex: 4,
              height:46,
              paddingLeft:10,
              justifyContent:"center",
              borderRadius: 8,
              borderColor: "gray",
              borderWidth: 1,
              
            }}
          >
            <TextInput
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={receivedOtp}
              onChangeText={(text) => setOtp(text)}
              style={{
                fontSize: 16,
                fontWeight: "bold",
              }}
              inputMode="numeric"
            />
          </View>
        </View>

        <Pressable
        android_ripple={{ color: "#ffffff" }}
        disabled={isOtpValid?false:true}
          style={{
            backgroundColor: isOtpValid?"black":"#999999",
            borderRadius: 10,
            height:46,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 6,
          }}
          onPress={handleOtpSubmit}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
            }}
          >
            VERIFY
          </Text>
        </Pressable>
        <Pressable
        android_ripple={{ color: "#999999" }}
          style={{
            backgroundColor: isButtonDisabled ? "#e0e0e0" : "white",
            borderRadius: 10,
            borderColor: "black",
            borderWidth: 1,
            height: 46,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={isButtonDisabled ? undefined : handleResendOtp}
          disabled={isButtonDisabled}
        >
          <Text
            style={{
              color: "black",
              fontSize: 18,
            }}
          >
            {isButtonDisabled ? `Resend in ${timer}` : "RESEND"}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default otpScreen;
