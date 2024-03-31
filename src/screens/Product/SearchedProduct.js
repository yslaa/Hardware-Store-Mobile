import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native'
import {
    Container,
    VStack,
    Input,
    Heading,
    Text,
    Icon,
    HStack,
    Box,
    Avatar,
    Spacer,
} from "native-base";

import { useNavigation } from '@react-navigation/native';

var { width } = Dimensions.get("window")

const SearchedProduct = (props) => {
    const { productsFiltered } = props;
    const navigation = useNavigation();
 console.log(productsFiltered)
    if (!Array.isArray(productsFiltered)) {
        return (
            <View style={styles.center}>
                <Text style={{ alignSelf: 'center' }}>
                    No products match the selected criteria
                </Text>
            </View>
        );
    }

    return (
        <Container style={{ width: width }}>
            {productsFiltered.length > 0 ? (
                <Box width={80}>
                    <FlatList data={productsFiltered} renderItem={({ item }) =>
                        <TouchableOpacity
                            style={{ width: '50%' }}
                            onPress={() => navigation.navigate("Product Detail", { item: item })}
                        >
                            <Box borderBottomWidth="1" _dark={{
                                borderColor: "muted.50"
                            }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
                                <HStack space={[2, 3]} justifyContent="space-between">
                                    <Avatar size="48px" source={{
                                        uri: item.image[0].url
                                    }} />
                                    <VStack>
                                        <Text _dark={{
                                            color: "warmGray.50"
                                        }} color="coolGray.800" bold>
                                            {item.product_name}
                                        </Text>
                                        <Text color="coolGray.600" _dark={{
                                            color: "warmGray.200"
                                        }}>
                                            {item.description}
                                        </Text>
                                    </VStack>
                                    <Spacer />
                                    <Text fontSize="xs" _dark={{
                                        color: "warmGray.50"
                                    }} color="coolGray.800" alignSelf="flex-start">
                                        {item.price}
                                    </Text>
                                </HStack>
                            </Box>
                        </TouchableOpacity>} keyExtractor={item => item._id} />
                </Box>
            ) : (
                <View style={styles.center}>
                    <Text style={{ alignSelf: 'center' }}>
                        No products match the selected criteria
                    </Text>
                </View>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
      
    },
});

export default SearchedProduct;