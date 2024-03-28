import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Dimensions, ScrollView, Button } from "react-native";
import { Text, HStack, VStack, Avatar, Spacer, Center } from "native-base";

import { clearCart } from "../../../redux/Actions/cartActions";
import Icon from 'react-native-vector-icons/FontAwesome'
import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../../assets/commons/baseurl";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from "@react-native-async-storage/async-storage"


var { width, height } = Dimensions.get("window");

const Confirm = (props) => {
    const [orderItems, setOrderItems] = useState([])
    const [token, setToken] = useState();
    const finalOrder = props.route.params;
    console.log("Transaction", finalOrder)

    const dispatch = useDispatch()
    let navigation = useNavigation()
    
    const cartItems = useSelector(state => state.cartItems)
    const shippingPrice = cartItems.price > 100 ? 0 : 15;
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalPrice = (itemsPrice + shippingPrice).toFixed(2);

    useEffect(() => {
        AsyncStorage.getItem("jwt")
        .then((res) => {
            setToken(res)
        })
        .catch((error) => console.log(error))
        const reducedOrderItems = cartItems.map((item) => ({
            product_name: item.product_name,
            class: item.class,
            productType: item.type,
            variant: item.variant,
            quantity: item.quantity,
            image: item.image,
            price: item.price,
            productId: item._id,
        }));
        setOrderItems(reducedOrderItems);
        return () => {
            setOrderItems();
        }
    }, [])

    const confirmOrder = () => {
        const orders = finalOrder.orders.order;
        const payment = JSON.stringify(finalOrder.orders.payment);

        const order = {
            ...orders,
            payment,
            orderItems,
            shippingPrice,
            itemsPrice,
            totalPrice
        }
        console.log(order)

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios
            .post(`${baseURL}transactions`, order, config)
            .then((res) => {
                if (res.status == 200 || res.status == 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Order Completed",
                        text2: "",
                    });

                    setTimeout(() => {
                        dispatch(clearCart())
                        navigation.navigate("Cart");
                    }, 500);
                }
            })
            .catch((error) => {
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "Something went wrong",
                    text2: "Please try again",
                });
                console.log("Error:", error);
                console.log("Error Response:", error.response.data); 
            });
    }
    return (
        <Center>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Confirm Order</Text>
                    {props.route.params ? (
                        <View style={{ borderWidth: 1, borderColor: "orange" }}>
                            <Text style={styles.title}>Shipping to:</Text>
                            <View style={{ padding: 15 }}>
                                <Text>Address: {finalOrder.orders.order.shippingInfo.address1}</Text>
                                <Text>Address2: {finalOrder.orders.order.shippingInfo.address2}</Text>
                                <Text>City: {finalOrder.orders.order.shippingInfo.city}</Text>
                                <Text>Zip Code: {finalOrder.orders.order.shippingInfo.zip}</Text>
                                <Text>Country: {finalOrder.orders.order.shippingInfo.country}</Text>
                            </View>
                            <Text style={styles.title}>items</Text>
                            
                            {orderItems.map((item) => {
                                return (
                                    <HStack space={[8, 3]} justifyContent="space-between" key={item._id}>
                                        <Avatar size="48px" source={{
                                            uri: item.image[0].url
                                        }}
                                        />
                                        <VStack>
                                            <Text _dark={{
                                                color: "warmGray.50"
                                            }} color="coolGray.800" bold>
                                                {item.product_name}
                                            </Text>
                                        </VStack>
                                        <Spacer />
                                        <Text color="coolGray.800" _dark={{
                                            color: 'warmGray.50'
                                        }} marginleft="2">
                                            Qty: {item.quantity}
                                        </Text>
                                        <Spacer />
                                        <Text fontSize="xs" _dark={{
                                            color: "warmGray.50"
                                        }} color="coolGray.800" alignSelf="flex-start">
                                        $ {item.price}
                                        </Text>
                                    </HStack>
                                )
                            })}
                        </View>
                    ) : null}
                    <View style={{ alignItems: "center", margin: 20 }}>
                        <Button
                            title={"Place order"}
                            onPress={confirmOrder}
                        />
                    </View>
                </View>
            </ScrollView>
        </Center>
    )

}
const styles = StyleSheet.create({
    container: {
        height: height,
        padding: 8,
        alignContent: "center",
        backgroundColor: "white",
    },
    titleContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: 8,
    },
    title: {
        alignSelf: "center",
        margin: 8,
        fontSize: 16,
        fontWeight: "bold",
    },
    listItem: {
        alignItems: "center",
        backgroundColor: "white",
        justifyContent: "center",
        width: width / 1.2,
    },
    body: {
        margin: 10,
        alignItems: "center",
        flexDirection: "row",
    },
});
export default Confirm;