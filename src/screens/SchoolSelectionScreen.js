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
import React, { useEffect, useState } from 'react';

import { AxiosContext } from '../context/AxiosContext';
import { Feather } from '@expo/vector-icons';
import Loader from '../components/Loader';
import { UserContext } from '../context/UserContext';

// const sampleData = [
//   // Replace this sample data with your actual data
//   {
//     id: '1',
//     logo_url: 'https://via.placeholder.com/50',
//     name: 'Sample School 1',
//     city: 'City 1',
//     state: 'State 1',
//     members: 123,
//   }

  
// ];
// for (let i = 2; i <= 25; i++) {
//     sampleData.push({
//       id: String(i),
//       logo_url: 'https://via.placeholder.com/50',
//       name: `Sample School ${i}`,
//       city: `City ${i}`,
//       state: `State ${i}`,
//       members: Math.floor(Math.random() * 500),
//     });
//   }

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

  useEffect(() => {

    publicAxios.get('/get_nearby_schools')
      .then(res => {
        console.log(res.data);
        setSchools(res.data);
        setFilteredData(res.data);
        setSchoolsLoading(false);
      })
      .catch(err => {
        console.log(err);
      })
  },[])

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSchoolSelect(item)} style={[styles.listItem,user.school != null && user.school == item.school_id ? styles.selected : {}  ]}>
    <Image source={{ uri: item.logo_url }} style={styles.logo} />
    <View style={styles.schoolInfo}>
      <Text style={styles.schoolName}>{item.name}</Text>
      <Text style={styles.schoolLocation}>{item.city}, {item.state}</Text>
    </View>
    <View style={styles.membersInfo}>
      <Text style={styles.membersCount}>{item.num_members}</Text>
      <Text style={styles.membersLabel}>MEMBERS</Text>
    </View>
  </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF8C00" />
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Pick your school</Text>
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
  },
  schoolLocation: {
    fontSize: 14,
  },
  membersInfo: {
    alignItems: 'center',
    marginLeft: 16,
  },
  membersCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  membersLabel: {
    fontSize: 14,
  },
  selected:{
    backgroundColor:'#FFA500'
  }
});

export default SchoolSelectionScreen;
