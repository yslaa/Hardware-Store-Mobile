import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Center } from 'react-native';
import axios from 'axios'; 
import { useFocusEffect } from '@react-navigation/native';
import baseURL from '@assets/commons/baseurl';
import { logger } from 'react-native-logs';
import ProductList from './ProductList';
import { FlatList, Icon, Input, VStack, extendTheme } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import SearchedProduct from './SearchedProduct';

const { width, height } = Dimensions.get("window");
const log = logger.createLogger();

const ProductContainer = () => {
    const [products, setProducts] = useState([]);
    const [active, setActive] = useState([]);
    const [initialState, setInitialState] = useState([]);
    const [focus, setFocus] = useState(false);
    const [productsCtg, setProductsCtg] = useState([]);
    const [productsFiltered, setProductsFiltered] = useState([]);

 
    useFocusEffect((
        useCallback(
            () => {
                setFocus(false);
                setActive(-1);
                axios
                    .get(`${baseURL}products`)
                    .then((res) => {
                        setProducts(res.data);
                        setInitialState(res.data);
                        setProductsCtg(res.data);
                        setProductsFiltered(res.data);
                        console.log('Response data:', res.data);
                    })
                    .catch((error) => {
                        console.log('Api call error', error);
                    })

                return () => {
                    setProducts([]);
                    setFocus();
                    setActive();
                    setInitialState();
                    setProductsFiltered([]);
                };
            },
            [],
        )
    ))

    const searchProduct = (text) => {
        if (!text) {
            setProductsFiltered(products);
            setFocus(false); // Remove focus when the search input is empty
        } else {
            setProductsFiltered(
                products.details.filter((product) => product.product_name.toLowerCase().includes(text.toLowerCase()))
            );
            setFocus(true); // Set focus when there is text in the search input
        }
    };

    const openList = () => {
        setFocus(true);
    }

    const onBlur = () => {
        setFocus(false);
    }
 

    return (
   
        <View style={styles.container}>
              <VStack w="100%" space={5} alignSelf="center">
                    <Input
                        onFocus={openList}
                        onChangeText={(text) => searchProduct(text)}
                        placeholder="Search"
                        variant="filled"
                        width="100%"
                        borderRadius="10"
                        py="1"
                        px="2"
                        InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="search" />} />}
                        // InputRightElement={focus == true ? <SmallCloseIcon onPress={onBlur} /> : null}
                        InputRightElement={focus === true ? <Icon ml="2" size="4" color="gray.400" as={<Ionicons name="close" style = {{fontSize: 15, marginRight: 5}} onPress={() => { onBlur() }}  />} /> : null}
                    />
                </VStack>
                {focus === true ? (
                   <SearchedProduct
                   productsFiltered={productsFiltered}
               />
                    ) : (

        <ScrollView>
           {productsCtg.details && productsCtg.details.length > 0 ? (
    <View style={styles.listContainer}>
        {productsCtg.details.map((item) => {
            return(
                                            <ProductList
                                                key={item._id.$oid}
                                                item={item}
                                            />
                                        )
            })}
    </View>
) : (
    <View style={[styles.center, { height: height / 2 }]}>
        <Text>No products found</Text>
    </View>
)}


        </ScrollView>
        
                    )}

                    
    </View>
 
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gainsboro',
    },
    listContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        backgroundColor: 'gainsboro',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProductContainer;