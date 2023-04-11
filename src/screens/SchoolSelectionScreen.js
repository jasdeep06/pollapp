import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import { AxiosContext } from '../context/AxiosContext';
import CustomText from '../components/CustomText';
import { Feather } from '@expo/vector-icons';
import Loader from '../components/Loader';
import { UserContext } from '../context/UserContext';

const filterByField = (list, field, value) => {
  console.log(`Filtering by ${field} = ${value}`)
  console.log(list.filter(item => item[field] === value))
  return list.filter(item => item[field] === value);
}


const SchoolSelectionScreen = ({navigation}) => {
  const {user,updateUser} = React.useContext(UserContext);
  const [schools, setSchools] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(null);
  const {publicAxios} = React.useContext(AxiosContext);
  const [schoolsLoading, setSchoolsLoading] = useState(true);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const newData = schools.filter((item) => {
        const itemData = `${item.name.toUpperCase()} ${item.city.toUpperCase()} ${item.state.toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(schools);
    }
  };

  const handleSchoolSelect = (item) => {
    console.log(`Selected school: ${item.name}`)
    updateUser({'school':item.school_id})
    navigation.navigate('FirstNameScreen');
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: "#fa7024",
      },
      headerTitle: "Pick your school",
    });
  }, [navigation]);

  useEffect(() => {
    const fetchNearbySchools = async () => {
      try {
        console.log(user.location);
        const response = await publicAxios.get("/get_nearby_schools", {
          params: {
            lat: user.location.coords.latitude,
            long: user.location.coords.longitude,
          }
        });
  
        console.log(response.data.data);
        setSchools(response.data.data);
        setFilteredData(response.data.data);
        setSchoolsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchNearbySchools();
  }, []);
  
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSchoolSelect(item)} style={[styles.listItem,user.school != null && user.school == item.school_id ? styles.selected : {}  ]}>
    <Image source={{ uri: item.logo_url }} style={styles.logo} />
    <View style={styles.schoolInfo}>
      <CustomText style={[styles.schoolName,user.school != null && user.school == item.school_id ? styles.selectedText : {}]}>{item.name}</CustomText>
      <CustomText style={[styles.schoolLocation,user.school != null && user.school == item.school_id ? styles.selectedText : {}]}>{item.city}, {item.state}</CustomText>
    </View>
    <View style={styles.membersInfo}>
      <CustomText style={[styles.membersCount,user.school != null && user.school == item.school_id ? styles.selectedText : {}]}>{item.num_members}</CustomText>
      <CustomText style={[styles.membersLabel,user.school != null && user.school == item.school_id ? styles.selectedText : {}]}>MEMBERS</CustomText>
    </View>
  </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fa7024" />
      {/* <View style={styles.header}>
        <CustomText style={styles.headerText}>Pick your school</CustomText>
      </View> */}
      {schoolsLoading ? <Loader visible={schoolsLoading}/> :<>
      <View style={styles.searchBarContainer}>
    <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
    <TextInput
      style={styles.searchBar}
      onChangeText={handleSearch}
      value={searchText}
      placeholder="Search..."
      placeholderTextColor="#888"
    />
  </View>
    <FlatList
      data={filteredData}
      renderItem={renderItem}
      keyExtractor={(item) => item.school_id}
    />
    </>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#FFA500',
    paddingTop: StatusBar.currentHeight,
    paddingBottom: 16,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    textAlign: 'center',
  },
  searchBar: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    fontSize: 16,
    color: '#888',
  },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 0,
  },

  searchIcon: {
    marginRight: 0,
    marginLeft:8
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
  schoolInfo: {
    flex: 1,
    marginLeft: 16,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'#858484'
  },
  schoolLocation: {
    fontSize: 14,
    color:"#858484",
  },
  membersInfo: {
    alignItems: 'center',
    marginLeft: 16,
  },
  membersCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'#fa7024'
  },
  membersLabel: {
    fontSize: 14,
    color:'#858484'
  },
  selected:{
    backgroundColor:'#fa7024'
  },
  selectedText:{
    color:"white"
  }
});

export default SchoolSelectionScreen;
