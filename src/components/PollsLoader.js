import {Image, Text, View} from 'react-native'

const PollsLoader = ({text,textStyles}) => {
    return(
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Image source={require('../../assets/images/razz_loader_300x90.gif')} />
            <Text style={textStyles}>{text}</Text>
        </View>
    )
}

export default PollsLoader