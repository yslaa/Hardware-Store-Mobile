import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '@navigators/Home'; 
import ProductContainer from '@screens/Product/ProductContainer';

const Stack = createStackNavigator();

const Main = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home} />  
            </Stack.Navigator> 
        </NavigationContainer>     
    );
};

export default Main;