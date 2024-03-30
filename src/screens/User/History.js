import React, { useCallback, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, RefreshControl } from 'react-native'
import axios from 'axios'
import baseURL from "../../../assets/commons/baseurl";
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AuthGlobal from "@context/Store/AuthGlobal"
import { Box } from 'native-base'
// import { Button, DatePicker } from 'react-native-datepicker';
import HistoryCard from "../../shared/HistoryCard";

var { height, width } = Dimensions.get("window");

const Orders = (props) => {
  const [orderList, setOrderList] = useState([])
  const [token, setToken] = useState('')
  const context = useContext(AuthGlobal)
//   const [startDate, setStartDate] = useState(new Date())
//   const [endDate, setEndDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const userID = context.stateUser.userProfile._id

  console.log(`${baseURL}transactions`)
  
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => {
        setToken(res)
        axios
            .get(`${baseURL}transactions`, {
                  headers: { Authorization: `Bearer ${res}`}
            })
            .then((x) => {
                const data = x.data.details;
                console.log(data)
                const transactions = x.data.details;

            // Filter transactions based on userID
                const userOrders = transactions.filter((order) => order.user && order.user === userID);
                setOrderList(userOrders);
                setLoading(false)
        })
        .catch((error) => console.log(error))
      })
      .catch((error) => console.log(error))
      },
      [],
    )
  )

  const onRefresh = useCallback(() =>{
    setRefreshing(true)
    setTimeout(() =>
    {
      axios.get(`${baseURL}transactions`, config)
        .then((res)=>
        {
          setOrderList(res.data)
          setLoading(false)
        })
        setRefreshing(false);
    }, 500)
  })

  console.log("Orders: ", orderList)

    //   const filterByDateRange = () => {
    //     if (!orderList) return; // Handle empty orderList

    //     const filteredOrders = orderList.filter(order => {
    //       const orderDate = new Date(order.dateOrdered); // Assuming 'dateOrdered' exists
    //       return orderDate >= startDate && orderDate <= endDate;
    //     });
    //     setOrderList(filteredOrders);
    //   }

  return (
    <Box flex={1}> 
      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={orderList} // Use orderList directly
          renderItem={({ item }) => (
            <HistoryCard
              item={item} 
            />
          )}
          keyExtractor={(item) => item.id} // Assuming 'id' exists for unique key
        />
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
    listHeader: {
        flexDirection: 'row',
        padding: 5,
        backgroundColor: 'gainsboro'
    },
    headerItem: {
        margin: 3,
        width: width / 6
    },
    spinner: {
        height: height / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        marginBottom: 160,
        backgroundColor: 'white'
    },
    buttonContainer: {
        margin: 20,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    buttonText: {
        marginLeft: 4,
        color: 'white'
    },
    dateRangeContainer: {
        padding: 10,
        margin: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
    },
})

export default Orders;
