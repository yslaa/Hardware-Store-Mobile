import { createStackNavigator } from '@react-navigation/stack'
import Products from '@screens/Admin/Products'
import React from 'react'

const Stack = createStackNavigator()
const Index = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen 
        name="Products" 
        component={Products}
        options={{
            title: "Products"
        }}
        />
    </Stack.Navigator>
  )
}

export default Index