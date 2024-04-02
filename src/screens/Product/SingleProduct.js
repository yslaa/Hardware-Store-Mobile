import React, { useState, useEffect, useContext } from "react";
import { Image, View, StyleSheet, Text, ScrollView, Button, Alert, Dimensions, View as Divider } from "react-native";
import { Spacer, Center, Heading, HStack } from 'native-base'
import TrafficLight from '@shared/StyledComponents/TrafficLight'
import EasyButton from '@shared/StyledComponents/EasyButton'
import Swiper from "react-native-swiper";
import { addToCart } from '@redux/Actions/cartActions';
import { useDispatch } from 'react-redux';
import Toast from "react-native-toast-message";
import AuthGlobal from "@context/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";

var { width, height } = Dimensions.get("window");

const Ratings = ({ value}) => {
    const size = 13;
    const color = styles.colors;    
    return (
      <HStack space={0.4} mt={1} alignItems="center">
        <FontAwesome
          name={value >= 1 ? "star" : value >= 0.5 ? "star-half-o" : "star-o"}
          color='orange'
          size={size}
        />
        <FontAwesome
          name={value >= 2 ? "star" : value >= 1.5 ? "star-half-o" : "star-o"}
          color='orange'
          size={size}
        />
        <FontAwesome
          name={value >= 3 ? "star" : value >= 2.5 ? "star-half-o" : "star-o"}
          color='orange'
          size={size}
        />
        <FontAwesome
          name={value >= 4 ? "star" : value >= 3.5 ? "star-half-o" : "star-o"}
          color='orange'
          size={size}
        />
        <FontAwesome
          name={value >= 5 ? "star" : value >= 4.5 ? "star-half-o" : "star-o"}
          color='orange'
          size={size}
        />
      </HStack>
    );
  }

const SingleProduct = ({ route }) => {
    const context = useContext(AuthGlobal)
    // console.log("Logging Item", route.params.item)
    // console.log(context.stateUser.userProfile._id)rr
    // console.log("single Product", route.params.item.wishlist.map(item => item.users).includes(context.stateUser.userProfile._id));
    const [item, setItem] = useState(route.params.item)
    const [availability, setAvailability] = useState('')
    const [availabilityText, setAvailabilityText] = useState("")
    const [quantity, setQuantity] = useState(1);
    const [isLogin, setIsLogin] = useState(false)
    const [token, setToken] = useState('')
    const [comments, setComments] = useState([])
    const [wishListOk, setWishListOk] = useState(false)
    const dispatch = useDispatch();
    const navigation = useNavigation()
    const [showMessage, setShowMessage] = useState(false);
    const [showDelete, setShowDelete] = useState(false)
    console.log("wish",wishListOk)
    useEffect(() => {
        AsyncStorage.getItem("jwt")
        .then((res)=>
        {
            setToken(res)
        })
        .catch((error) => console.log("Errors:", error))


    })

    useEffect(() => {  
        setIsLogin(token !== null)
        console.log("isLogin", isLogin)  

        if (isLogin === true && context.stateUser && context.stateUser.userProfile && route.params.item && route.params.item.wishlist) {
            console.log("You are logged in")
            setWishListOk(route.params.item.wishlist.map(item => item.user).includes(context.stateUser.userProfile._id))
        }
        else{
            console.log("You are not logged in")
        }
    },[token])
    
    const navitoLogin = () =>
    {
        navigation.navigate("Login")
    }

    const config = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }

    const addWishlist = () => {
        const userId = context.stateUser.userProfile;
        axios
            .post(`${baseURL}wishlist/${item._id}/${userId._id}`, config)
            .then(() => {  
                setWishListOk(true);  
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
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
    };
    
    const deleteWishlist = () => {
        const userId = context.stateUser.userProfile;
        axios
            .delete(`${baseURL}wishlist/${item._id}/${userId._id}`, config)
            .then(() => {  
                setWishListOk(false);  
                setShowDelete(true);
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

    useEffect(()=>{
        if(item.stock === 0)
        {
            setAvailabilityText(<TrafficLight unavailable></TrafficLight>);
        }
        else if(item.stock <= 5)
        {
            setAvailabilityText(<TrafficLight limited></TrafficLight>);
        }
        else
        {
            setAvailabilityText(<TrafficLight available></TrafficLight>);
        }

        return () => {
            setAvailabilityText("")
            setAvailability(null)
        }
    }, [])

        AsyncStorage.getItem("jwt")
            .then((res) => {
                axios.get(`${baseURL}comments`, {
                    headers: {
                        Authorization: `Bearer ${res}`,
                    },
                })
                .then((x) => {
                        const data = x.data.details;
                        const allComments = x.data.details;

                    // Filter comments based on productID
                        const prodComment = allComments.filter((com) => com.product && com.product === item._id);
                        setComments(prodComment);
                })
                .catch((error) => console.log(error.response.data))
            })

    const incrementQuantity = () => {
        if(quantity < item.stock) {
            setQuantity(prevQuantity => prevQuantity + 1);
        }
    }

    const decrementQuantity = () => {
        if(quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    }

    console.log("Comment Data: ", comments)

  return (
    <Center flexGrow={1}>
    <ScrollView style={{ marginBottom: 80}}>
    <Swiper style={styles.wrapper} showsPagination={false} >
    {item.image.map((image, index) => (
        <View key={index} style={styles.slide}>
            <Image
                source={{ uri: image.url }}
                resizeMode="contain"
                style={styles.image}
            />
        </View>
    ))}
</Swiper>
        <View style={styles.contentContainer}>
                {wishListOk === true ?
                (
                    <TouchableOpacity onPress={() => {
                        deleteWishlist();
                    } }>
                    <Ionicons name="heart" style={{ fontSize: 30 , color: "red"}} />
                    </TouchableOpacity>
                ):(  
                 
                        <TouchableOpacity onPress={isLogin === false ? () => {
                            navitoLogin();
                        } : () => {
                            addWishlist();
                        }}>
                        <Ionicons name="heart-outline" style={{ fontSize: 30 }} />
                        </TouchableOpacity>
                 
                      
              
                )
            }

            {showMessage && (
               <View style={{ position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: 5, padding: 35, justifyContent: "center", alignItems: "center",marginLeft: 30,marginRight: 30, left: 0, right: 0, transform: [{ translateY: -25 }] }}>
               <Text style={{ color: "white", textAlign: "center" }}>
                   Item added to wishlist
               </Text>
           </View>
            )}
             {showDelete && (
               <View style={{ position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: 5, padding: 35, justifyContent: "center", alignItems: "center",marginLeft: 30,marginRight: 30, left: 0, right: 0, transform: [{ translateY: -25 }] }}>
               <Text style={{ color: "white", textAlign: "center" }}>
                   Item Remove to wishlist
               </Text>
           </View>
           )}
        {/* <Ionicons name="heart" style={{ fontSize: 30 , color: "red"}} /> */}
            <Heading style={styles.contentHeader} >{item.product_name}</Heading>
            <Text >Class: {item.class}</Text>
            <Text >Price: ${item.price}</Text>
            <Text >Type: {item.type}</Text>
            <Text >Variant: {item.variant}</Text>
        </View>
        <View style={styles.availabilityContainer}>
            <View style={styles.availability}>
                <Text style={{ marginRight: 10 }}>
                    Availability: {availabilityText}
                </Text>
                {availability}
            </View>
            <Text>Stock: {item.stock}</Text>
            {item.stock > 0 ? (
              
        <View style={styles.quantityContainer}>
                            <Button title="-" onPress={decrementQuantity} />
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <Button title="+" onPress={incrementQuantity} />
                        </View>
        ) :    <Text style={styles.quantityContainer}>No Stock</Text>}
        </View>


        {item.stock > 0 ? (
            
                    <Button
                        title={'Add to Cart'}
                        color={'green'}
                   
                        onPress={() => {
                            dispatch(addToCart({ ...item, quantity: quantity })),
                            setQuantity(1);
                            Toast.show({
                                topOffset: 60,
                                type: "success",
                                text1: `${item.product_name} added to Cart`,
                                text2: "Go to your cart to complete order"
                            })
                        }}
                    />
                ) : <Text style={styles.unavailableText}>Currently Unavailable</Text>}

        <Divider style={styles.divider} />
        <Text style={styles.title}>Reviews</Text>
        {comments ? (
        <>
            <Text color="coolGray.800" _dark={{ color: 'warmGray.50' }} marginleft="2" alignSelf="center">
                <Ratings value={comments.reduce((acc, comment) => acc + comment.ratings, 0) / comments.length} />
            </Text>
            <Divider style={styles.divider} />
        </>
        ) : null}
        {comments? comments.map((item) => {
                        return (
                            <>
                                <Divider style={styles.divider2} />
                                <Spacer />
                                <Text color="coolGray.800" _dark={{
                                    color: 'warmGray.50'
                                }} marginleft="2">
                                    User: {item?.user?.username}
                                </Text>
                                <Text color="coolGray.800" _dark={{
                                    color: 'warmGray.50'
                                }} marginleft="2">
                                    Ratings: <Ratings value={item.ratings}/>
                                </Text>
                                <Spacer />
                                <Text color="coolGray.800" _dark={{
                                    color: 'warmGray.50'
                                }} marginleft="2">
                                    Comment: {item.text}
                                </Text>
                                <Divider style={styles.divider2} />
                            </>
                        )
                    }) : null}              
    </ScrollView>
</Center >
  )
}


const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: '100%',
    },
    imageContainer: {
        backgroundColor: 'white',
        padding: 0,
        margin: 0
    },
    image: {
        width: '100%',
        height: 350,
        aspectRatio: 1,
        marginTop: -40,
    },
    contentContainer: {
        justifyContent: 'right',
        alignItems: 'right',
        paddingright: 10,
        marginBottom: 10,
    },
    contentHeader: {
        fontSize: 20,
        marginBottom: 10,
    },
    contentText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white'
    },
    price: {
        fontSize: 24,
        margin: 10,
        color: 'red'
    },
    availabilityContainer: {
        marginBottom: 10,
        alignItems: "center"
    },
    availability: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center'
    },
    wrapper: {height:300},
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
    },
   quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    divider: {
        borderWidth: 1,
        borderColor: 'lightblue',
        marginTop: 30,
    },
    divider2: {
        borderWidth: 1,
        borderColor: 'orange',
        marginTop: 10,
    },
    title: {
        alignSelf: "center",
        margin: 8,
        fontSize: 16,
        fontWeight: "bold",
    },
});
export default SingleProduct