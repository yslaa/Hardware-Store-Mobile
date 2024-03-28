import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer'
import {NativeBaseProvider,Button,Box,HamburgerIcon,Pressable,Heading,VStack,Text,Center,HStack,Divider,Icon} from "native-base";
import React, { useContext } from 'react'
import 'react-native-gesture-handler';
import ProductContainer from '@screens/Product/ProductContainer';
import Login from '@screens/User/Login';
import Main from '../../../Main';
import Cart from '@screens/Cart/Cart'
import AdminNavigator from "@navigators/AdminNavigator"
import ProductList from '@screens/Product/ProductList';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { Alert, BackHandler } from 'react-native';
import AuthGlobal from '@context/Store/AuthGlobal';

global.__reanimatedWorkletInit = () => { };
const Drawer = createDrawerNavigator()

const getIcon = (screenName) => {
    switch (screenName) {
      case "Home":
        return "home-outline";
      case "Products":
        return "cube-outline";
      case "User Profile":
        return "person-circle-outline";
        case "Cart":
        return "cart-outline";
      case "Product List":
        return "archive";
      case "Trash":
        return "trash-can";
      case "Spam":
        return "alert-circle";
        case "Brands":
        return "briefcase-outline";
      default:
        return undefined;
    }
  };

 

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props} safeArea>
        <VStack space="6" my="2" mx="1">
          <Box px="4">
            <Text bold color="gray.700">
              Mail
            </Text>
            <Text fontSize="14" mt="1" color="gray.500" fontWeight="500">
              john_doe@gmail.com
            </Text>
          </Box>
          <VStack divider={<Divider />} space="4">
            <VStack space="3">
              {props.state.routeNames.map((name, index) => (
                <Pressable
                  px="5"
                  py="3"
                  rounded="md"
                  bg={
                    index === props.state.index
                      ? "rgba(6, 182, 212, 0.1)"
                      : "transparent"
                  }
                  onPress={(event) => {
                    props.navigation.navigate(name);
                  }}
                >
                  <HStack space="7" alignItems="center">
                    <Icon
                      color={
                        index === props.state.index ? "primary.500" : "gray.500"
                      }
                      size="5"
                      as={<Ionicons name={getIcon(name)} />}
                    />
                    <Text
                      fontWeight="500"
                      color={
                        index === props.state.index ? "primary.500" : "gray.700"
                      }
                    >
                      {name}
                    </Text>
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          </VStack>
        </VStack>
      </DrawerContentScrollView>
    );
  }
  
const Index = () => {
  const context = useContext(AuthGlobal)

  // console.log(context.stateUser.user.UserInfo.roles.includes("Customer"));
  const handleBackPress = () => {
    Alert.alert("Exit App", "Exiting the application?",[
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      {
        text: "Ok",
        onPress: () => BackHandler.exitApp()
      },
    ]);
    return true
  };

  useFocusEffect(
    React.useCallback(() => 
    {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress)

      return() => 
      {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress)
      }
    })
  )
  return (
    <Box safeArea flex={1}>
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >

      <Drawer.Screen
        name="Home"
        options={{
          drawerLabel: 'Home',
          title: 'Home Screen',
        }}
        component={Main}
      />
       {context.stateUser && context.stateUser.user && context.stateUser.user.UserInfo && context.stateUser.user.UserInfo.roles && context.stateUser.user.UserInfo.roles.includes("Admin") ? (
      <>
      <Drawer.Screen name="Product List" component={Main} initialParams={{ screen: 'Admin' }} />
     <Drawer.Screen name="Brands" component={Main} initialParams={{ screen: 'Brand' }} /> 
     <Drawer.Screen name="User Profile" component={Main} initialParams={{ screen: 'User' }} />
      </>
      ) : (
        <>
    <Drawer.Screen name="Products" component={Main} initialParams={{ screen: 'Products' }} />
      <Drawer.Screen name="Cart" component={Main} initialParams={{ screen: 'Cart' }} /> 
      <Drawer.Screen name="User Profile" component={Main} initialParams={{ screen: 'User' }} />
     </>
      )}
    </Drawer.Navigator>
  </Box>
  )
}

export default Index