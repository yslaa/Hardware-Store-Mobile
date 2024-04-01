import { View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, RefreshControl} from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import baseURL from '@assets/commons/baseurl'
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import EasyButton from '@shared/StyledComponents/EasyButton'
import { Searchbar } from 'react-native-paper';
import {  Box } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import ListUser from '@screens/Admin/ListUser'
import AuthGlobal from '@context/Store/AuthGlobal'

var { height,width } = Dimensions.get("window"); 
const User = () => {
    const [userList, setUserList] = useState([])
    const [loading, setLoading] = useState(true)
    const [userFilter, setUserFilter] = useState([])
    const [token, setToken] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const context = useContext(AuthGlobal)
    const navigation = useNavigation()
    
    useEffect(() => {
        AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res)
            })
            .catch((error) => console.log("Errors:", error))
    }, [])

    const ListHeader = () => {
        return (
            <View
                elevation={1}
                style={styles.listHeader}
            >
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>Image</Text>
                </View>
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>Name</Text>
                </View>
                <View style={styles.headerItem}></View>
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>Role</Text>
                </View>
            </View>
        )
    }

    const searchUser = (text) => {
        if (text === '') {
            setUserFilter(userList)
        }
        setUserFilter(
            userList.filter((users) => users.name.toLowerCase().includes(text.toLowerCase()))
        )
    }

    const deleteUser = (id) => {
        axios
            .delete(`${baseURL}user/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                const updatedUserList = userList.filter((item) => item.id !== id);
                setUserList(updatedUserList);
                setUserFilter(updatedUserList);
            })
            .catch((error) => console.log(error))
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            axios
                .get(`${baseURL}users`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((res) => {
                    const filteredUsers = res.data.details.filter(user => user._id !== context.stateUser?.userProfile?._id);
                    setUserList(filteredUsers);
                    setUserFilter(filteredUsers);
                    setLoading(false);
                })
                .catch((error) => console.log(error))
                .finally(() => setRefreshing(false));
        }, 500);
    }, [token])

    useFocusEffect(
        useCallback(
            () => {
                AsyncStorage.getItem("jwt")
                    .then((res) => {
                        setToken(res);
                        axios
                            .get(`${baseURL}users`, {
                                headers: { Authorization: `Bearer ${res}` }
                            })
                            .then((res) => {
                                const filteredUsers = res.data.details.filter(user => user._id !== context.stateUser?.userProfile?._id);
                                setUserList(filteredUsers);
                                setUserFilter(filteredUsers);
                                setLoading(false);
                                // res.data.details.forEach(user => {
                                //     console.log("User ID:", user._id);
                                // });
                            })
                            .catch((error) => console.log(error));
                    })
                    .catch((error) => console.log(error));
            },
            [],
        )
    );
//  console.log(userList)
console.log("user", userFilter)
// console.log("user",context.stateUser && context.stateUser.userProfile && context.stateUser.userProfile._id )
  return (
    <Box flex={1}>
     
        <Searchbar width="80%"
                placeholder="Search"
                onChangeText={(text) => searchUser(text)}
            //   value={searchQuery}
            />
             {loading ? (
                <View style={styles.spinner}>
                    <ActivityIndicator size="large" color="red" />
                </View>
            ) : (<FlatList
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={ListHeader}
                data={userFilter}
                renderItem={({ item, index }) => (
                    <ListUser
                        item={item}
                        index={index}
                        deleteUser={deleteUser}

                    />
                )}
                keyExtractor={(item) => item.id}
            />)}
   </Box>
  )
}

const styles = StyleSheet.create({
    listHeader: {
        flexDirection: 'row',
        padding: 5,
        backgroundColor: 'gainsboro'
    },
    headerItem: {
        margin: 3,
        width: width / 6
    },
    spinner: {
        height: height / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        marginBottom: 160,
        backgroundColor: 'white'
    },
    buttonContainer: {
        margin: 20,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    buttonText: {
        marginLeft: 4,
        color: 'white'
    }
})
export default User