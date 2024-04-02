import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker, Select } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import TrafficLight from "./StyledComponents/TrafficLight";
import EasyButton from "./StyledComponents/EasyButton";
import Toast from "react-native-toast-message";

import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios";
import baseURL from "../../assets/commons/baseurl";
import { useNavigation } from '@react-navigation/native'

const codes = [
  { name: "Pending", code: "1" },
  { name: "Completed", code: "2" },
  { name: "Cancelled", code: "3" },
];
const OrderCard = ({ item }) => {
  const [orderStatus, setOrderStatus] = useState();
  const [statusText, setStatusText] = useState('');
  const [statusChange, setStatusChange] = useState('');
  const [token, setToken] = useState('');
  const [cardColor, setCardColor] = useState('');
  const navigation = useNavigation()

  
  useEffect(() => {
    AsyncStorage.getItem("jwt")
        .then((res) => {
            setToken(res)
        })
        .catch((error) => console.log("Errors:", error))
}, [])

  const updateOrder = () => {
    // AsyncStorage.getItem("jwt")
    //   .then((res) => {
    //     setToken(res);
    //   })
    //   .catch((error) => console.log(error));
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const order = {
      dateOrdered: item.dateOrdered,
      id: item._id,
      status: statusChange,
    };

    
    console.log("Order to Update", order)
    console.log("Token", config)

    axios
      .patch(`${baseURL}transaction/edit/${order.id}`, order, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Transaction Edited",
            text2: "",
          });
          setTimeout(() => {
            navigation.navigate("Orders");
          }, 100);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
        console.log(error.response.data)
      });
  }
  useEffect(() => {
    if (item.status === "Pending") {
      setOrderStatus(<TrafficLight limited></TrafficLight>);
      setStatusText("Pending");
      setCardColor("#F1C40F");
    } else if (item.status === "Completed") {
      setOrderStatus(<TrafficLight available></TrafficLight>);
      setStatusText("Completed");
      setCardColor("#2ECC71");
    } else {
      setOrderStatus(<TrafficLight unavailable></TrafficLight>);
      setStatusText("Cancelled");
      setCardColor("#E74C3C");
    }

    return () => {
      setOrderStatus();
      setStatusText();
      setCardColor();
    };
  }, []);

  return (
    // <View style={[{ backgroundColor: cardColor }, styles.container]}>
    //   <View style={styles.container}>
    //     <Text>Order Number: #{item.id}</Text>
    //   </View>
    // </View>
    <View style={[{ backgroundColor: cardColor }, styles.container]}>
      <View style={styles.container}>
        <Text>Order Number: #{item._id}</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text>
          Status: {statusText} {orderStatus}
        </Text>
        <Text>
          Address 1: {item.shippingInfo.address1} 
        </Text>
        <Text>
          Address 2: {item.shippingInfo.address2}
        </Text>
        <Text>City: {item.shippingInfo.city}</Text>
        <Text>Country: {item.shippingInfo.country}</Text>
        <Text>Date Ordered: {item.dateOrdered.split("T")[0]}</Text>
        <View style={styles.priceContainer}>
          <Text>Total Price: </Text>
          <Text style={styles.price}>$ {item.totalPrice}</Text>
        </View>
        {/* {item.editMode ? ( */}
        <View>
      {item.status === "Completed" ? null : <><Select
            width="80%"
            iosIcon={<Icon name="arrow-down" color={"#007aff"} />}
            style={{ width: undefined }}
            selectedValue={statusChange}
            color="white"
            placeholder="Change Status"
            placeholderTextColor="white"
            placeholderStyle={{ color: '#FFFFFF' }}
            placeholderIconColor="#007aff"
            onValueChange={(e) => setStatusChange(e)}
          >
            {codes.map((c) => {
              return <Select.Item
                key={c.code}
                label={c.name}
                value={c.name}
              />
            })}
          </Select>

          <EasyButton
            secondary
            large
            onPress={() => updateOrder()}
          >
            <Text style={{ color: "white" }}>Update</Text>
          </EasyButton></> }
          
        </View>
        {/* //   ) : null} */}
      </View>
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    backgroundColor: "#62B1F6",
    padding: 5,
  },
  priceContainer: {
    marginTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  price: {
    color: "white",
    fontWeight: "bold",
  },
});

export default OrderCard; 