import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { Container, Image } from "native-base"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"
import baseURL from "@assets/commons/baseurl"
import AuthGlobal from "@context/Store/AuthGlobal"
import { logoutUser } from "@context/Actions/Auth.actions"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
// import OrderCard from '../../Shared/OrderCard';


const UserProfile = () => {
    const context = useContext(AuthGlobal)
    const [userProfile, setUserProfile] = useState('')
    // const [orders, setOrders] = useState([])
    const navigation = useNavigation()

    useFocusEffect(
        useCallback(() => {
            if (
                context.stateUser.isAuthenticated === false ||
                context.stateUser.isAuthenticated === null
            ) {
                navigation.navigate("Login")
            }
            // console.log("context", context.stateUser.userProfile._id)
            AsyncStorage.getItem("jwt")
                .then((res) => {
                    axios
                        .get(`${baseURL}user/${context.stateUser.userProfile._id}`, {
                            headers: { Authorization: `Bearer ${res}` },
                        })
                        .then((user) => setUserProfile(user.data))
                })
                .catch((error) => console.log(error))
            // axios
            //     .get(`${baseURL}orders`)
            //     .then((x) => {
            //         const data = x.data;
            //         console.log(data)
            //         const userOrders = data.filter(
            //             (order) =>
            //                 // console.log(order)
            //                 order.user ? (order.user._id === context.stateUser.user.userId) : false

            //         );
            //         setOrders(userOrders);
            //     })
            //     .catch((error) => console.log(error))
            return () => {
                setUserProfile();
                // setOrders()
            }

        }, [context.stateUser.isAuthenticated]))

        // console.log("prof:" ,userProfile.details)
    return (
        // <Container style={styles.container}>
        //     <ScrollView contentContainerStyle={styles.subContainer}>
        //         <Text style={{ fontSize: 30 }}>
        //             {userProfile ? userProfile.details.name : ""}
        //         </Text>
        //         <View style={{ marginTop: 20 }}>
        //             <Text style={{ margin: 10 }}>
        //                 Email: {userProfile ? userProfile.details.email : ""}
        //             </Text>
        //         </View>
        //         <View style={{ marginTop: 80 }}>
        //             <Button title={"Sign Out"} onPress={() => [
        //                 AsyncStorage.removeItem("jwt"),
        //                 logoutUser(context.dispatch)
        //             ]} />
        //             {/* <View style={styles.order}>
        //                 <Text style={{ fontSize: 20 }}>My Orders</Text>
        //                 <View>
        //                     {orders ? (
        //                         orders.map((order) => {
        //                             return <OrderCard key={order.id} item={order} select="false" />;
        //                         })
        //                     ) : (
        //                         <View style={styles.order}>
        //                             <Text>You have no orders</Text>
        //                         </View>
        //                     )}
        //                 </View>
        //             </View> */}
        //         </View>

        //     </ScrollView>
        // </Container>
    
         <View style={styles.container}>
            
         <View style={styles.header}>
           <View style={styles.headerContent}>
             <Image
               style={styles.avatar}
               source={{ uri: userProfile ? userProfile.details.image[0].url  : "" }}
             />
             <TouchableOpacity 
             onPress={() => navigation.navigate("Edit User")}
            variant={"ghost"} >
            <Text> Edit </Text>
            </TouchableOpacity>
             <Text style={styles.name}> {userProfile ? userProfile.details.name : ""}</Text>
             <Text style={{fontSize: 13}}> Email: {userProfile ? userProfile.details.email : ""}</Text>
           </View>
           <Button title={"Sign Out"} onPress={() => [
                        AsyncStorage.removeItem("jwt"),
                        logoutUser(context.dispatch)
                    ]} />
         </View>
        
        
   
        
       </View>
    )
}

const styles = StyleSheet.create({
    header: {
      backgroundColor: '#00CED1',
    },
    headerContent: {
      padding: 30,
      alignItems: 'center',
    },
    avatar: {
      width: 130,
      height: 130,
      borderRadius: 63,
      borderWidth: 4,
      borderColor: 'white',
      marginBottom: 10,
    },
    name: {
      fontSize: 20,
      color: 'black',
      fontWeight: '600',
    },
    title: {
      fontSize: 20,
      color: '#00CED1',
    },
    count: {
      fontSize: 18,
    },
    bodyContent: {
      flex: 1,
      alignItems: 'center',
      padding: 30,
      marginTop: 40,
    },
    textInfo: {
      fontSize: 18,
      marginTop: 20,
      color: '#696969',
    },
    buttonContainer: {
      marginTop: 10,
      height: 45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      width: 250,
      borderRadius: 30,
      backgroundColor: '#00CED1',
    },
    description: {
      fontSize: 20,
      color: 'black',
      marginTop: 10,
      textAlign: 'center',
    },
    icon: {
        fontSize: 20,
        marginLeft: 10,

    }
  })



export default UserProfile