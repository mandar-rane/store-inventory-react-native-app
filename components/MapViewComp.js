import React from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";

const MapViewComp = ({ shop, editedShop }) => {
  const coordinates = shop.location.coordinates;
  return (
    <View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ width: "100%", height: 200 }}
        initialRegion={{
          latitude: coordinates[1],
          longitude: coordinates[0],
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          image={require("../assets/images/shop_icon_2.png")}
          coordinate={{
            latitude: coordinates[1],
            longitude: coordinates[0],
          }}
          title="Shop Loaction"
          description="This is your Shop Location"
        />
      </MapView>
    </View>
  );
};

export default MapViewComp;
