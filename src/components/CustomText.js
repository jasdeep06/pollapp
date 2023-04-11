import {Text} from 'react-native'

const CustomText = ({children,style}) => {
    
    return (
        <Text style={[{fontFamily:'Calibri'},style]}>
            {children}
        </Text>
    )
}


export default CustomText;