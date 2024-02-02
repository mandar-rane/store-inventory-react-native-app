import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapViewComp = ({ shop }) => {
  const coordinates = shop.location.coordinates;
  return (
    <View>
      <MapView
        style={{width:"100%", height:200 }}
        initialRegion={{
          latitude: coordinates[1],
          longitude: coordinates[0],
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
      <Marker
      style={{height:100, width:100}}
      image={require("../assets/images/shop_icon_3.png")}
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
