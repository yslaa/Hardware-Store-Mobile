import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import Orders from "../../screens/Admin/Orders"


const Stack = createStackNavigator();

const index= () => {
    
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Orders"
                component={Orders}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}
export default  index