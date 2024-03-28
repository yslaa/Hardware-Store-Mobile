import React, { useEffect, useState, useContext } from 'react'
import { Text, View, Button, SafeAreaView } from 'react-native'
import { Select, Item, Picker, Toast } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome'
import FormContainer from '../../../shared/Form/FormContainer'
import Input from '../../../shared/Form/Input'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native';
import AuthGlobal from "../../../context/Store/AuthGlobal"

const countries = require("../../../../assets/data/countries.json");
// import SelectDropdown from 'react-native-select-dropdown'

const Checkout = (props) => {
    const [user, setUser] = useState('')
    // const [orderItems, setOrderItems] = useState([])
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [city, setCity] = useState('')
    const [zip, setZip] = useState('')
    const [country, setCountry] = useState('Philippines')
    const [phone, setPhone] = useState('')

    const navigation = useNavigation()
    // const cartItems = useSelector(state => state.cartItems)
    const context = useContext(AuthGlobal);

    useEffect(() => {
        // setOrderItems(cartItems)
        // console.log(context.stateUser.userProfile)
        if(context.stateUser.isAuthenticated) {
            setUser(context.stateUser.userProfile._id)
        } else {
            navigation.navigate("User",{ screen: 'Login' });
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Please Login to Checkout",
                text2: ""
            });
        }
        return
    }, [])

    const checkOut = () => {
        // console.log("orders", orderItems)
        const order = {
            user,
            dateOrdered: Date.now(),
            status: "Pending",
            // orderItems,
            shippingInfo: {
              address1,
              address2,
              city,
              phone,
              zip,
              country,
            },
          };
          
          // Check if required shipping information is present
          if (!order) {
            alert("Please fill in all required shipping information!");
            return;
          }
          
          console.log("order to be paid:", order); // Add debug log
          navigation.navigate("Payment", { order });

    }

    return (

        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Shipping Address"}>
                <Input
                    placeholder={"Phone"}
                    name={"phone"}
                    value={phone}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setPhone(text)}
                />
                <Input
                    placeholder={"Shipping Address 1"}
                    name={"ShippingAddress1"}
                    value={address1}
                    onChangeText={(text) => setAddress1(text)}
                />
                <Input
                    placeholder={"Shipping Address 2"}
                    name={"ShippingAddress2"}
                    value={address2}
                    onChangeText={(text) => setAddress2(text)}
                />
                <Input
                    placeholder={"City"}
                    name={"city"}
                    value={city}
                    onChangeText={(text) => setCity(text)}
                />
                <Input
                    placeholder={"Zip Code"}
                    name={"zip"}
                    value={zip}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setZip(text)}
                />
                <Select
                    width="80%"
                    iosIcon={<Icon name="arrow-down" color={"#007aff"} />}
                    style={{ width: undefined }}
                    selectedValue={country}
                    placeholder="Select your country"
                    placeholderStyle={{ color: '#007aff' }}
                    placeholderIconColor="#007aff"
                    onValueChange={(e) => setCountry(e)}

                >
                    {countries.map((c) => {
                        return <Select.Item
                            key={c.code}
                            label={c.name}
                            value={c.name}
                        />
                    })}
                </Select>
               
                <View style={{ width: '80%', alignItems: "center" }}>
                    <Button title="Confirm" onPress={() => checkOut()} />
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>

    )
}
export default Checkout;