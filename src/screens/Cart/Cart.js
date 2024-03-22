import { Text, View, TouchableHighlight, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import AuthGlobal from '@context/Store/AuthGlobal'
import { Box, VStack, HStack, Button, Avatar, Spacer } from 'native-base'
import EasyButton from "@shared/StyledComponents/EasyButton"
import { SwipeListView } from 'react-native-swipe-list-view'
var { height, width } = Dimensions.get("window");
import { removeFromCart, clearCart } from '../../redux/Actions/cartActions'
import { Ionicons } from '@expo/vector-icons'

const Cart = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cartItems)
    const context = useContext(AuthGlobal)

    console.log(cartItems)
    var total = 0

    cartItems.forEach(cart => {
        return (total += cart.price * cart.quantity)
    });

    const renderItem = ({ item, index}) => (
        <TouchableHighlight
            _dark={{
                bg: 'coolGray.800'
            }}
            _light={{
                bg: 'white'
            }}
        >
            <Box pl="4" pr="5" py="2" bg="white" keyExtractor={item => item.id}>
                <HStack alignItems="center" space={3}>
                    <Avatar size="48px" source={{
                        uri: item.image[0].url 
                    }} />
                    <VStack>
                        <Text color="coolGray.800" _dark={{
                            color: 'warmGray.50'
                        }} bold>
                            {item.product_name}
                        </Text>
                    </VStack>
                    <Spacer />
                    <Text color="coolGray.800" _dark={{
                            color: 'warmGray.50'
                        }} marginleft="2">
                           Qty: {item.quantity}
                        </Text>
                    <Text fontSize="xs" color="coolGray.800" _dark={{
                        color: 'warmGray.50'
                    }} >
                        $ {item.price}
                    </Text>
                </HStack>
            </Box>
        </TouchableHighlight>
    )
 
    const renderHiddenItem = (cartItems) =>
    <TouchableOpacity
        onPress={() => dispatch(removeFromCart(cartItems.item))}
    >
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
    {cartItems.length > 0 ? (
        <Box bg="white" safeArea flex="1" width="100%" >
            <SwipeListView
                data={cartItems}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                disableRightSwipe={true}
                leftOpenValue={75}
                rightOpenValue={-150}
                previewOpenValue={-100}
                previewOpenDelay={3000}
                keyExtractor={item => item._id.$oid}
            />
        </Box>
    ) : (
        <Box style={styles.emptyContainer}>
            <Text >No items in cart
            </Text>
        </Box>
    )}
    <VStack style={styles.bottomContainer} w='100%' justifyContent='space-between'
    >
        <HStack justifyContent="space-between">
            <Text style={styles.price}>$ {total.toFixed(2)}</Text>
        </HStack>
        <HStack justifyContent="space-between">
            <EasyButton
                danger
                medium
                alignItems="center"
                onPress={() => dispatch(clearCart())}
            >
                <Text style={{ color: 'white' }}>Clear</Text>
            </EasyButton>
        </HStack>
        {context.stateUser.isAuthenticated ? (
            <EasyButton
                primary
                medium
                onPress={() => navigation.navigate('Checkout')}
            >
                <Text style={{ color: 'white' }}>Checkout</Text>
            </EasyButton>
        ) : (
            <EasyButton
                secondary
                medium
                onPress={() => navigation.navigate("User", {screen: 'Login'})}
            >
                <Text style={{ color: 'white' }}>Login</Text>
            </EasyButton>
        )}
    </VStack >
</>
  )
}

const styles = StyleSheet.create({
    emptyContainer: {
        height: height,
        alignItems: "center",
        justifyContent: "center",
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white',
        elevation: 20
    },
    price: {
        fontSize: 18,
        margin: 20,
        color: 'red'
    },
    hiddenContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
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

export default Cart