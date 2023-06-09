import {Text, TouchableOpacity, View} from 'react-native';

import CustomText from './CustomText';

const ElevatedBox = (props) => {
    return(
        <TouchableOpacity style={[{
            backgroundColor: 'white',
            borderRadius: 15,
            elevation: 10, // Increase the elevation value
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 }, // Increase the shadow offset height
            shadowOpacity: 0.3, // Increase the shadow opacity
            shadowRadius: 4.65, // Increase the shadow radius
            margin:10,
            padding:10,
            flexDirection:"row",
            justifyContent:"center"
          },props.style]}
          onPress={props.onPress}
          disabled={props.disabled}>
            {props.icon}
        <CustomText style={[{textAlign:"center"},props.textStyle]}>{props.text}</CustomText>
        </TouchableOpacity>
    )
}

export default ElevatedBox