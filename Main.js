import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "@navigators/Home";
import UserNavigator from "@navigators/UserNavigator";
import CartNavigator from "@navigators/CartNavigator"
import AdminNavigator from "@navigators/AdminNavigator"
import BrandNavigator from "@navigators/BrandNavigator"
import OrderNavigator from "@navigators/OrderNavigator"
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "native-base";
import AuthGlobal from "@context/Store/AuthGlobal";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Main = () => {
  const context = useContext(AuthGlobal)

  return (
    <>
    <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarHideOnKeyboard: true,
      tabBarShowLabel: false,
      tabBarActiveTintColor: "#FFFFFF",
      tabBarStyle: {
        backgroundColor: "#FFE69A", 
      },
      headerStyle: {
        backgroundColor: '#FFE69A',
      },
       }}
  >
    {context.stateUser && context.stateUser.user && context.stateUser.user.UserInfo && context.stateUser.user.UserInfo.roles && context.stateUser.user.UserInfo.roles.includes("Admin") ? (
     <>
     <Tab.Screen
        name="Admin"
        component={AdminNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="hammer-outline"
              style={{ position: "relative" }}
              color="black"
              size={30}
            />
          ),
        }}
      />

<Tab.Screen
          name="Brand"
          component={BrandNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="briefcase-outline"
                style={{ position: "relative" }}
                color="black"
                size={30}
              />
            ),
          }}
        />

      <Tab.Screen
          name="Admin Order"
          component={OrderNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="receipt-outline"
                style={{ position: "relative" }}
                color="black"
                size={30}
              />
            ),
          }}
        />
        
       <Tab.Screen
          name="User"
          component={UserNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="person-circle-outline"
                style={{ position: "relative" }}
                color="black"
                size={30}
              />
            ),
          }}
        />

        </>

        
    ) : (
      <>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="home-outline"
                style={{ position: "relative" }}
                color="black"
                size={30}
              />
            ),
          }}
        />
  
        <Tab.Screen
          name="Cart"
          component={CartNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="cart-outline"
                style={{ position: "relative" }}
                color="black"
                size={30}
              />
            ),
          }}
        />
  
        <Tab.Screen
          name="User"
          component={UserNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="person-circle-outline"
                style={{ position: "relative" }}
                color="black"
                size={30}
              />
            ),
          }}
        />
      </>
    )}
  </Tab.Navigator>
  </>
  );
};

export default Main;
