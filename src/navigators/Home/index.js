import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProductContainer from '@screens/Product/ProductContainer'; // Adjust the import path if necessary

const Stack = createStackNavigator();

const Home = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Product'
                component={ProductContainer}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default Home;