import { StyleSheet, View, Dimensions, Image, Text, Button } from 'react-native'
import React from 'react'
import { tw } from 'nativewind'
var { width } = Dimensions.get("window");
import { addToCart } from '@redux/Actions/cartActions';
import  {useSelector, useDispatch} from 'react-redux'
import Toast from 'react-native-toast-message'

const ProductCard = (props) => {
    const { product_name, price, image, stock } = props;
    const dispatch = useDispatch()
    return (
        <View style={styles.container }>
            <Image
                style={styles.image}
                resizeMode="cover"
                source={{ uri: image[0].url }}
            />
            <View style={styles.cardContent}>
                <Text style={styles.title}>
                    {(product_name.length && product_name.length > 15) ? product_name.substring(0, 15 - 3) + '...' : product_name}
                </Text>
                <Text style={styles.price}>${price}</Text>
                {stock > 0 ? (
                    <Button
                        title={'Add to Cart'}
                        color={'green'}
                   
                        onPress={() => {
                            dispatch(addToCart({ ...props, quantity: 1, })),
                            console.log(props)
                            Toast.show({
                                topOffset: 60,
                                type: "success",
                                text1: `${product_name} added to Cart`,
                                text2: "Go to your cart to complete order"
                            })
                        }}
                    />
                ) : <Text style={styles.unavailableText}>Currently Unavailable</Text>}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        width: width / 2 - 20,
        borderRadius: 10,
        margin: 10,
        overflow: 'hidden', 
        elevation: 8,
        backgroundColor: 'white',       
    },
    image: {
        width: '100%',
        height: width / 2 - 20,
        position: 'absolute',
        top: 0,
        left: 0,
        
    },
    cardContent: {
        padding: 10,
        paddingTop: width / 2 - 20,
        alignItems: 'center',
        
    },
    title: {
        fontSize: 12,
        marginBottom: 5,
        right: 35,
        marginTop: 5
    },
    price: {
        fontSize: 15,
        color: 'green',
        marginBottom: 10,
        right: 50,
    },
    unavailableText: {
        marginTop: 10,
        textAlign: 'right'
    },

    
});



export default ProductCard