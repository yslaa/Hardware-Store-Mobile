import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "@navigators/Home";
import UserNavigator from "@navigators/UserNavigator";
import CartNavigator from "@navigators/CartNavigator"
import AdminNavigator from "@navigators/AdminNavigator"
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "native-base";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#e91e63",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <Ionicons
                name="home-outline"
                style={{ position: "relative" }}
                color="black"
                size={30}
              />
            );
          },
        }}
      />

 <Tab.Screen
        name="Admin"
        component={AdminNavigator}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <Ionicons
                name="briefcase-outline"
                style={{ position: "relative" }}
                color="black"
                size={30}
              />
            );
          },
        }}
      />

 <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <Ionicons
                name="cart-outline"
                style={{ position: "relative" }}
                color="black"
                size={30}
              />
            );
          },
        }}
      />
      
      <Tab.Screen
        name="User"
        component={UserNavigator}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <Ionicons
                name="person-circle-outline"
                style={{ position: "relative" }}
                color="black"
                size={30}
              />
            );
          },
        }}
      />

     
    </Tab.Navigator>
  );
};

export default Main;
