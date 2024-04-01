import { createStackNavigator } from '@react-navigation/stack'
import Products from '@screens/Admin/Products'
import ProductForm from '@screens/Admin/ProductForm'
import ProductUpdate from '@screens/Admin/ProductUpdate'
import React from 'react'

const Stack = createStackNavigator()
const Index = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen 
        name="Products" 
        component={Products}
        options={{
          headerShown: false
      }}
        />
        <Stack.Screen name="ProductForm" component={ProductForm}/>
        <Stack.Screen name="ProductUpdate" component={ProductUpdate}/>
    </Stack.Navigator>
  )
}

export default Index