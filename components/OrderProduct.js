import react from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";

const OrderProduct = ({ url, name, qty, price, customizations}) => {
  return (
    <View>
        
    <View style={{ flexDirection: "row" , alignItems: "center"}}>
      <View>
        <View
          style={{
            backgroundColor: "#ffffff",
            padding: 10,
            borderColor: "#636E72",
            borderWidth: 1,
            borderRadius: 15,
          }}
        >
          <Image source={{ uri: url }} style={{ width: 60, height: 60 }} />
        </View>
      </View>
      <View style={{padding:10, flexDirection:"column",alignItems:"flex-start"}}>
        <Text style ={{fontWeight: "500", fontSize: 18}}>{name}</Text>
        <Text style ={{fontWeight: "500"}}>Qty {qty}</Text>
        <Text style ={{fontWeight: "500", fontSize: 20}}>${price}</Text>
      </View>
    </View>

    <View style={{marginBottom:10}}>
        <Text style={{fontWeight:"500"}}>Customizations</Text>
        <View>
        {customizations.map((custs) => (
                <View key={custs._id}>
                    <Text>Name: {custs.name} </Text>
                    <View>
                        {custs.options.map((opts) => (
                            <View key={opts._id}>
                                <Text>Option: {opts.optionName}</Text>
                                <Text>Price: ${opts.optionPrice}</Text>
                            </View> 
                        ))} 

                    </View>
                </View>

            ))}
        </View>
    </View>
</View>
  );
};

export default OrderProduct;
