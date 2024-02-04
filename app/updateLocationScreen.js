import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack, useRouter, Link, useGlobalSearchParams } from "expo-router";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
const screenWidth = Dimensions.get("window").width;
import { PROVIDER_GOOGLE } from "react-native-maps";
import CustomModal from "../components/CustomModal";
import * as SecureStore from "expo-secure-store";

const updateLocationScreen = () => {
  const [initialRegion, setInitialRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isInitialRegionFetched, setIsInitialRegionFetched] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [displayAddress, setDisplayAddress] = useState("");
  const [buildingPlot, setBuildingPlot] = useState("");
  const [areaLocality, setAreaLocality] = useState("");
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    buildingPlot: "",
    areaLocality: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const apiKey = "AIzaSyArRpkPQqwY0EDi0cO4m6JAWOTzk9PY6Xk";

  // useEffect(() => {
  //   const isValid =
  //     locationData.areaLocality.trim() !== "" &&
  //     locationData.buildingPlot.trim() !== "" &&
  //     locationData.latitude !== "" &&
  //     locationData.longitude !== ""

  //   setIsFormValid(isValid);
  // }, [locationData]);

  const updateLocationData = () => {
    setLocationData((prevState) => ({
      ...prevState,
      latitude: initialRegion.latitude,
      longitude: initialRegion.longitude,
      buildingPlot: buildingPlot,
      areaLocality: areaLocality,
    }));
  };

  const handleBuildingPlotChange = (text) => {
    setBuildingPlot(text);
    updateLocationData();
  };

  // Handle changes in areaLocality
  const handleAreaLocalityChange = (text) => {
    setAreaLocality(text);
    updateLocationData();
  };

  useEffect(() => {
    setLocationData((prevState) => ({
      ...prevState,
      latitude: initialRegion.latitude,
      longitude: initialRegion.longitude,
      buildingPlot: buildingPlot,
      areaLocality: areaLocality,
    }));
  }, [
    initialRegion.latitude,
    initialRegion.longitude,
    buildingPlot,
    areaLocality,
  ]);

  useEffect(() => {
    const isValid =
      locationData.latitude !== "" &&
      locationData.longitude !== "" &&
      buildingPlot !== "" &&
      areaLocality !== "";
    setIsFormValid(isValid);
  }, [
    initialRegion.latitude,
    initialRegion.longitude,
    buildingPlot,
    areaLocality,
  ]);

  const putUpdateLocation = async () => {
    setIsLoading(true);

    try {
      const key = "accessTkn";
      const bearerToken = await SecureStore.getItemAsync(key);

      if (bearerToken) {
        const apiUrl =
          "https://dzo.onrender.com/api/vi/shop/owner/update/shop/details";

        const requestBody = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          address: locationData.buildingPlot + " " + locationData.areaLocality,
        };

        const response = await axios.put(apiUrl, requestBody, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        });

        console.log("PUT request successful:", response.data);
        setIsSuccess(true);
      } else {
        console.error("Token not found in SecureStore");
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
      console.error("Error in PUT request:", error);
    } finally {
      setIsLoading(false);

      setTimeout(() => {
        setIsSuccess(false);
        setIsError(false);
        router.back();
      }, 2000);
    }
  };

  useEffect(() => {
    const fetchInitialLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { coords } = location;
      const { latitude, longitude } = coords;
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
      });

      reverseGeoCodeCoords(latitude, longitude);

      setIsInitialRegionFetched(true);
    };

    fetchInitialLocation();
  }, []);

  reverseGeoCodeCoords = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      const results = response.data.results;
      if (results && results.length > 0) {
        const address = results[0].formatted_address;
        setDisplayAddress(address);
      } else {
        console.warn("No results found for reverse geocoding.");
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
    }
  };

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (isInitialRegionFetched) {
    text = JSON.stringify(initialRegion);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 3, flexDirection: "column" }}>
        <View
          style={{
            padding: 12,

            flexDirection: "row",
            backgroundColor: "#ffffff",
            alignItems: "center",
          }}
        >
          <Image
            style={{ marginEnd: 10 }}
            source={require("../assets/images/back_icon.png")}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Shop Location
          </Text>
        </View>

        {isInitialRegionFetched ? (
          <MapView
            showsBuildings={true}
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            initialRegion={initialRegion}
            onRegionChangeComplete={(newRegion) => {
              setInitialRegion(newRegion);
              reverseGeoCodeCoords(newRegion.latitude, newRegion.longitude);
            }}
          >
            <Marker
              coordinate={{
                latitude: initialRegion.latitude,
                longitude: initialRegion.longitude,
              }}
              title="Selected Location"
              description="Choose this location"
            />
          </MapView>
        ) : (
          <Text>Loading...</Text>
        )}
        <View style={{ flex: 1 }}>
          <View
            style={{
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Image
              style={{ height: 28, width: 28, marginHorizontal: 10 }}
              source={require("../assets/images/location_icon.png")}
            />
            <View style={{ flexDirection: "column", flexWrap: "wrap" }}>
              <Text style={{ maxWidth: screenWidth - 60, fontSize: 18 }}>
                {displayAddress}
              </Text>
            </View>
          </View>
          <Text style={{ margin: 10 }}>Complete Address</Text>
          <TextInput
            placeholder="Building / Plot No."
            style={{
              borderWidth: 1,
              borderColor: "#bdbdbd",
              marginHorizontal: 10,
              marginBottom: 10,
              padding: 6,
              borderRadius: 8,
            }}
            value={buildingPlot}
            onChangeText={handleBuildingPlotChange}
          />
          <TextInput
            placeholder="Area / Sector / Locality"
            style={{
              borderWidth: 1,
              borderColor: "#bdbdbd",
              marginHorizontal: 10,
              padding: 6,
              borderRadius: 8,
            }}
            value={areaLocality}
            onChangeText={handleAreaLocalityChange}
          />

          <Pressable
            onPress={putUpdateLocation}
            style={{
              marginTop: 20,
              borderRadius: 10,
              backgroundColor: isFormValid ? "#000000" : "gray",
              alignItems: "center",
              height: 40,
              justifyContent: "center",
              marginHorizontal: 10,
            }}
            disabled={!isFormValid}
          >
            <Text style={{ color: "white", fontSize: 18 }}>
              Update Location
            </Text>
          </Pressable>
        </View>
      </View>
      {isLoading || isSuccess || isError ? (
        <View style={styles.overlay} />
      ) : null}
      <CustomModal visible={isLoading} type="loading" msg="" />
      <CustomModal
        visible={isSuccess}
        type="success"
        msg="Location updated successfully"
      />
      <CustomModal
        visible={isError}
        type="error"
        msg="Failed to update location"
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default updateLocationScreen;
