import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, Dimensions, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import EasyButton from '@shared/StyledComponents/EasyButton'

var { width } = Dimensions.get("window");

const ListItem = ({ item, index, deleteProduct }) => {
    const [modalShow, setModalShow] = useState(false);
    const navigation = useNavigation();

    // console.log("item", item);

    const handleBackPress = () => {
        Alert.alert("Delete Product", `Do you want to delete this ${item.product_name}?` ,[
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          {
            text: "Delete",
            onPress: () => [
                deleteProduct(item._id),
                setModalShow(false)
            ]
          },
        ]);
        return true
      };
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
                                    navigation.navigate("ProductUpdate", { item }),
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
                onPress={() => {
                    navigation.navigate("Product Detail", { item });
                }}
                onLongPress={() => setModalShow(true)}
                style={[
                    styles.container,
                    {
                        backgroundColor: index % 2 == 0 ? "white" : "gainsboro"
                    }
                ]}
            >
                <Image
                    source={{
                        uri: item.image[0].url
                    }}
                    resizeMode="contain"
                    style={styles.image}
                />
                <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">
                    {item.product_name }
                </Text>
                <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">
                    {item.stock }
                </Text>
                <Text style={styles.item}>{item.brand}</Text>
                <Text style={styles.item}>$ {item.price}</Text>
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
    image: {
        borderRadius: 50,
        width: width / 6,
        height: 20,
        margin: 2
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