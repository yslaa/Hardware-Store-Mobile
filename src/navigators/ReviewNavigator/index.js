import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import Reviews from "../../screens/User/Reviews"
import ReviewUpdate from "../../screens/User/ReviewUpdate";


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
            <Stack.Screen name="ReviewUpdate" component={ReviewUpdate}/>
        </Stack.Navigator>
    )
}
export default  index