import { FlatList, ScrollView, Text, View } from "react-native"
import React,{ useLayoutEffect } from "react"

import { AxiosContext } from "../context/AxiosContext"
import FriendItem from "../components/FriendItem"
import Loader from "../components/Loader"

const FriendsScreen = ({navigation}) => {
    const {authAxios} = React.useContext(AxiosContext);
    const [friendsData,setFriendsData] = React.useState(null)
    const [isLoadingFriendsData,setIsLoadingFriendsData] = React.useState(true)

    const getFriends = async () => {
        const response = await authAxios.get('/get_friends')
        if(response.data.status == 0){
            console.log(response.data.data)
            setFriendsData(response.data.data)
            setIsLoadingFriendsData(false)
        }
    }

    

    React.useEffect(() => {
        getFriends()
    },[])

    useLayoutEffect (() => {
        navigation.setOptions({
          headerStyle:{
            backgroundColor:'#8C92AC'
          },
          headerTitle:"Friends"
        })
      },[navigation])
    return(
        isLoadingFriendsData ? <Loader visible={isLoadingFriendsData}/> :
        <ScrollView style={{backgroundColor:'#8C92AC',flex:1}}>
        {friendsData.map((item, index) => (
            <>
            <View style={{padding:10}}>
            <FriendItem
              key={index}
              imageUrl={item.photo}
              name={item.firstname + " " + item.lastname}
              type="friend"
              number={item.mobile}
            />
            </View>
            <View style={{borderBottomWidth:0.5,    borderBottomColor: '#DDD'
}}></View>
            </>
          ))}
        </ScrollView>
          )
    
}




export default FriendsScreen


