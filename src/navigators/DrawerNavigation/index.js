import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer'
import {NativeBaseProvider,Button,Box,HamburgerIcon,Pressable,Heading,VStack,Text,Center,HStack,Divider,Icon, Avatar, Image} from "native-base";
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
import { Alert, BackHandler, ImageBackground } from 'react-native';
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
      case "User List":
        return "person-outline";
      case "Admin Order":
        return "receipt-outline";
        case "Chart":
        return "bar-chart-outline";
      default:
        return undefined;
    }
  };

 

  function CustomDrawerContent(props) {
    const context = useContext(AuthGlobal)
    // console.log(context.stateUser.userProfile.email);
    return (
      <DrawerContentScrollView {...props} style={{ backgroundColor: "#FFE69A"}} safeArea>
        <VStack space="6" my="2" mx="1">
<Box px="4" >
<HStack space="4" alignItems="center">
  <Avatar source={{ uri: context.stateUser.userProfile && context.stateUser.userProfile.image && context.stateUser.userProfile.image[0].url }} size="md" />
  <VStack alignItems="flex-start">
    <Text bold color="gray.700">
    {context.stateUser && context.stateUser.userProfile && context.stateUser.userProfile.name ? context.stateUser.userProfile.name : ""}
    </Text>
    <Text fontSize="14" color="gray.500" fontWeight="500">
      {context.stateUser && context.stateUser.userProfile && context.stateUser.userProfile.email ? context.stateUser.userProfile.email : ""}
    </Text>
  </VStack>
</HStack>

</Box>
          <VStack divider={<Divider  />} space="4">
            <VStack space="3"  >
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
                  <HStack space="7" alignItems="center" >
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

  const LogoTitle = () => {
    return (
      <ImageBackground
      style={{ width: 120, height: 60,  left: 180, tintColor: 'red' }} 
        source={require('@assets/output-onlinepngtools.png')}
      />
    );
  };
  
  return (
    <Box safeArea style={{ backgroundColor: "#FFE69A"}} flex={1}>
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props}  
      drawerStyle={{ backgroundColor: "#FFE69A" }}  />}
    >

      <Drawer.Screen
        name="Home"
        options={{
          drawerLabel: 'Home',
          title: 'Home Screen',
          headerStyle: {
            backgroundColor: '#FFE69A'
          },
          headerTitle: props => <LogoTitle {...props} />,
        }}
        component={Main}
      />
       {context.stateUser && context.stateUser.user && context.stateUser.user.UserInfo && context.stateUser.user.UserInfo.roles && context.stateUser.user.UserInfo.roles.includes("Admin") ? (
      <>
      <Drawer.Screen name="Product List" component={Main} initialParams={{ screen: 'Admin' }} options={{
          headerStyle: {
            backgroundColor: '#FFE69A'
          },
          headerTitle: props => <LogoTitle {...props} />,
        }} />
        <Drawer.Screen name="Chart" component={Main} initialParams={{ screen: 'Chart' }} options={{
          headerStyle: {
            backgroundColor: '#FFE69A'
          },
          headerTitle: props => <LogoTitle {...props} />,
        }}/> 
        <Drawer.Screen name="Brands" component={Main} initialParams={{ screen: 'Brand' }} options={{
          headerStyle: {
            backgroundColor: '#FFE69A'
          },
          headerTitle: props => <LogoTitle {...props} />,
        }}/> 
     <Drawer.Screen name="Admin Order" component={Main} initialParams={{ screen: 'Admin Order' }} options={{
          headerStyle: {
            backgroundColor: '#FFE69A'
          },
          headerTitle: props => <LogoTitle {...props} />,
        }}/>
     <Drawer.Screen name="User List" component={Main} initialParams={{ screen: 'User List' }} options={{
          headerStyle: {
            backgroundColor: '#FFE69A'
          },
          headerTitle: props => <LogoTitle {...props} />,
        }}/>
     <Drawer.Screen name="User Profile" component={Main} initialParams={{ screen: 'User' }} options={{
          headerStyle: {
            backgroundColor: '#FFE69A'
          },
          headerTitle: props => <LogoTitle {...props} />,
        }}/>
      </>
      ) : (
        <>
    <Drawer.Screen name="Products" component={Main} initialParams={{ screen: 'Products' }}  options={{
          headerStyle: {
            backgroundColor: '#FFE69A'
          },
          headerTitle: props => <LogoTitle {...props} />,
        }}/>
      <Drawer.Screen name="Cart" component={Main} initialParams={{ screen: 'Cart' }} options={{
          headerStyle: {
            backgroundColor: '#FFE69A'
          },
          headerTitle: props => <LogoTitle {...props} />,
        }} /> 
      <Drawer.Screen name="User Profile" component={Main} initialParams={{ screen: 'User' }} options={{
          headerStyle: {
            backgroundColor: '#FFE69A'
          },
          headerTitle: props => <LogoTitle {...props} />,
        }} />
     </>
      )}
    </Drawer.Navigator>
  </Box>
  )
}

export default Index