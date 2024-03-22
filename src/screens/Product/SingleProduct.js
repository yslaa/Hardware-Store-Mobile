import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, ScrollView, Button } from "react-native";
import { Left, Right, Container, H1, Center, Heading } from 'native-base'
import TrafficLight from '@shared/StyledComponents/TrafficLight'
import EasyButton from '@shared/StyledComponents/EasyButton'
import Swiper from "react-native-swiper";
import { addToCart } from '@redux/Actions/cartActions';
import { useDispatch } from 'react-redux';
import Toast from "react-native-toast-message";

const SingleProduct = ({ route }) => {
    console.log(route)
    const [item, setItem] = useState(route.params.item)
    const [availability, setAvailability] = useState('')
    const [availabilityText, setAvailabilityText] = useState("")
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();

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
});
export default SingleProduct