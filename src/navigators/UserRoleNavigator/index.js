import { createStackNavigator } from '@react-navigation/stack'
import User from '@screens/Admin/User'
import React from 'react'

const Stack = createStackNavigator()
const Index = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen 
        name="UserAll" 
        component={User}
        options={{
            title: "User"
        }}
        />
    </Stack.Navigator>
  )
}

export default Index