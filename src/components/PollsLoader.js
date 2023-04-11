import {Image, Text, View} from 'react-native'

import CustomText from './CustomText'

const PollsLoader = ({text,textStyles}) => {
    return(
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Image source={require('../../assets/images/razz_loader_300x90.gif')} />
            <CustomText style={textStyles}>{text}</CustomText>
        </View>
    )
}

export default PollsLoader