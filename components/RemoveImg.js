import React from 'react';
import { View, Text , Image} from 'react-native';

const RemoveImg = () => {
    return(
        <View style={{backgroundColor:"#ffffff", padding:8,marginEnd:30, borderRadius: 5, flexDirection:"row", justifyContent:"center", alignItems:"center", borderWidth:1, borderColor:"#000000"}}>
            <Image style={{marginEnd:5,height:32, width:32}} source={require("../assets/images/done_icon.png")} />
            <Text style={{color:"red", textDecorationLine:"underline"}}>remove</Text>
          </View>
    )
}

export default RemoveImg;