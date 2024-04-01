import { createStackNavigator } from '@react-navigation/stack'
import Brand from '@screens/Admin/Brand'
// import BrandTest from '@screens/Admin/BrandTest'
import BrandForm from '@screens/Admin/BrandForm'
import BrandUpdate from '@screens/Admin/BrandUpdate'
import React from 'react'

const Stack = createStackNavigator()
const index = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen
        name="Brand"
        component={Brand}
        options={{
          headerShown: false
      }}
        />
        <Stack.Screen name="BrandForm" component={BrandForm}/>
        <Stack.Screen name="BrandUpdate" component={BrandUpdate}/>
    </Stack.Navigator>
  )
}

export default index