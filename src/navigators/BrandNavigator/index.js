import { createStackNavigator } from '@react-navigation/stack'
import Brand from '@screens/Admin/Brand'
import BrandTest from '@screens/Admin/BrandTest'
import BrandForm from '@screens/Admin/BrandForm'
import React from 'react'

const Stack = createStackNavigator()
const index = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen
        name="Brand"
        component={Brand}
        options={{
            title: "Brand"
        }}
        />
        <Stack.Screen name="BrandForm" component={BrandForm}/>
        <Stack.Screen name="BrandTest" component={BrandTest}/>
    </Stack.Navigator>
  )
}

export default index