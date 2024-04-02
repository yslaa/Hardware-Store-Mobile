import React, { useState, useCallback, useContext } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Button, View as Divider, TextInput, TouchableOpacity } from "react-native";
import { Text, HStack, VStack, Avatar, Spacer, Center } from "native-base";

import Icon from 'react-native-vector-icons/FontAwesome'
import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/commons/baseurl";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@context/Store/AuthGlobal";


var { width, height } = Dimensions.get("window");

const StarRating = ({ rating, onRate }) => {
  const stars = [1, 2, 3, 4, 5];
  
    return (
      <View style={{ flexDirection: 'row' }}>
        {stars.map((star) => (
          <TouchableOpacity key={star} onPress={() => onRate(star)}>
            <Icon
              name={star <= rating ? 'star' : 'star-o'}
              size={20}
              color={star <= rating ? 'orange' : 'gray'}
            />
          </TouchableOpacity>
        ))}
        <Text style={{ marginLeft: 5 }}>{rating} stars</Text>
      </View>
    );
};

const Comment = ({ route }) => {

  const navigation = useNavigation()

    // console.log("Data", route.params)
    const context = useContext(AuthGlobal)
    const itemDetails = route.params.product
    const [brands, setBrands] = useState()
    const [rating, setRating] = useState()
    const [comments, setComments] = useState('')

    useFocusEffect(
        useCallback(()=> {
            AsyncStorage.getItem("jwt")
            .then((res) => {
                axios.get(`${baseURL}brand/${itemDetails.brand}`,  {
                    headers: {
                        Authorization: `Bearer ${res}`,
                    },
                })
                .then((res) => {
                    // console.log(res.data)
                    if (res.status == 200 || res.status == 201) {
                      Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Brand Details Get"
                    });
                        setBrands(res.data)
                }})
                .catch((error) => {
                    Toast.show({
                        topOffset: 60,
                        type: "error",
                        text1: "Something went wrong",
                        text2: "Please try again",
                    });
                    console.log(error.response.data)
                    return
                })
            },
        [],
    )
        })
    )
    // console.log("User Profile: ",context.stateUser?.userProfile?.name)

    const submitComment = () => {
        if (comments.trim() === '') {
            Toast.show({
                topOffset: 60,
                type: "warning",
                text1: "Please enter a comment"
            });
            return;
        }
                    
        const commentData = {
            product: itemDetails.productId,
            ratings: rating,
            text: comments,
            user: {
              _id: context.stateUser.userProfile._id,
              username: context.stateUser.userProfile.name
            }
        };

        console.log(commentData)
                    
        AsyncStorage.getItem("jwt")
            .then((res) => {
                axios.post(`${baseURL}/comments`, commentData, {
                    headers: {
                        Authorization: `Bearer ${res}`,
                    },
                })
                .then((res) => {
                    console.log(res.data)
                    if (res.status == 200 || res.status == 201) {
                        Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Comment Posted",
                        });
                        setBrands(res.data)
                        navigation.navigate("User History")
                }})
                .catch((error) => {
                    Toast.show({
                        topOffset: 60,
                        type: "error",
                        text1: "Something went wrong",
                        text2: "Please try again",
                    });
                    console.log(error.response.data)
                    return
                })
            })
    }

    const handleRate = (newRating) => {
        setRating(newRating);
      };

  return (
    <Center style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Product Details</Text>
          {itemDetails && brands ? (
            <View style={styles.productDetails}>
              <Text style={styles.title}>{itemDetails.product_name}</Text>
              <View style={styles.productInfo}>
                <Avatar style={{ alignSelf: "center" }} size="48px" source={{ uri: itemDetails.image?.[0]?.url }} />
                <View style={{ marginLeft: 10 }}>
                  <Text>Brand: {brands.details.brand_name}</Text>
                  <Text>Variant: {brands.details.variant}</Text>
                  <Text>Type: {itemDetails.productType}</Text>
                  <Text>Price: ${itemDetails.price}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />

              <Text style={styles.title}>Rate this Product</Text>
              <StarRating rating={rating} onRate={handleRate} />

              <TextInput
                style={styles.commentInput}
                multiline={true}
                numberOfLines={4}
                placeholder="Comment here..."
                onChangeText={setComments}
                value={comments}
              />

              <Button onPress={() => submitComment()} title="Submit Comment" size="sm" variant="outline" />
              {/* <View style={styles.toastContainer}>
                <Toast/>
              </View> */}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </Center>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "white",
  },
  contentContainer: {
    paddingBottom: 20, 
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  title: {
    alignSelf: "center",
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  productDetails: {
    borderWidth: 1,
    borderColor: "orange",
    padding: 10,
    borderRadius: 5, 
  },
  productInfo: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center', 
  },
    divider: {
        borderWidth: 1,
        borderColor: 'orange',
        marginBottom: 10,
    },
    commentInput: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
      },
    toastContainer: {
      position: 'absolute',
      top: 20,
      width: '100%',
      paddingHorizontal: 20,
      justifyContent: 'center'
    }
});

export default Comment