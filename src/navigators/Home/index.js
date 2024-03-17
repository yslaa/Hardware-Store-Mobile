import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProductContainer from '@screens/Product/ProductContainer'; // Ensure the correct import path
import { createStackNavigator } from '@react-navigation/stack';

const  Stack = createStackNavigator()

const Home = () => {
    // You can't directly access baseURL here, make sure to import it wherever needed
    return (
        <Stack.Navigator>
            <Stack.Screen name='Product' component={ProductContainer} options={{headerShown: false}} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Home;