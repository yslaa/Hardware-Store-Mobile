import { Text, View, TouchableHighlight, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import AuthGlobal from '@context/Store/AuthGlobal'
import { Box, VStack, HStack, Button, Avatar, Spacer } from 'native-base'
import EasyButton from "@shared/StyledComponents/EasyButton"
import { SwipeListView } from 'react-native-swipe-list-view'
var { height, width } = Dimensions.get("window");
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import baseURL from '@assets/commons/baseurl'
import AsyncStorage from '@react-native-async-storage/async-storage'


var { width } = Dimensions.get("window");

const ListItem = () => {
    const [modalShow, setModalShow] = useState(false);
    const navigation = useNavigation();
    const context = useContext(AuthGlobal)
    const [products, setProducts] = useState([]);
    const [active, setActive] = useState([]);
    const [focus, setFocus] = useState(false);
    const [wishlist, setWishList] = useState([])
    const [token, setToken] = useState('')
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem("jwt")
        .then((res)=>
        {
            setToken(res)
        })
        .catch((error) => console.log("Errors:", error))
    })

    useEffect(() => {
        if (products.details && products.details.length > 0) {
            const userWishlist = products.details.flatMap(product => product.wishlist.map(item => ({ ...item, productId: product._id, productName: product.product_name, productImage: product.image[0].url })));
            console.log(userWishlist);
            setWishList(userWishlist);
        } else {
            setWishList([]);
        }
    }, [products]);

    useFocusEffect(
        useCallback(
            () => {
                setFocus(false);
                setActive(-1);
                axios
                    .get(`${baseURL}products`)
                    .then((res) => {
                        setProducts(res.data);
                        // console.log('Response data:', res.data);
                    })
                    .catch((error) => {
                        console.log('Api call error', error);
                    })
    
                return () => {
                    setProducts([]);
                    setFocus();
                    setActive();
                };
            },
            [],
        )
    );
    
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
    const deleteWishlist = ( {item} ) => {
        console.log(item.productId)
        const userId = context.stateUser.userProfile;
        axios
            .delete(`${baseURL}wishlist/${item.productId}/${userId._id}`, config)
            .then(() => {  
                setShowDelete(true)
                axios.get(`${baseURL}products`)
                .then((res) => {
                    setProducts(res.data);
                })
                .catch((error) => {
                    console.log('Error fetching updated wishlist:', error);
                });
                setTimeout(() => {
                    setShowDelete(false);
                }, 2000);
            })
            .catch((error) => {
                console.log("Error:", error);
                console.log("Error Response:", error.response.data);
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "Something went wrong",
                    text2: "Please try again",
                });
            });
    }
    
    const renderItem = ({ item }) => (
        <TouchableHighlight
          _dark={{
            bg: 'coolGray.800'
          }}
          _light={{
            bg: 'white'
          }}
          onPress={() => navigation.navigate("Product Detail", { item: item })}
        >
          <Box pl="4" pr="5" py="2" bg="white" key={item._id}>
            <HStack alignItems="center" space={3}>
              <Avatar size="48px" source={{ uri: item.productImage }} />
              <VStack>
                <Text
                  color="coolGray.800"
                  _dark={{
                    color: 'warmGray.50'
                  }}
                  bold
                >
                  {item.productName}
                </Text>
                <Text
                  color="coolGray.800"
                  _dark={{
                    color: 'warmGray.50'
                  }}
                >
                  {item.price}
                </Text>
              </VStack>
              <Spacer />
         
            </HStack>
          </Box>
        </TouchableHighlight>
    );

    const renderHiddenItem = ({item}) =>
    <TouchableOpacity onPress={() => deleteWishlist({item})}>
        <VStack alignItems="center" style={styles.hiddenButton} >
            <View >
                <Ionicons name="trash-bin-outline" color={"white"} size={30} bg="red" />
                <Text color="white" fontSize="xs" fontWeight="medium">
                    Delete
                </Text>
            </View>
        </VStack>
    </TouchableOpacity>;

    return (
        <>
         {showDelete && (
                <View style={{ position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: 5, padding: 35, justifyContent: "center", alignItems: "center", marginLeft: 30, marginRight: 30, left: 0, right: 0, top: "40%",transform: [{ translateY: -25 }] }}>
                    <Text style={{ color: "white", textAlign: "center" }}>
                        Item removed from wishlist
                    </Text>
                </View>
            )}
    {wishlist.length > 0 ? (
            <Box bg="white" safeArea flex="1" width="100%">
                <SwipeListView
                    data={wishlist} 
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    disableRightSwipe={true}
                    leftOpenValue={75}
                    rightOpenValue={-150}
                    previewOpenValue={-100}
                    previewOpenDelay={3000}
                    keyExtractor={(item) => item._id} 
                />
            </Box>
        ) : (
            <Box style={styles.emptyContainer}>
                <Text>No items in wishlist</Text>
            </Box>
        )}
</>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        width: width
    },
    image: {
        borderRadius: 50,
        width: width / 6,
        height: 20,
        margin: 2
    },
    item: {
        flexWrap: "wrap",
        margin: 3,
        width: width / 6
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold"
    },
    hiddenButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 25,
        height: 70,
        width: width / 1.2
    }
});

export default ListItem;