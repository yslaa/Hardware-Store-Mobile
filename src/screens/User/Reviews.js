import { View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, RefreshControl} from 'react-native'
import React, { useCallback, useState, useContext } from 'react'
import axios from 'axios'
import baseURL from '@assets/commons/baseurl'
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import EasyButton from '@shared/StyledComponents/EasyButton'
import { Searchbar } from 'react-native-paper';
import ListItem from '@screens/Admin/ListItem'
import {  Box } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import AuthGlobal from "@context/Store/AuthGlobal";


var { height,width } = Dimensions.get("window"); 

const Reviews = (props) => {
    const context = useContext(AuthGlobal)
    const [productsList, setProductsList] = useState([])
    const [loading, setLoading] = useState(true)
    const [productFilter, setProductFilter] = useState([])
    const [token, setToken] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const navigation = useNavigation()

    // console.log("hello",productsList)
    console.log("User Data: ",context)
    const ListHeader = () => {
        return (
            <View
                elevation={1}
                style={styles.listHeader}
            >
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>image</Text>
                </View>
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>Name</Text>
                </View>
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>Stock</Text>
                </View>
                <View style={styles.headerItem}></View>
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>Price</Text>
                </View>
            </View>
        )
    }

    console.log("productfil",productFilter)
    const deleteProduct = (id) =>
    {
        axios 
        .delete(`${baseURL}product/${id}`,{
            headers: {Authorization: `Bearer ${token}`}
        })
        .then((res) =>
        {
            const products = productFilter.details.filter((item) => item.id !== id)
            setProductFilter(products)
        })
        
        .catch((error) => console.log(error))
    }

    const onRefresh = useCallback(() =>{
        setRefreshing(true)
        setTimeout(() =>
        {
            axios
            .get(`${baseURL}products`)
            .then((res)=>
            {
                setProductsList(res.data);
                setProductFilter(res.data);
                setLoading(false);
            })
            setRefreshing(false);
        }, 500)
    })

    useFocusEffect(
        useCallback(
            () => {
                AsyncStorage.getItem("jwt")
                    .then((res) => {
                        setToken(res)
                    })
                    .catch((error) => console.log(error))
                axios
                    .get(`${baseURL}products`)
                    .then((res) => {
                        // console.log(res.data)
                        setProductsList(res.data);
                        setProductFilter(res.data);
                        setLoading(false);
                    })
                return () => {
                    setProductsList();
                    setProductFilter();
                    setLoading(true);
                }
            },
            [],
        )
    )

    
  return (
    <Box flex={1}>
            {loading ? (
                <View style={styles.spinner}>
                    <ActivityIndicator size="large" color="red" />
                </View>
            ) : (<FlatList
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={ListHeader}
                data={productFilter.details}
                renderItem={({ item, index }) => (
                    <ListItem
                        item={item}
                        index={index}
                        deleteProduct={deleteProduct}

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
export default Reviews