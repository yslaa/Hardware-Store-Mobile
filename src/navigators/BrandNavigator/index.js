import { createStackNavigator } from '@react-navigation/stack'
import Brand from '@screens/Admin/Brand'
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
    </Stack.Navigator>
  )
}

export default index