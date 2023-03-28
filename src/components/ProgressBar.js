import {View} from 'react-native';
import {useState} from 'react';

const ProgressBar = (props) => {
    const {totalSteps,stepSize,colorHex,minThickness,maxThickness,currentStep,style} = props;

    return(
        <View style={[{flexDirection:"row",alignItems:"center"},style]}>
        <View style={{width:"100%",borderBottomColor:colorHex,borderBottomWidth:maxThickness,flex:getMaxflex(currentStep,totalSteps)}}/>
        <View style={{width:"100%",borderBottomColor:colorHex,borderBottomWidth:minThickness,flex: getMinflex(currentStep,totalSteps)}}/>
        </View>
    )

}

const getMaxflex = (currentStep,totalSteps) => {
    if (currentStep == totalSteps) {
        return 0
    }else if(currentStep == 0){
        return totalSteps
    }else{
        return currentStep
    }

}

const getMinflex = (currentStep,totalSteps) => {
    if (currentStep == totalSteps) {
        return totalSteps
    }else if(currentStep == 0){
        return 0
    }else{
        return totalSteps-currentStep
    }

}

export default ProgressBar