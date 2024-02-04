import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { PROVIDER_GOOGLE } from "react-native-maps";

const updateLocationScreen = () => {
  const [initialRegion, setInitialRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isInitialRegionFetched, setIsInitialRegionFetched] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

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
      setIsInitialRegionFetched(true);
    };

    fetchInitialLocation(); // Invoke the async function here

  }, []); // Empty dependency array to ensure the effect runs only once

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (isInitialRegionFetched) {
    text = JSON.stringify(initialRegion);
  }

  return (
    <View style={{ flex: 3 }}>
      {isInitialRegionFetched ? (
        <MapView
        showsBuildings={true}
        provider={PROVIDER_GOOGLE}
          style={{ flex: 2 }}
          initialRegion={initialRegion}
          onRegionChange={(newRegion) => setInitialRegion(newRegion)}
        >
          <Marker
            coordinate={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }}
            title="Selected Location"
            description="Choose this location"
          />
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
      <View style={{flex:1}}>


      </View>
    </View>
  );
};

export default updateLocationScreen;
