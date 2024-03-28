import React, { useState } from 'react'
import { View, Button, Pressable, FlatList, TouchableOpacity, Dimensions, } from 'react-native'
import {
    Container,
    Text,
    Radio,
    Right,
    Left,
    Picker,
    Box,
    HStack,
    VStack,
    Heading,
    Divider,
    CheckCircleIcon,
    Select,
    CheckIcon,
    Center,

} from 'native-base';

import { useNavigation } from '@react-navigation/native';

const methods = [
    { name: 'Cash on Delivery', value: 1 },
    { name: 'Bank Transfer', value: 2 },
    { name: 'Card Payment', value: 3 }
]

const paymentCards = [
    { name: 'Wallet', value: 1 },
    { name: 'Visa', value: 2 },
    { name: 'MasterCard', value: 3 },
    { name: 'Other', value: 4 }
]

const Payment = (props) => {
    const { route } = props;
    const { params: order } = route;
    const [selected, setSelected] = useState('');
    const [card, setCard] = useState('');
    console.log(order)
    const navigation = useNavigation()

    const pay = () => {

        const orders = {
            ...order,
            payment: {
                value: selected,
                card
            }
        }
        
          // Check if required shipping information is present
          if (!orders) {
            alert("Pass the order!");
            return;
          }

          console.log("order to confirm:", orders); // Add debug log
          navigation.navigate("Confirm", { orders });
    }

    return (
        <Center  >
            <Heading>
                <Text>Choose your payment method</Text>
            </Heading>

            <HStack bg="red.200" width="100%"  >
                <Radio.Group
                    name="myRadioGroup"
                    value={selected}
                    onChange={(value) => {
                        setSelected(value);
                    }}

                >
                    {console.log(selected)}
                    {methods.map((item, index) => {
                        return (
                            <Radio
                                key={index}
                                value={item.name} my="1"
                                colorScheme="green"
                                size="22"
                                style={{ float: 'right' }}
                                icon={<CheckCircleIcon size="22" mt="0.5" color="emerald.500" />}

                            >
                                {item.name}
                            </Radio>
                        )
                    })
                    }
                </Radio.Group>
            </HStack>
            {selected === "Card Payment" ? (
                <Box>
                    <Select
                        minWidth="100%"
                        placeholder="Choose Service"
                        selectedValue={card}
                        onValueChange={(x) => setCard(x)}
                        _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }}
                    >
                        {console.log(card)}
                        {paymentCards.map((c, index) => {
                            return (
                                <Select.Item
                                    key={c.name}
                                    label={c.name}
                                    value={c.name} />
                            )
                        })}

                    </Select>
                </Box>
            ) : null}
            <View style={{ marginTop: 60, alignSelf: 'center' }}>
                <Button
                    title={"Confirm"}
                    onPress={() => pay()} />
            </View>
        </Center>
    )
}
export default Payment;