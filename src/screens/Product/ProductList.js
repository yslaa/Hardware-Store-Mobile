import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { Logs } from 'expo';
import ProductCard from './ProductCard';

const { width } = Dimensions.get('screen');

const ProductList = (props) => {
  Logs.enableExpoCliLogging()
  const { item } = props;
  const navigation = useNavigation();

  // console.log('item:', props)
  return (
    <TouchableOpacity
      style={{ width: '50%', }}
      onPress={() => navigation.navigate("Product Detail", { item: item })}
      
    >
      <View style={{ width: width / 2, backgroundColor: '#FFFFFF',}}>
        <ProductCard {...item} />
      </View>
    </TouchableOpacity>
  )
}

export default ProductList;