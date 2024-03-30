
import React, { Component, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator();
import Register from '@screens/User/Register';
import Login from '@screens/User/Login';
import UserProfile from '@screens/User/UserProfile';
import UserEdit from '@screens/User/UserEdit'
import UserWishlist from '@screens/User/WishlistList'
import History from '@screens/User/History'
import OrderDetails from '@screens/User/OrderDetails'
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserNavigation = (props) => {
   
    return (
        <Stack.Navigator>
     
                <>
                    <Stack.Screen
                        name='Login'
                        component={Login}
                        options={{
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name='Register'
                        component={Register}
                        options={{
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                    name='User Profile'
                    component={UserProfile}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name='Edit User'
                    component={UserEdit}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name='User Wishlist'
                    component={UserWishlist}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name='User History'
                    component={History}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name='Order Details'
                    component={OrderDetails}
                    options={{
                        headerShown: false
                    }}
                />
            </>
        </Stack.Navigator>
    );
};


export default UserNavigation;
