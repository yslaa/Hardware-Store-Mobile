import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native'
import React, { useState, useCallback } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import EasyButton from '@shared/StyledComponents/EasyButton'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import baseURL from '@assets/commons/baseurl'

var { width } = Dimensions.get("window");

const ListItem = ({ item, index, deleteProduct }) => {
    const [modalShow, setModalShow] = useState(false);
    const navigation = useNavigation();
    const [product, setProduct] = useState([])

    console.log("Reviews", item);

    const handleBackPress = () => {
        Alert.alert("Delete Comment", `Do you want to delete this comment?` ,[
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          {
            text: "Delete",
            onPress: () => [
                deleteComment(item._id),
                setModalShow(false)
            ]
          },
        ]);
        return true
      };

      useFocusEffect(
        useCallback(
            () => {
                AsyncStorage.getItem("jwt")
                    .then((res) => {
                        axios
                        .get(`${baseURL}product/${item.product}`,{
                            headers: {Authorization: `Bearer ${res}`}
                        })
                        .then((res) => {
                            const data = res.data.details;
                            console.log("Product: ", data)
                            setProduct(data);
                        })
                        .catch((error) => console.log(error.response.data))
                    })
                    .catch((error) => console.log(error))
                
                return () => {
                    setProduct();
                }
            },
            [],
        )
    )
    console.log("Product Data: ", product)
    return (
        <View>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalShow}
                onRequestClose={() => {
                    setModalShow(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            underlayColor="#E8E8E8"
                            onPress={() => {
                                setModalShow(false);
                            }}
                            style={{
                                alignSelf: "flex-end",
                                padding: 10,
                                

                            }}
                        >
                            <Ionicons name="close-circle" size={20} />
                            <EasyButton
                                medium
                                secondary
                                onPress={() => [
                                    navigation.navigate("ReviewUpdate", { item }),
                                    setModalShow(false)
                                ]}
                                title="Edit"
                            >
                                <Text style={styles.textStyle}>Edit</Text>
                            </EasyButton>

                            <EasyButton
                                medium
                                danger
                                onPress={handleBackPress}
                                title="delete"
                            >
                                <Text style={styles.textStyle}>Delete</Text>
                            </EasyButton>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity
                // onPress={() => {
                //     navigation.navigate("Product Detail", { item });
                // }}
                onLongPress={() => setModalShow(true)}
                style={[
                    styles.container,
                    {
                        backgroundColor: index % 2 == 0 ? "white" : "gainsboro"
                    }
                ]}
            >
                <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">
                    {item.ratings }
                </Text>
                <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">
                    {item.text }
                </Text>
                <Text style={styles.item}></Text>
                <Text style={styles.item}>{product.product_name}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        width: width
    },
    item: {
        flexWrap: "wrap",
        margin: 3,
        width: width / 6
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold"
    }
});

export default ListItem;