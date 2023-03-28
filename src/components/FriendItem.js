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
          {!declined && <TouchableOpacity onPress={acceptRequest} style={styles.button}>
            <Text style={styles.buttonText}>{accepted ? "Accepted": "Accept"}</Text>
          </TouchableOpacity>}
          {!accepted && <TouchableOpacity onPress={declineRequest} style={styles.button}>
            <Text style={styles.buttonText}>{declined ? "Declined":"Decline"}</Text>
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
        <TouchableOpacity onPress={addFriend} style={styles.button} disabled={added}>
          <Text style={styles.buttonText}>{added ? "Request sent":"Add"}</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageNameContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={{flexDirection:"column"}}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.number}>{number}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>{renderButtons()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize:18
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#1f7cf7',
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
  }
});

export default FriendItem;
