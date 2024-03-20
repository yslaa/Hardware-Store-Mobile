import { View, Text } from 'react-native'
import React from 'react'
import Cart from '@screens/Cart/Cart'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()
const index = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen 
        name = "Cart"
        component={Cart}
        options={{  
            headerShown: false
        }}
        />
    </Stack.Navigator>
  )
}

export default index