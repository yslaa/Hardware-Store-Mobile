import { View, Text } from 'react-native'
import React from 'react'
import Cart from '@screens/Cart/Cart'
import { createStackNavigator } from '@react-navigation/stack'
import CheckoutNavigator from '../CheckoutNavigator/index'

const Stack = createStackNavigator()

const Index = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen 
        name = "Cart"
        component={Cart}
        options={{  
            headerShown: false
        }}
        />
        <Stack.Screen 
          name="Checkout"
          component={CheckoutNavigator}
          options={{
            title: 'Checkout' 
          }}
        />
    </Stack.Navigator>
  )
}

export default Index