
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator();

import Register from '@screens/User/Register';

const UserNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
            name='Register'
            component={Register}
            options={{
                headerShown:false
            }}
            />

            

        </Stack.Navigator>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});


export default UserNavigation;
