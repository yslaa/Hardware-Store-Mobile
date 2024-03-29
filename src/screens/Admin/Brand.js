import { View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, RefreshControl} from 'react-native'
import React, { useCallback, useState } from 'react'
import axios from 'axios'
import baseURL from '@assets/commons/baseurl'
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import EasyButton from '@shared/StyledComponents/EasyButton'
import { Searchbar } from 'react-native-paper';
import ListItem from '@screens/Admin/ListBrand'
import {  Box } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

var { height,width } = Dimensions.get("window"); 

const Brand = (props) => {
    const [brandList, setBrandList] = useState([])
    const [loading, setLoading] = useState(true)
    const [brandFilter, setBrandFilter] = useState([])
    const [token, setToken] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const navigation = useNavigation()

    console.log("hello",brandList)
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
                    <Text style={{ fontWeight: '600' }}>Variant</Text>
                </View>
            </View>
        )
    }
    const searchBrand = (text) =>
    {
        if (text == ''){
            setBrandFilter(brandList)
        }
        setBrandFilter(
            brandList.details.filter((brand) => brand.brand_name.toLowerCase().includes(text.toLowerCase()))
        )
    }

    const deleteBrand = (id) =>
    {
        axios 
        .delete(`${baseURL}brand/${id}`,{
            headers: {Authorization: `Bearer ${token}`}
        })
        .then((res) =>
        {
            const brand = brandFilter.details.filter((item) => item.id !== id)
            setBrandFilter(brand)
        })
        
        .catch((error) => console.log(error))
    }

    const onRefresh = useCallback(() =>{
        setRefreshing(true)
        setTimeout(() =>
        {
            axios
            .get(`${baseURL}brand`)
            .then((res)=>
            {
                setBrandList(res.data);
                setBrandFilter(res.data);
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
                    .get(`${baseURL}brand`)
                    .then((res) => {
                        console.log(res.data)
                        setBrandList(res.data);
                        setBrandFilter(res.data);
                        setLoading(false);
                    })
                return () => {
                    setBrandList();
                    setBrandFilter();
                    setLoading(true);
                }
            },
            [],
        )
    )

    
  return (
    <Box flex={1}>
        <View style={styles.buttonContainer}>
            <EasyButton
                    secondary
                    medium
                    onPress={() => navigation.navigate("BrandForm")}
                >
                    <Ionicons name="add-circle-outline" size={18} color="white" />
                    <Text style={styles.buttonText}>Brand</Text>
                </EasyButton>
        </View>
        <Searchbar width="80%"
                placeholder="Search"
                onChangeText={(text) => searchBrand(text)}
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
                data={brandFilter.details}
                renderItem={({ item, index }) => (
                    <ListItem
                        item={item}
                        index={index}
                        deleteBrand={deleteBrand}

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
export default Brand