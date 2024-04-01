import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Dimensions, ScrollView, Button, View as Divider } from "react-native";
import { Text, HStack, VStack, Avatar, Spacer, Center } from "native-base";

import Icon from 'react-native-vector-icons/FontAwesome'
import Toast from "react-native-toast-message";
import axios from "axios";
// import baseURL from "../../../../assets/commons/baseurl";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from "@react-native-async-storage/async-storage"

var { width, height } = Dimensions.get("window");

const OrderDetails = ({ route }) => {

    const navigation = useNavigation()

    console.log("Data", route.params.res.data)
    const OrderDetails = route.params.res.data.details;
    const payment = JSON.parse(OrderDetails.payment);

    console.log("Order Details: ",OrderDetails)

    const orderItems = [
        ...OrderDetails.orderItems
    ]

    console.log("ITEMS: ",orderItems)


  return (
    <Center>
        
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Order Details</Text>
            {OrderDetails ? (
                <View style={{ borderWidth: 1, borderColor: "orange" }}>
                    <Text style={styles.title}>Shipped to:</Text>
                    <View style={{ padding: 15 }}>
                        <Text>Address: {OrderDetails.shippingInfo.address1}</Text>
                        <Text>Address2: {OrderDetails.shippingInfo.address2}</Text>
                        <Text>City: {OrderDetails.shippingInfo.city}</Text>
                        <Text>Zip Code: {OrderDetails.shippingInfo.zip}</Text>
                        <Text>Country: {OrderDetails.shippingInfo.country}</Text>
                    </View>
                    <Divider style={styles.divider} />

                    <Text style={styles.title}>Status</Text>
                    <View style={{ padding: 15, alignSelf: "center" }}>
                        <Text>{OrderDetails.status}</Text>
                    </View>
                    <Divider style={styles.divider} />

                    <Text style={styles.title}>Payment</Text>
                    <View style={{ padding: 15, alignSelf: "center" }}>
                        <Text>{payment.value}</Text>
                        {payment.value === "Card Payment"? <Text>Card: {payment.card}</Text> : null}
                    </View>
                    <Divider style={styles.divider} />

                    <Text style={styles.title}>items</Text>
                    {orderItems.map((item) => {
                        return (
                            <HStack space={[2, 3]} justifyContent="space-between" key={item._id}>
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
                                <Button
                                    onPress={() => navigation.navigate('Comment', { product: item })}
                                    title="Comment"
                                    size="sm"
                                    variant="outline"
                                />
                            </HStack>
                        )
                    })}
                </View>
            ) : null}
        </View>
    </ScrollView>
</Center>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    divider: {
        borderWidth: 1,
        borderColor: 'orange',
        marginBottom: 10,
    },
});

export default OrderDetails