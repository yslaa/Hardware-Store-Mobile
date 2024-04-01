import { createStackNavigator } from '@react-navigation/stack'
import Charts from '@screens/Admin/Charts'
import React from 'react'

const Stack = createStackNavigator()
const index = () => {
return (
    <Stack.Navigator>
        <Stack.Screen
        name="Charts"
        component={Charts}
        options={{
            headerShown: false
        }}
        />
    </Stack.Navigator>
)
}

export default index