import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React,{useState} from 'react';

const FriendItem = ({
  imageUrl,
  name,
  number,
  type,
  onAccept,
  onDecline,
  onInvite,
  onAdd,
  itemStyle,
  contact_name,
  gender
}) => {

  const [accepted,setAccepted] = useState(false)
  const [declined,setDeclined] = useState(false)
  const [added,setAdded] = useState(false)
  
  const acceptRequest = async (user_id) => {
    setAccepted(true)
    const response = await onAccept(user_id)
    console.log(response.data)
  }

  const declineRequest = async (user_id) => {
    setDeclined(true)
    const response = await onDecline(user_id)
    console.log(response.data)
  }

  const addFriend = async (user_id) => {
    setAdded(true)
    const response = await onAdd(user_id)
    console.log(response.data)
  }

  const renderButtons = () => {
    if (type === 'request') {
      return (
        <>
          {!accepted && <TouchableOpacity onPress={declineRequest} style={styles.decline}>
            <Text style={styles.declineText}>{declined ? "DECLINED":"DECLINE"}</Text>
          </TouchableOpacity>}
          {!declined && <TouchableOpacity onPress={acceptRequest} style={[styles.button,styles.accept]}>
            <Text style={styles.buttonText}>{accepted ? "ACCEPTED": "ACCEPT"}</Text>
          </TouchableOpacity>}
        </>
      );
    }

    if (type === 'invite') {
      return (
        <TouchableOpacity onPress={onInvite} style={styles.button}>
          <Text style={styles.buttonText}>Invite</Text>
        </TouchableOpacity>
      );
    }

    if (type === 'add') {
      return (
        <TouchableOpacity onPress={addFriend} style={[styles.button,{paddingHorizontal:22}]} disabled={added}>
          <Text style={styles.buttonText}>{added ? "SENT":"ADD"}</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container,itemStyle]}>
      <View style={styles.imageNameContainer}>
        <Image source={{ uri: imageUrl }} style={[styles.image,gender == 'boy' ? {borderColor:"#3f85fa",borderWidth:2.5} : {borderColor:"#fd4996",borderWidth:2.5}]} />
        <View style={{flexDirection:"column"}}>
        <Text style={styles.name}>{name}</Text>
        {getNumberView(number,contact_name)}
        </View>
      </View>
      <View style={styles.buttonsContainer}>{renderButtons()}</View>
    </View>
  );
};


const getNumberView = (number,contact_name) => {
  if(number != null){
    return  <Text style={{color:"#7d7d7d",marginLeft:10,fontSize:12}}>{number}</Text>
  }else
  if(contact_name != null && contact_name != "Not in Contacts"){
    return <Text style={{color:"#7c7c7c",marginLeft:10,fontSize:12}}><Text style={{color:"#ff9155"}}>{contact_name}</Text>(Contacts)</Text>
  }else if(contact_name ==  "Not in Contacts"){
    return <Text style={{color:"#7c7c7c",marginLeft:10,fontSize:12}}>Not in Contacts</Text>
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor:"pink"
  },
  imageNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  name: {
    marginLeft: 10,
    fontSize:18,
    color:"#2f2f2f"
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#fa7024',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
  },
  number:{
    marginLeft: 10,
    fontSize:12
  },
  decline:{
    alignSelf:"center"
  },
  declineText:{
    color:'#7c7c7c'
  },
  accept:{
    backgroundColor:'#fa7024'
  }
});

export default FriendItem;
