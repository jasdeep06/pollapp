import { BackHandler, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { useBackHandler, useFocusEffect } from '@react-navigation/native';

import { UserContext } from '../context/UserContext';

const GradeSelectionScreen = ({navigation}) => {
  const gradeData = [
    { grade: 'GRADE 8', classOf: 'CLASS OF 2027' },
    { grade: 'GRADE 9', classOf: 'CLASS OF 2026' },
    { grade: 'GRADE 10', classOf: 'CLASS OF 2025' },
    { grade: 'GRADE 11', classOf: 'CLASS OF 2024' },
    { grade: 'GRADE 12', classOf: 'CLASS OF 2023' },
  ];

  const {user,updateUser} = React.useContext(UserContext);

  // const handleBackButtonClick = () => {
  //   navigation.navigate('BannerScreen');
  //   return true;
  // }

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault(); // Prevent default action
      unsubscribe() // Unsubscribe the event on first call to prevent infinite loop
      navigation.navigate('BannerScreen') // Navigate to your desired screen
    });
 }, [])



  const renderItem = ({ item }) => {

    const handleItemPress = () => {
        console.log(`Selected: ${item.grade}`);
        updateUser({'grade':item.grade})
        navigation.navigate('SchoolSelectionScreen');
        // Add any additional logic you want to execute when an item is clicked
      };
    
    return (
        <TouchableOpacity onPress={handleItemPress}>

      <View style={[styles.listItem,user.grade != null && user.grade == item.grade ? styles.selected : {}]}>
        <Text style={styles.gradeText}>{item.grade}</Text>
        <Text style={styles.classOfText} numberOfLines={2}>{item.classOf}</Text>
      </View>
      </TouchableOpacity>

    );
  };

  
  return (

    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C00" barStyle="dark-content" />
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>What grade are you in?</Text>
      </View> */}
      <FlatList
        data={gradeData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFA500',
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexWrap: 'wrap',
  },
  gradeText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 9,

  },
  classOfText: {
    fontSize: 9,
    lineHeight:9,
    flex:1,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  selected:{
    backgroundColor: '#FF8C00',
  }
});

export default GradeSelectionScreen;
