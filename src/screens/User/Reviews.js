import { View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator, RefreshControl} from 'react-native'
import React, { useCallback, useState, useContext } from 'react'
import axios from 'axios'
import baseURL from '@assets/commons/baseurl'
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import EasyButton from '@shared/StyledComponents/EasyButton'
import Toast from 'react-native-toast-message'
import ListReview from '@screens/User/ListReview'
import {  Box } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import AuthGlobal from "@context/Store/AuthGlobal";


var { height,width } = Dimensions.get("window"); 

const Reviews = (props) => {
    const context = useContext(AuthGlobal)
    const [reviewList, setReviewList] = useState([])
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const navigation = useNavigation()

    const userID = context.stateUser.userProfile._id

    // console.log("hello",commentList)
    // console.log("User Data: ", context.stateUser.userProfile._id)
    const ListHeader = () => {
        return (
            <View
                elevation={1}
                style={styles.listHeader}
            >
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>Rating</Text>
                </View>
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>Comment</Text>
                </View>
                <View style={styles.headerItem}></View>
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>Product</Text>
                </View>
            </View>
        )
    }

    // console.log("productfil",productFilter)
    const deleteComment = (id) =>
    {
        AsyncStorage.getItem("jwt")
            .then((res) => {
                axios 
                .delete(`${baseURL}comment/${id}`,{
                    headers: {Authorization: `Bearer ${res}`}
                })
                .then((res) =>
                {
                    Toast.show({
                        topOffset: 60,
                        type: "Success",
                        text1: "Comment Deleted",
                    });
                })
                .catch((error) => console.log(error))
            })
       
    }

    const onRefresh = useCallback(() =>{
        setRefreshing(true)
        setTimeout(() =>
        {
            axios
            .get(`${baseURL}comments`, {
                headers: {Authorization: `Bearer ${token}`}
            })
            .then((res)=>
            {
                setReviewList(res.data);
                setLoading(false);
            })
            setRefreshing(false);
        }, 500)
    })

    useFocusEffect(
        useCallback(
            () => {
                AsyncStorage.getItem("jwt")
                    .then((res) => {
                        setToken(res)
                        axios
                        .get(`${baseURL}comments`,{
                            headers: {Authorization: `Bearer ${res}`}
                        })
                        .then((res) => {
                            const data = res.data.details;
                            console.log(data)
                            const comments = res.data.details;
            
                        // Filter comments based on userID
                            const userComment = comments.filter((rev) => rev.user && rev.user._id === userID);
                            setReviewList(userComment);
                            setLoading(false)
                        })
                        .catch((error) => console.log(error.response.data))
                    })
                    .catch((error) => console.log(error))
                
                return () => {
                    setReviewList();
                    setLoading(true);
                }
            },
            [],
        )
    )

    console.log("Reviews: ", reviewList)

    
  return (
    <Box flex={1}>
            {loading ? (
                <View style={styles.spinner}>
                    <ActivityIndicator size="large" color="red" />
                </View>
            ) : (<FlatList
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={ListHeader}
                data={reviewList}
                renderItem={({ item, index }) => (
                    <ListReview
                        item={item}
                        index={index}
                        deleteComment={deleteComment}
                    />
                )}
                keyExtractor={(item) => item.id}
            />)}
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
    }
})
export default Reviews