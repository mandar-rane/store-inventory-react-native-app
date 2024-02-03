import React from 'react';
import { View, Text , Image} from 'react-native';

const EditLocation = () => {
    return(
        <View style={{backgroundColor:"#ffffff", padding:8,marginEnd:30, borderRadius: 5, flexDirection:"row", justifyContent:"center", alignItems:"center", borderWidth:1, borderColor:"#bdbdbd"}}>
            <Image style={{height:32, width:32}} source={require("../assets/images/location_icon.png")} />
            <Text >Update</Text>
          </View>
    )
}

export default EditLocation;