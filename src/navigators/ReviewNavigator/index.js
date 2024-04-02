import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import Reviews from "../../screens/User/Reviews"


const Stack = createStackNavigator();

const index= () => {
    
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Reviews"
                component={Reviews}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}
export default  index