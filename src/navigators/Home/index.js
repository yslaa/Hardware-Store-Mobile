import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProductContainer from '@screens/Product/ProductContainer'; // Adjust the import path if necessary
import SingleProduct from '@screens/Product/SingleProduct'

const Stack = createStackNavigator();

const Home = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Product'
                component={ProductContainer}
                options={{ headerShown: false }}
            />
             <Stack.Screen
                name='Product Detail'
                component={SingleProduct}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
        
    );
};

export default Home;